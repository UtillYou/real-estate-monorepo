import React, { useEffect } from 'react';
import { Result, Button, Typography, Card } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import logo from '../resources/logo192.png';

const { Title, Text } = Typography;

const RegisterSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  useEffect(() => {
    // If no email parameter, redirect to register page
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <Card style={{ width: 520, boxShadow: '0 4px 24px rgba(0,0,0,0.09)' }} bordered={false}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src={logo} alt="logo" style={{ width: 56, height: 56, marginBottom: 8 }} />
          <Title level={3} style={{ marginBottom: 8 }}>Registration Successful!</Title>
          <Text type="secondary">Your account has been created</Text>
        </div>
        
        <Result
          status="success"
          icon={<CheckCircleFilled style={{ color: '#52c41a', fontSize: '64px' }} />}
          title={
            <div style={{ marginTop: 16, marginBottom: 24 }}>
              <div style={{ marginBottom: 8 }}>Thank you for registering, {email}!</div>
              <Text type="secondary">
                Your account is pending admin approval. You'll receive an email once your account is activated.
              </Text>
            </div>
          }
          extra={[
            <Button 
              type="primary" 
              key="login" 
              onClick={() => navigate('/login')}
              style={{ marginTop: 16 }}
            >
              Go to Login
            </Button>,
          ]}
        />
        
        <div style={{ textAlign: 'center', marginTop: 24, color: 'rgba(0, 0, 0, 0.45)' }}>
          <Text>Didn't receive an email? Check your spam folder or contact support.</Text>
        </div>
      </Card>
    </div>
  );
};

export default RegisterSuccessPage;
