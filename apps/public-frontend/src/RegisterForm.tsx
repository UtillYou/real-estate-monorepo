import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { register } from './api/auth';

const RegisterForm: React.FC<{ onRegisterSuccess?: () => void }> = ({ onRegisterSuccess }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await register(values.email, values.password);
      messageApi.success('Registration successful! Please login.');
      if (onRegisterSuccess) onRegisterSuccess();
    } catch (err: any) {
      messageApi.error(err.response?.data?.message || 'Registration failed. Please check your input.');
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
        rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters' }]}
      >
        <Input.Password />
      </Form.Item>
      <Button type="primary" htmlType="submit">Register</Button>
    </Form>
    </>
  );
};

export default RegisterForm;
