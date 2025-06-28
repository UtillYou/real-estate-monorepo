import React, { useState } from 'react';
import { Card, Button, InputNumber, Form, Progress, Typography, notification, Modal, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { createListing, PropertyType, deleteAllListings } from '../api/listings';
import { api } from '../api';

const { Title, Text } = Typography;

const DataGeneratorPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const propertyTypes: PropertyType[] = ['APARTMENT', 'HOUSE', 'CONDO', 'TOWNHOUSE'];
  
  // Property type to image search term mapping
  const propertyTypeImageMap: Record<PropertyType, string[]> = {
    'APARTMENT': ['modern+apartment', 'luxury+apartment', 'apartment+interior'],
    'HOUSE': ['beautiful+house', 'modern+house', 'luxury+home'],
    'CONDO': ['modern+condo', 'luxury+condo', 'condo+interior'],
    'TOWNHOUSE': ['townhouse', 'townhome', 'rowhouse'],
    'LAND': ['vacant+land', 'empty+lot', 'land+for+sale'],
    'COMMERCIAL': ['commercial+property', 'office+building', 'retail+space'],
    'OTHER': ['property', 'real+estate', 'home']
  };

  const cities = [
    { city: 'New York', state: 'NY', zipCode: '10001' },
    { city: 'Los Angeles', state: 'CA', zipCode: '90001' },
    { city: 'Chicago', state: 'IL', zipCode: '60601' },
    { city: 'Houston', state: 'TX', zipCode: '77001' },
    { city: 'Phoenix', state: 'AZ', zipCode: '85001' },
  ];
  
  const features = [
    'Swimming Pool', 'Gym', 'Parking', 'Garden', 'Fireplace',
    'Air Conditioning', 'Heating', 'Washer/Dryer', 'Dishwasher', 'Balcony'
  ];
  
  // Get a random image URL for a property type using Picsum Photos
  const getPropertyImage = (propertyType: PropertyType, index: number): { url: string; name: string } => {
    // Use a combination of property type and index to get consistent but varied images
    const imageId = (propertyType.length * 1000) + (index % 1000);
    const width = 800;
    const height = 600;
    
    return {
      url: `https://picsum.photos/seed/${imageId}/${width}/${height}`,
      name: `${propertyType.toLowerCase()}-${imageId}.jpg`
    };
  };

  const generateMockListing = async (index: number) => {
    const propertyType = propertyTypes[index % propertyTypes.length];
    const cityData = cities[index % cities.length];
    const addressNumber = Math.floor(Math.random() * 9000) + 1000;
    const streetName = ['Main', 'Oak', 'Pine', 'Maple', 'Cedar'][index % 5];
    
    const listingData = {
      title: `${propertyType.charAt(0) + propertyType.slice(1).toLowerCase()} in ${cityData.city}`,
      description: `Beautiful ${propertyType.toLowerCase()} in the heart of ${cityData.city}. This property features ${Math.floor(Math.random() * 3) + 2} bedrooms and ${Math.floor(Math.random() * 2) + 1} bathrooms.`,
      price: Math.floor(Math.random() * 1000000) + 50000,
      address: `${addressNumber} ${streetName} St`,
      city: cityData.city,
      state: cityData.state,
      zipCode: cityData.zipCode,
      propertyType: propertyType,
      bedrooms: Math.floor(Math.random() * 5) + 1,
      bathrooms: Math.floor(Math.random() * 3) + 1,
      squareFeet: Math.floor(Math.random() * 2000) + 500,
      yearBuilt: new Date().getFullYear() - Math.floor(Math.random() * 30),
      images: [
        // Exterior view
        getPropertyImage(propertyType, index * 3),
        // Interior view
        getPropertyImage(propertyType, index * 3 + 1),
        // Room or detail view
        getPropertyImage(propertyType, index * 3 + 2)
      ],
      features: features.sort(() => 0.5 - Math.random()).slice(0, 5),
      isActive: true
    };

    try {
      const response = await createListing(listingData);
      return response.data;
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  };

  const handleDeleteAllListings = async () => {
    Modal.confirm({
      title: 'Delete All Listings',
      content: 'Are you sure you want to delete ALL listings? This action cannot be undone!',
      okText: 'Yes, Delete All',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          setIsDeleting(true);
          await deleteAllListings();
          notification.success({
            message: 'Success',
            description: 'All listings have been deleted successfully.',
          });
        } catch (error) {
          console.error('Error deleting listings:', error);
          notification.error({
            message: 'Error',
            description: 'Failed to delete listings. Please try again.',
          });
        } finally {
          setIsDeleting(false);
        }
      },
    });
  };

  const onFinish = async (values: { count: number }) => {
    const { count } = values;
    setTotalItems(count);
    setGeneratedCount(0);
    setProgress(0);
    setIsGenerating(true);
    
    try {
      const batchSize = 3; // Process 3 items at a time to avoid overwhelming the server
      const batches = Math.ceil(count / batchSize);
      let successfulCount = 0;
      
      for (let batch = 0; batch < batches; batch++) {
        const batchPromises = [];
        const currentBatchSize = Math.min(batchSize, count - (batch * batchSize));
        
        // Create promises for current batch
        for (let i = 0; i < currentBatchSize; i++) {
          const listingIndex = batch * batchSize + i;
          batchPromises.push(
            generateMockListing(listingIndex)
              .then(() => {
                successfulCount++;
                setGeneratedCount(successfulCount);
                setProgress(Math.round((successfulCount / count) * 100));
              })
              .catch(error => {
                console.error(`Error generating listing ${listingIndex + 1}:`, error);
                // Continue with other listings even if one fails
              })
          );
        }
        
        // Wait for current batch to complete before starting next batch
        await Promise.all(batchPromises);
        
        // Small delay between batches to avoid overwhelming the server
        if (batch < batches - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      notification.success({
        message: 'Data Generation Complete',
        description: `Successfully generated ${successfulCount} out of ${count} listings.`,
      });
      
      // Refresh the listings page if we're not already there
      if (window.location.pathname === '/listings') {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error in data generation process:', error);
      notification.error({
        message: 'Error',
        description: 'An error occurred while generating data. Check the console for details.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="data-generator">
      <Title level={2}>Data Generator</Title>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ count: 10 }}
        >
          <Form.Item
            label="Number of Listings to Generate"
            name="count"
            rules={[
              { required: true, message: 'Please enter the number of listings to generate' },
              { type: 'number', min: 1, max: 1000, message: 'Please enter a number between 1 and 1000' },
            ]}
          >
            <InputNumber
              disabled={isGenerating}
              style={{ width: '100%' }}
              min={1}
              max={1000}
            />
          </Form.Item>
          
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isGenerating}
              icon={<PlusOutlined />}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Data'}
            </Button>
          </Form.Item>
          
          <Divider orientation="left" orientationMargin={0} style={{ color: '#ff4d4f' }}>Danger Zone</Divider>
          <Form.Item>
            <Button
              type="primary"
              danger
              onClick={handleDeleteAllListings}
              loading={isDeleting}
              icon={<DeleteOutlined />}
            >
              {isDeleting ? 'Deleting...' : 'Delete All Listings'}
            </Button>
            <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
              Warning: This will permanently delete all listings in the database.
            </Text>
          </Form.Item>
        </Form>

        {isGenerating && (
          <div style={{ marginTop: 24 }}>
            <Text>Generating {generatedCount} of {totalItems} listings...</Text>
            <Progress
              percent={progress}
              status="active"
              style={{ marginTop: 8 }}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default DataGeneratorPage;
