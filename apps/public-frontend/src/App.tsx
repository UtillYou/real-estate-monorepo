import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, Layout } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PropertyDetails from './pages/PropertyDetails';
import PropertiesList from './pages/PropertiesList';
import SearchPage from './pages/SearchPage';
import Footer from './components/Footer';
import './App.css';

const { Content } = Layout;

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 8,
          },
          components: {
            Button: {
              borderRadius: 6,
            },
            Input: {
              borderRadius: 6,
            },
            Select: {
              borderRadius: 6,
            },
          },
        }}
      >
        <Router>
          <Layout className="app-layout">
            <Navbar />
            <Content className="app-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/properties" element={<PropertiesList />} />
                <Route path="/properties/:id" element={<PropertyDetails />} />
                {/* Add more routes as needed */}
              </Routes>
            </Content>
            <Footer />
          </Layout>
        </Router>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
