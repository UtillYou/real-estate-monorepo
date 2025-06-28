import React, { useState, useMemo } from 'react';
import { Table, Space, Button, Popconfirm, Input } from 'antd';
import { DeleteOutlined, EditOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { Feature } from '../api/features';
import { debounce } from 'lodash';

interface FeaturesTableProps {
  data: Feature[];
  loading: boolean;
  onEdit: (feature: Feature) => void;
  onDelete: (id: number) => void;
  onSearch: (value: string) => void;
  searchValue: string;
}

const FeaturesTable: React.FC<FeaturesTableProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
  onSearch,
  searchValue,
}) => {
  // Filter data based on search input
  const [localSearchValue, setLocalSearchValue] = useState('');

  // Sync local search value with prop
  React.useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchValue(e.target.value);
  };

  const handleSearch = () => {
    onSearch(localSearchValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReset = () => {
    setLocalSearchValue('');
    onSearch('');
  };

  // Filter data based on search input (client-side filtering)
  const filteredData = useMemo(() => {
    if (!searchValue) return data;
    const searchLower = searchValue.toLowerCase();
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchLower) ||
        (item.icon && item.icon.toLowerCase().includes(searchLower))
    );
  }, [data, searchValue]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
      render: (icon: string) => icon || '—',
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: Feature) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            aria-label="Edit"
          />
          <Popconfirm
            title="Are you sure to delete this feature?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} aria-label="Delete" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Input
            placeholder="Search features by name or icon..."
            prefix={<SearchOutlined />}
            value={localSearchValue}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            style={{ flex: 1, maxWidth: '400px' }}
            allowClear
          />
          <Button 
            type="primary" 
            icon={<SearchOutlined />} 
            onClick={handleSearch}
          >
            Search
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        loading={loading}
        scroll={{ y: 'calc(100vh - 300px)' }}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
        }}
      />
    </>
  );
};

export default FeaturesTable;
