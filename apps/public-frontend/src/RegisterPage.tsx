import React from 'react';
import RegisterForm from './RegisterForm';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  return <RegisterForm onRegisterSuccess={() => navigate('/login')} />;
};

export default RegisterPage;
