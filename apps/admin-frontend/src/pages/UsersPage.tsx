import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { User } from '../types';
import UsersTable from '../components/UsersTable';
import UserForm from '../components/UserForm';
import { useTranslation } from 'react-i18next';

const UsersPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/users');
      return data;
    },
  });

  const handleCreate = () => {
    setEditingUser(null);
    setIsModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Handle save logic here
      message.success(editingUser ? 'User updated successfully' : 'User created successfully');
      setIsModalVisible(false);
      setEditingUser(null);
    } catch (error) {
      message.error(editingUser ? 'Failed to update user' : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button 
          type="primary" 
          onClick={handleCreate}
          style={{ marginBottom: 16 }}
        >
          {t('users.createUser', 'Add user')}
        </Button>
      </div>
      
      <UsersTable 
        data={users} 
        loading={isLoading} 
        onEdit={handleEdit}
      />
      
      <Modal
        title={editingUser ? t('users.editUser', 'Edit User') : t('users.createUser', 'Create User')}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        destroyOnClose
      >
        <UserForm 
          initialValues={editingUser || undefined}
          onSubmit={handleSubmit}
          loading={loading}
          onCancel={handleModalCancel}
        />
      </Modal>
    </div>
  );
};

export default UsersPage;
