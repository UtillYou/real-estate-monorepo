import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ListingsPage from './pages/ListingsPage';
import { ProtectedRoute } from './ProtectedRoute';
import { Layout, Button } from 'antd';
import { AuthProvider, useAuth } from './AuthContext';
import './App.css';

const { Header, Content } = Layout;

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <div>
      <h2>Welcome to the Public Site!</h2>
      <p>You are logged in as <b>{user?.email}</b>.</p>
      <Button onClick={handleLogout}>Logout</Button>
      <Button type="link" onClick={() => navigate('/listings')} style={{ marginLeft: 16 }}>
        View Listings
      </Button>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Header style={{ color: 'white' }}>Public Site</Header>
          <Content style={{ padding: '24px' }}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/listings" element={<ListingsPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Content>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
