import React from 'react';
import { Table, Button, Tag, Switch, Space, Popconfirm, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { User } from '../types';
import { useTranslation } from 'react-i18next';

interface Props {
  data: User[];
  loading: boolean;
  onEdit: (user: User) => void;
}

const UsersTable: React.FC<Props> = ({ data, loading, onEdit }) => {
  const queryClient = useQueryClient();
   const { t } = useTranslation();
  
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      message.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => {
      message.error('Failed to delete user');
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: number; role: 'admin' | 'user' }) => {
      await api.put(`/users/${id}/role`, { role });
    },
    onSuccess: () => {
      message.success('User role updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => {
      message.error('Failed to update user role');
    },
  });

  const handleRoleChange = (checked: boolean, user: User) => {
    updateRoleMutation.mutate({
      id: user.id,
      role: checked ? 'admin' : 'user',
    });
  };

  const columns = [
    {
      title: t('users.name', 'Name'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: User) => (
        <Space>
          {record.avatar ? (
            <img 
              src={record.avatar} 
              alt={record.name} 
              style={{ width: 24, height: 24, borderRadius: '50%' }} 
            />
          ) : (
            <UserOutlined style={{ fontSize: 20 }} />
          )}
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: t('users.email', 'Email'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('users.role', 'Role'),
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'blue' : 'default'}>{role}</Tag>
      ),
    },
    {
      title: t('users.joined', 'Joined'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: t('users.admin', 'Admin'),
      key: 'admin',
      render: (_: any, record: User) => (
        <Switch 
          checked={record.role === 'admin'} 
          onChange={(checked) => handleRoleChange(checked, record)}
          disabled={updateRoleMutation.isPending}
        />
      ),
    },
    {
      title: t('common.actions', 'Actions'),
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          <Button 
            onClick={() => onEdit(record)}
            style={{ marginRight: 8 }}
          >
            {t('common.edit', 'Edit')}
          </Button>
          <Popconfirm 
            title="Are you sure you want to delete this user?" 
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>{t('common.delete', 'Delete')}</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      scroll={{ y: 'calc(100vh - 300px)' }}
    />
  );
};

export default UsersTable;
