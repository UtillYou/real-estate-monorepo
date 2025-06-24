import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  let isUser = false;
  try {
    isUser = user ? JSON.parse(user).role === 'user' : false;
  } catch {
    isUser = false;
  }
  if (!token || !isUser) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};
