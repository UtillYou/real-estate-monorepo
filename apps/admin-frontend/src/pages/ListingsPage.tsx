import React, { useState, useEffect } from 'react';
import { Modal, message, Button } from 'antd';
import { ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import ListingsTable from '../components/ListingsTable';
import ListingForm from '../components/ListingForm';
import { Listing, createListing, updateListing, fetchListings } from '../api/listings';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const ListingsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      message.success('Listing created');
      setModalOpen(false);
    },
    onError: () => {
      message.error('Operation failed');
    },
    onSettled: () => setLoading(false),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number, values: any }) => updateListing(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      message.success('Listing updated');
      setModalOpen(false);
    },
    onError: () => {
      message.error('Operation failed');
    },
    onSettled: () => setLoading(false),
  });
  const [editing, setEditing] = useState<Listing | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Sync search text with search term when it changes from outside
  useEffect(() => {
    setSearchText(searchTerm);
  }, [searchTerm]);

  const { t, i18n } = useTranslation();
  
  // Fetch listings data
  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['listings', searchTerm],
    queryFn: () => fetchListings({ search: searchTerm }),
  });
  
  // Re-render when language changes
  const [currentLang, setCurrentLang] = useState<string>(i18n.language);
  
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLang(lng);
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);
  

  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (listing: Listing) => {
    setEditing(listing);
    setModalOpen(true);
  };

  const handleSubmit = (values: any) => {
    setLoading(true);
    const sanitizedValues = {
      ...values,
      // Ensure numeric fields are numbers
      price: Number(values.price) || 0,
      bedrooms: Number(values.bedrooms) || 0,
      bathrooms: Number(values.bathrooms) || 0,
      squareFeet: Number(values.squareFeet) || 0,
      yearBuilt: values.yearBuilt ? Number(values.yearBuilt) : undefined,
      // Ensure features is an array
      features: Array.isArray(values.features) ? values.features : [],
      // Ensure imageUrls is an array
      imageUrls: Array.isArray(values.imageUrls) 
        ? values.imageUrls 
        : values.imageUrls ? [values.imageUrls] : [],
      isActive: !!values.isActive,
    } as any; // Type assertion since we're handling the type conversion
    
    if (editing) {
      updateMutation.mutate({ id: editing.id, values: sanitizedValues });
    } else {
      createMutation.mutate(sanitizedValues);
    }
  };



  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>{t('listings.listingsManagement', 'Listings Management')}</h2>
          <div>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ['listings'] });
                message.success('Listings refreshed');
              }}
              style={{ marginRight: 8 }}
            >
              {t('common.refresh', 'Refresh')}
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleCreate}
            >
              {t('listings.createListing', 'Create Listing')}
            </Button>
          </div>
        </div>

       
      </div>
      <ListingsTable 
        data={listings}
        loading={isLoading}
        onEdit={handleEdit}
        searchValue={searchTerm}
        onSearch={setSearchTerm}
      />
      <Modal
        title={editing ? t('listings.editListing', 'Edit Listing') : t('listings.createListing', 'Create Listing')}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={800}
        afterClose={() => setEditing(null)}
      >
        <ListingForm
          key={editing ? editing.id : 'new'}
          initialValues={editing || undefined}
          onSubmit={handleSubmit}
          loading={loading}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ListingsPage;
