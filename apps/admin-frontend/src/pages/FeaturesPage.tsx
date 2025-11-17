import React, { useState, useMemo, useEffect } from 'react';
import {  message, Button, Space } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import FeaturesTable from '../components/FeaturesTable';
import FeatureForm from '../components/FeatureForm';
import { 
  Feature, 
  getFeatures, 
  createFeature, 
  updateFeature, 
  deleteFeature 
} from '../api/features';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';

const FeaturesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | undefined>(undefined);
  const { t } = useTranslation();

  // Fetch features with search
  const { data: features = [], isLoading, refetch } = useQuery({
    queryKey: ['features', searchValue],
    queryFn: () => getFeatures(searchValue),
  });

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchValue(value);
      }, 300),
    []
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearch = (value: string) => {
    debouncedSearch(value);
  };

  const createMutation = useMutation({
    mutationFn: createFeature,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      message.success('Feature created successfully');
      setModalOpen(false);
    },
    onError: () => {
      message.error('Failed to create feature');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: Partial<Feature> }) =>
      updateFeature(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      message.success('Feature updated successfully');
      setModalOpen(false);
    },
    onError: () => {
      message.error('Failed to update feature');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFeature,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      message.success('Feature deleted successfully');
    },
    onError: () => {
      message.error('Failed to delete feature');
    },
  });

  const handleCreate = () => {
    setEditingFeature(undefined);
    setModalOpen(true);
  };

  const handleEdit = (feature: Feature) => {
    setEditingFeature(feature);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleSubmit = (values: Omit<Feature, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingFeature) {
      updateMutation.mutate({ id: editingFeature.id, values });
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>{t('features.title', 'Features')}</h2>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            loading={isLoading}
          >
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Add Feature
          </Button>
        </Space>
      </div>

      <FeaturesTable
        data={features}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={handleSearch}
        searchValue={searchValue}
      />

      <FeatureForm
        open={modalOpen}
        initialValues={editingFeature}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default FeaturesPage;
