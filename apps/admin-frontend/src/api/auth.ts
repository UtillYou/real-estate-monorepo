import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_URL = '/api/auth';

// Store the refresh token request to prevent multiple refresh attempts
let refreshTokenRequest: Promise<{ access_token: string }> | null = null;

// Create axios instance with base config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This is required for cookies to be sent with requests
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // If error is not 401 or if it's a refresh token request, reject
    if (error.response?.status !== 401 || originalRequest.url?.includes('refresh-token') || !originalRequest._retry) {
      if (error.response?.status === 401) {
        // Clear auth data if unauthorized and not a refresh attempt
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refresh_token');
        // Redirect to login will be handled by the AuthContext
      }
      return Promise.reject(error);
    }

    // Mark the request as retried to prevent infinite loops
    originalRequest._retry = true;

    try {
      // Try to refresh the token
      const newToken = await refreshAccessToken();
      
      // Update the Authorization header
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }
      
      // Retry the original request
      return api(originalRequest);
    } catch (refreshError) {
      // If refresh fails, clear auth and reject
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refresh_token');
      return Promise.reject(refreshError);
    }
  }
);

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

interface RegisterResponse {
  user: any;
  access_token: string;
}

export const register = async (
  email: string, 
  password: string, 
  name: string, 
  avatar?: string
): Promise<ApiResponse<RegisterResponse>> => {
  try {
    // Use a direct axios call to avoid the interceptor for registration
    const response = await axios.post<RegisterResponse>(
      `${API_URL}/register`, 
      { email, password, name, avatar },
      { withCredentials: true }
    );
    
    return { data: response.data };
  } catch (error) {
    const err = error as AxiosError;
    return { 
      error: (err.response?.data as any)?.message || 'Registration failed',
      message: err.message 
    };
  }
};

interface LoginResponse {
  user: any;
  access_token: string;
}

export const login = async (
  email: string, 
  password: string
): Promise<ApiResponse<LoginResponse>> => {
  try {
    // Use a direct axios call to avoid the interceptor for login
    const response = await axios.post<LoginResponse>(
      `${API_URL}/login`, 
      { email, password },
      { withCredentials: true }
    );
    
    // The refresh token is stored in an HTTP-only cookie
    // and will be sent automatically with subsequent requests
    return { data: response.data };
  } catch (error) {
    const err = error as AxiosError;
    return { 
      error: (err.response?.data as any)?.message || 'Login failed',
      message: err.message 
    };
  }
};

export const refreshAccessToken = async (): Promise<string> => {
  // The refresh token is stored in an HTTP-only cookie, so we don't need to send it manually
  try {
    // If we already have a refresh request in progress, return that
    if (refreshTokenRequest) {
      const { access_token } = await refreshTokenRequest;
      return access_token;
    }

    // Set up the refresh token request
    refreshTokenRequest = api.post<{ access_token: string }>('/refresh-token', {})
      .then(response => response.data);

    const { access_token } = await refreshTokenRequest;
    
    if (!access_token) {
      throw new Error('No access token received');
    }
    
    // Update the stored token
    localStorage.setItem('token', access_token);
    
    return access_token;
  } catch (error) {
    // Clear auth data if refresh fails
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    throw error;
  } finally {
    // Reset the refresh token request
    refreshTokenRequest = null;
  }
};

export const verifyToken = async (): Promise<{ user: any } | null> => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return null;
  }
  
  try {
    // First, verify the token structure
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    // Check if token is expired or about to expire (within 5 minutes)
    const tokenPayload = JSON.parse(atob(tokenParts[1]));
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = tokenPayload.exp - now;
    
    // If token is expired or will expire in the next 5 minutes, try to refresh it
    if (expiresIn < 300) { // 5 minutes in seconds
      try {
        const newToken = await refreshAccessToken();
        if (!newToken) {
          throw new Error('Failed to refresh token: No new token received');
        }
        // Update the stored token
        localStorage.setItem('token', newToken);
      } catch (error) {
        console.error('Failed to refresh token:', error);
        // Clear auth data if refresh fails
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
      }
    }
    
    // Parse user data
    const user = JSON.parse(userStr);
    if (!user || !user.id || !user.email) {
      throw new Error('Invalid user data');
    }
    
    return { user };
  } catch (error) {
    console.error('Error verifying token:', error);
    // Clear auth data on error
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    // This will clear the HTTP-only refresh token cookie
    await api.post('/logout');
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    // Always clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
