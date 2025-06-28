import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Tag,
  Tooltip,
  Input,
  Modal
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { Listing, deleteListing } from '../api/listings';
import { useQueryClient } from '@tanstack/react-query';

type PropertyType = 'APARTMENT' | 'HOUSE' | 'CONDO' | 'TOWNHOUSE' | 'LAND' | 'COMMERCIAL' | 'OTHER';

interface Props {
  data: Listing[];
  loading: boolean;
  onEdit: (listing: Listing) => void;
  searchValue: string;
  onSearch?: (value: string) => void;
}

const ListingsTable: React.FC<Props> = ({
  data = [],
  loading,
  onEdit,
  searchValue,
  onSearch
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [localSearchValue, setLocalSearchValue] = useState('');

  // Define property type filters
  const propertyTypeFilters = useMemo(() => [
    { text: t('listings.apartment', 'Apartment'), value: 'APARTMENT' },
    { text: t('listings.house', 'House'), value: 'HOUSE' },
    { text: t('listings.condo', 'Condo'), value: 'CONDO' },
    { text: t('listings.townhouse', 'Townhouse'), value: 'TOWNHOUSE' },
    { text: t('listings.land', 'Land'), value: 'LAND' },
    { text: t('listings.commercial', 'Commercial'), value: 'COMMERCIAL' },
    { text: t('listings.other', 'Other'), value: 'OTHER' },
  ], [t]);

  // Sync local search value with prop
  useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(localSearchValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReset = () => {
    setLocalSearchValue('');
    if (onSearch) {
      onSearch('');
    }
  };

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    try {
      Modal.confirm({
        title: t('common.confirmDelete', 'Confirm Delete'),
        content: t('listings.confirmDelete', 'Are you sure you want to delete this listing?'),
        okText: t('common.yes', 'Yes'),
        okType: 'danger',
        cancelText: t('common.no', 'No'),
        onOk: async () => {
          try {
            setDeletingId(id);
            await deleteListing(id);
            message.success(t('listings.deleted', 'Listing deleted successfully'));
            // Invalidate the listings query to refetch data
            await queryClient.invalidateQueries({ queryKey: ['listings'] });
          } catch (error: any) {
            console.error('Error deleting listing:', error);
            message.error(
              error?.response?.data?.message ||
              t('listings.deleteFailed', 'Failed to delete listing')
            );
          } finally {
            setDeletingId(null);
          }
        },
        onCancel: () => {
          setDeletingId(null);
        }
      });
    } catch (error) {
      console.error('Error showing delete confirmation:', error);
      setDeletingId(null);
    }
  };

  const columns = [
    {
      title: t('listings.property', 'Property'),
      dataIndex: 'title',
      key: 'property',
      render: (_: any, record: Listing) => (
        <Space direction="vertical" size={0}>
          <span>{record.title}</span>
          <small className="text-muted">
            {record.bedrooms} {t('listings.bed', 'bd')} •
            {record.bathrooms} {t('listings.bath', 'ba')} •
            {record.squareFeet} {t('listings.sqft', 'sqft')}
          </small>
        </Space>
      ),
    },
    {
      title: t('listings.price', 'Price'),
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price?.toLocaleString()}`,
      sorter: (a: Listing, b: Listing) => (a.price || 0) - (b.price || 0),
    },
    {
      title: t('listings.type', 'Type'),
      dataIndex: 'propertyType',
      key: 'type',
      filters: propertyTypeFilters,
      onFilter: (value: any, record: Listing) =>
        record.propertyType === value,
      render: (type: PropertyType) => (
        <Tag color="blue">
          {type?.charAt(0) + type?.slice(1).toLowerCase()}
        </Tag>
      ),
    },
    {
      title: t('listings.location', 'Location'),
      dataIndex: 'address',
      key: 'location',
      render: (_: any, record: Listing) => (
        <Tooltip title={record.address}>
          <span className="text-ellipsis" style={{ maxWidth: '200px', display: 'inline-block' }}>
            {record.address}
          </span>
        </Tooltip>
      ),
    },
    {
      title: t('listings.status', 'Status'),
      dataIndex: 'isActive',
      key: 'status',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive
            ? t('listings.active', 'Active')
            : t('listings.inactive', 'Inactive')}
        </Tag>
      ),
      filters: [
        { text: t('listings.active', 'Active'), value: true },
        { text: t('listings.inactive', 'Inactive'), value: false },
      ],
      onFilter: (value: any, record: Listing) =>
        record.isActive === value,
    },
    {
      title: t('listings.createdAt', 'Created At'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : '-',
      sorter: (a: Listing, b: Listing) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      },
    },
    {
      title: t('common.actions', 'Actions'),
      key: 'actions',
      fixed: 'right' as const,
      width: 120,
      render: (_: any, record: Listing) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Button
            type="text"
            danger
            onClick={() => handleDelete(record.id)}
            disabled={!record.isActive || deletingId === record.id}
            loading={deletingId === record.id}
            icon={<DeleteOutlined />}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Input
            placeholder={t('listings.searchPlaceholder', 'Search by title or address...')}
            prefix={<SearchOutlined />}
            value={localSearchValue}
            onChange={(e) => setLocalSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ flex: 1, maxWidth: '400px' }}
            allowClear
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            loading={loading}
          >
            {t('common.search', 'Search')}
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleReset}
            disabled={loading}
            style={{ display: onSearch ? 'inline-flex' : 'none' }}
          >
            {t('common.reset', 'Reset')}
          </Button>
        </div>
      </div>

      <Table
        dataSource={data}
        rowKey="id"
        loading={loading}
        columns={columns}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total: number, range: [number, number]) =>
            t('listings.showingProperties', 'Showing {{from}}-{{to}} of {{total}} properties', {
              from: range[0] + 1,
              to: range[1],
              total
            })
        }}
        rowClassName={(record: Listing) => record.isActive ? 'active-row' : 'inactive-row'}
      />
    </div>
  );
};

export default ListingsTable;
