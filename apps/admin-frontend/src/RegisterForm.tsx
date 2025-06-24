import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import AvatarUploader from './components/AvatarUploader';
import { useAuth } from './AuthContext';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  
  const onFinish = async (values: { name: string; email: string; password: string; avatar?: string }) => {
    try {
      setIsLoading(true);
      await register(values.email, values.password, values.name, values.avatar);
      // Navigate to success page with email as URL parameter
      navigate(`/register/success?email=${encodeURIComponent(values.email)}`);
    } catch (err: any) {
      // Handle both new error format and legacy format
      const errorMessage = err.message || err.response?.data?.message || 'Registration failed. Please check your input.';
      messageApi.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ name: '', email: '', password: '', repeatPassword: '', avatar: '' }}
      >
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please enter your name' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="avatar"
        label="Avatar"
        valuePropName="value"
      >
        <AvatarUploader />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters' }]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="repeatPassword"
        label="Repeat Password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          { required: true, message: 'Please confirm your password' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Button 
        type="primary" 
        htmlType="submit" 
        loading={isLoading} 
        disabled={isLoading}
      >
        {isLoading ? 'Registering...' : 'Register'}
      </Button>
    </Form>
    </>
  );
};

export default RegisterForm;
