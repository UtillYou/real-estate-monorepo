import React from 'react';
import LoginForm from './LoginForm';
import { useNavigate, useLocation } from 'react-router-dom';

import { Card, Typography } from 'antd';
import logo from './resources/logo192.png';

const { Title, Text, Link } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';
  
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <Card style={{ width: 360, boxShadow: '0 4px 24px rgba(0,0,0,0.09)' }} bordered={false}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src={logo} alt="logo" style={{ width: 56, height: 56, marginBottom: 8 }} />
          <Title level={3} style={{ marginBottom: 0 }}>Real Estate System</Title>
          <Text type="secondary">Sign in to your account</Text>
        </div>
        <LoginForm onLoginSuccess={() => navigate(from, { replace: true })} />
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Text type="secondary">Don't have an account?</Text>{' '}
          <Link onClick={() => navigate('/register')}>Register</Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
