import React from 'react';
import LoginForm from './LoginForm';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  return <LoginForm onLoginSuccess={() => navigate('/')} />;
};

export default LoginPage;
