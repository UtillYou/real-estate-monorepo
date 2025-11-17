import React from 'react';
import { Form, Input, Button, Switch, FormProps, Space, Upload, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { User } from '../types';
import { useTranslation } from 'react-i18next';

interface UserFormProps {
  initialValues?: Partial<User>;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const isEdit = !!initialValues?.id;

  const onFinish: FormProps['onFinish'] = (values) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Form.Item
        name="avatar"
        label={t('users.avatar', 'Profile Picture')}
        valuePropName="fileList"
        getValueFromEvent={(e) => e?.fileList}
      >
        <Upload
          name="avatar"
          listType="picture-card"
          showUploadList={false}
          beforeUpload={() => false}
        >
          {initialValues?.avatar ? (
            <Avatar
              src={initialValues.avatar}
              size={100}
              icon={<UserOutlined />}
            />
          ) : (
            <div>
              <UserOutlined style={{ fontSize: 24 }} />
              <div style={{ marginTop: 8 }}>{t('common.upload', 'Upload')}</div>
            </div>
          )}
        </Upload>
      </Form.Item>

      <Form.Item
        name="name"
        label={t('users.name', 'Full Name')}
        rules={[{ required: true, message: 'Please input the full name!' }]}
      >
        <Input placeholder="Enter full name" />
      </Form.Item>

      <Form.Item
        name="email"
        label={t('users.email', 'Email')}
        rules={[
          { required: true, message: 'Please input the email!' },
          { type: 'email', message: 'Please enter a valid email!' },
        ]}
      >
        <Input placeholder="Enter email" disabled={isEdit} />
      </Form.Item>

      {!isEdit && (
        <Form.Item
          name="password"
          label={t('users.password', 'Password')}
          rules={[
            { required: !isEdit, message: 'Please input the password!' },
            { min: 6, message: 'Password must be at least 6 characters!' },
          ]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>
      )}

      <Form.Item
        name="role"
        label={t('users.role', 'Role')}
        valuePropName="checked"
        initialValue={false}
      >
        <Switch
          checkedChildren="Admin"
          unCheckedChildren="User"
          defaultChecked={initialValues?.role === 'admin'}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEdit ? t('common.update', 'Update') : t('common.create', 'Create')}
          </Button>
          <Button onClick={onCancel} disabled={loading}>
            {t('common.cancel', 'Cancel')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
