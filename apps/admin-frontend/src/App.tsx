import React, { Suspense, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Refine } from '@refinedev/core';
import { RefineThemes, notificationProvider, ErrorComponent } from '@refinedev/antd';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ConfigProvider, Spin, App as AntdApp, notification } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import { AuthProvider, useAuth } from './AuthContext';
import SidebarLayout from './components/SidebarLayout';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import RegisterSuccessPage from './pages/RegisterSuccessPage';
import ListingsPage from './pages/ListingsPage';
import UsersPage from './pages/UsersPage';
import FeaturesPage from './pages/FeaturesPage';
import DashboardPage from './pages/DashboardPage';
import RolesPage from './pages/RolesPage';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './i18n/i18n';
import '@refinedev/antd/dist/reset.css';
import 'antd/dist/reset.css';
import CustomErrorPage from './pages/CustomErrorPage';

// Add a loading component for Suspense
const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
    <Spin size="large" />
  </div>
);

// Error boundary for i18n
class I18nErrorBoundary extends React.Component<{ children: React.ReactNode }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('i18n error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Something went wrong with translations</h2>
          <p>Please refresh the page or contact support if the issue persists.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const PrivateRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    // Redirect to login page with the return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{element}</>;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AppContent: React.FC = () => {
  const { t, ready } = useTranslation();
  
  // Show loading state while i18n is initializing
  if (!ready) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip={t('common.loading', 'Loading...')} />
      </div>
    );
  }
  
  return (
    <I18nErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider
            theme={RefineThemes.Blue}
            locale={i18n.language === 'zh' ? zhCN : enUS}
          >
            <AntdApp>
              <AuthProvider>
                <BrowserRouter>
                  <Refine
                    notificationProvider={notificationProvider}
                    resources={[
                      {
                        name: 'listings',
                        list: '/listings',
                        create: '/listings/create',
                        edit: '/listings/edit/:id',
                        show: '/listings/show/:id',
                        meta: {
                          label: t('listings.title'),
                        },
                      },
                      {
                        name: 'users',
                        list: '/users',
                        meta: {
                          label: t('users.title'),
                        },
                      },
                      {
                        name: 'features',
                        list: '/features',
                        meta: {
                          label: t('features.title'),
                        },
                      },
                    ]}
                    options={{
                      syncWithLocation: true,
                      warnWhenUnsavedChanges: true,
                    }}
                  >
                    <Routes>
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/register/success" element={<RegisterSuccessPage />} />
                      
                      <Route
                        path="/"
                        element={
                          <PrivateRoute
                            element={
                              <SidebarLayout>
                                <DashboardPage />
                              </SidebarLayout>
                            }
                          />
                        }
                      />
                      
                      <Route
                        path="/listings/*"
                        element={
                          <PrivateRoute
                            element={
                              <SidebarLayout>
                                <ListingsPage />
                              </SidebarLayout>
                            }
                          />
                        }
                      />
                      
                      <Route
                        path="/dashboard"
                        element={
                          <PrivateRoute
                            element={
                              <SidebarLayout>
                                <DashboardPage />
                              </SidebarLayout>
                            }
                          />
                        }
                      />
                      
                      <Route
                        path="/users"
                        element={
                          <PrivateRoute
                            element={
                              <SidebarLayout>
                                <UsersPage />
                              </SidebarLayout>
                            }
                          />
                        }
                      />
                      
                      <Route
                        path="/features"
                        element={
                          <PrivateRoute
                            element={
                              <SidebarLayout>
                                <FeaturesPage />
                              </SidebarLayout>
                            }
                          />
                        }
                      />
                      
                      <Route
                        path="/roles"
                        element={
                          <PrivateRoute
                            element={
                              <SidebarLayout>
                                <RolesPage />
                              </SidebarLayout>
                            }
                          />
                        }
                      />
                      
                      <Route path="*" element={<CustomErrorPage />} />
                    </Routes>
                  </Refine>
                </BrowserRouter>
              </AuthProvider>
            </AntdApp>
          </ConfigProvider>
        </QueryClientProvider>
      </Suspense>
    </I18nErrorBoundary>
  );
};

const App: React.FC = () => (
  <I18nextProvider i18n={i18n}>
    <AppContent />
  </I18nextProvider>
);

export default App;
