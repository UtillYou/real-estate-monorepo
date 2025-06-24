import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { login } from './api/auth';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC<{ onLoginSuccess?: () => void }> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const res = await login(values.email, values.password);
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      messageApi.success('Login successful!');
      if (onLoginSuccess) onLoginSuccess();
      navigate('/listings');
    } catch (err: any) {
      messageApi.error(err.response?.data?.message || 'Invalid email or password.');
    }
  };

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ email: '', password: '' }}
      >
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
        rules={[{ required: true, message: 'Please enter your password' }]}
      >
        <Input.Password />
      </Form.Item>
      <Button type="primary" htmlType="submit">Login</Button>
    </Form>
    </>
  );
};

export default LoginForm;
