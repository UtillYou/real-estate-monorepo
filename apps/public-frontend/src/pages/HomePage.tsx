import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Input, Button, Select, Typography, Space, Divider, Tag, Spin, Empty } from 'antd';
import { SearchOutlined, HomeOutlined, FilterOutlined } from '@ant-design/icons';
import { fetchFeaturedListings, fetchLatestListings, Listing } from '../api/listings';
import { useQuery } from '@tanstack/react-query';
import { PropertyType } from '../types';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    propertyType: [] as string[],
  });
  const navigate = useNavigate();

  // Fetch featured listings
  const { data: featuredListings = [], isLoading: isLoadingFeatured } = useQuery({
    queryKey: ['featuredListings'],
    queryFn: async () => {
      const response = await fetchFeaturedListings();
      return response.data;
    },
  });

  // Fetch latest listings (only 4 items)
  const { data: latestListings = [], isLoading: isLoadingLatest } = useQuery({
    queryKey: ['latestListings'],
    queryFn: async () => {
      const response = await fetchLatestListings(4);
      return response.data;
    },
  });

  const handleSearch = () => {
    // TODO: Implement search with filters
    console.log('Searching with:', { searchQuery, ...filters });
  };

  const handlePropertyClick = (id: number) => {
    navigate(`/property/${id}`);
  };

  return (
    <div className="home-page" style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
      {/* Hero Section with Search */}
      <div className="hero-section" style={{ 
        background: '#f0f2f5', 
        padding: '60px 24px',
        borderRadius: 12,
        marginBottom: 48,
        marginTop: 48,
        textAlign: 'center'
      }}>
        <Title level={2} style={{ marginBottom: 24 }}>Find Your Dream Home</Title>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Search
            placeholder="Search by location, property type, or keywords..."
            enterButton={
              <Button type="primary" size="large" icon={<SearchOutlined />}>
                Search
              </Button>
            }
            size="large"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={handleSearch}
            style={{ marginBottom: 16 }}
          />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Select
              placeholder="Min Price"
              style={{ width: 140 }}
              value={filters.minPrice || undefined}
              onChange={(value) => setFilters({...filters, minPrice: value})}
              allowClear
            >
              <Option value="100000">$100,000</Option>
              <Option value="200000">$200,000</Option>
              <Option value="300000">$300,000</Option>
              <Option value="500000">$500,000</Option>
              <Option value="750000">$750,000</Option>
              <Option value="1000000">$1,000,000+</Option>
            </Select>
            <Select
              placeholder="Max Price"
              style={{ width: 140 }}
              value={filters.maxPrice || undefined}
              onChange={(value) => setFilters({...filters, maxPrice: value})}
              allowClear
            >
              <Option value="200000">$200,000</Option>
              <Option value="300000">$300,000</Option>
              <Option value="500000">$500,000</Option>
              <Option value="750000">$750,000</Option>
              <Option value="1000000">$1,000,000</Option>
              <Option value="2000000">$2,000,000+</Option>
            </Select>
            <Select
              placeholder="Bedrooms"
              style={{ width: 120 }}
              value={filters.bedrooms || undefined}
              onChange={(value) => setFilters({...filters, bedrooms: value})}
              allowClear
            >
              <Option value="1">1+ Bed</Option>
              <Option value="2">2+ Beds</Option>
              <Option value="3">3+ Beds</Option>
              <Option value="4">4+ Beds</Option>
              <Option value="5">5+ Beds</Option>
            </Select>
            <Button 
              icon={<FilterOutlined />} 
              onClick={() => console.log('More filters')}
            >
              More Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <div className="featured-properties" style={{ marginBottom: 64 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>Featured Properties</Title>
          <Button type="link" onClick={() => navigate('/properties')}>View All</Button>
        </div>
        
        <Row gutter={[24, 24]}>
          {isLoadingFeatured ? (
            <Col span={24} style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" />
              <div style={{ marginTop: 16 }}>Loading featured properties...</div>
            </Col>
          ) : featuredListings.length > 0 ? (
            featuredListings.slice(0, 4).map((listing) => (
              <Col xs={24} sm={12} md={8} lg={6} key={listing.id}>
                <Card
                  hoverable
                  style={{ width: '100%' }}
                  cover={
                    <div style={{ 
                      height: 200, 
                      background: `url(${listing.images?.[0]?.url || 'https://via.placeholder.com/300x200'}) center/cover no-repeat`,
                      backgroundColor: '#f0f2f5'
                    }} />
                  }
                  onClick={() => handlePropertyClick(listing.id)}
                >
                  <Card.Meta
                    title={
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: 18, fontWeight: 600 }}>${listing.price.toLocaleString()}</span>
                        <Tag color="blue">
                          {listing.propertyType.charAt(0) + listing.propertyType.slice(1).toLowerCase()}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ 
                          fontSize: 16, 
                          fontWeight: 500,
                          margin: '8px 0',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {listing.title}
                        </div>
                        <div style={{ color: '#666' }}>
                          <HomeOutlined style={{ marginRight: 4 }} />
                          {listing.bedrooms} bd | {listing.bathrooms} ba | {listing.squareFeet.toLocaleString()} sqft
                        </div>
                        <div style={{ color: '#666', marginTop: 4 }}>
                          {listing.address}
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))
          ) : (
            <Col span={24} style={{ textAlign: 'center', padding: '40px 0' }}>
              <Empty description="No featured properties available" />
            </Col>
          )}
        </Row>
      </div>

      {/* Latest Listings */}
      <div className="latest-listings" style={{ marginBottom: 64 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>Latest Listings</Title>
          <Button type="link" onClick={() => navigate('/properties')}>View All</Button>
        </div>
        
        <Row gutter={[24, 24]}>
          {isLoadingLatest ? (
            <Col span={24} style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" />
              <div style={{ marginTop: 16 }}>Loading latest listings...</div>
            </Col>
          ) : latestListings.length > 0 ? (
            latestListings.map((listing) => (
              <Col xs={24} sm={12} md={6} key={listing.id}>
                <Card
                  hoverable
                  style={{ width: '100%' }}
                  cover={
                    <div style={{ 
                      height: 200, 
                      background: `url(${listing.images?.[0]?.url || 'https://via.placeholder.com/300x200'}) center/cover no-repeat`,
                      backgroundColor: '#f0f2f5'
                    }} />
                  }
                  onClick={() => handlePropertyClick(listing.id)}
                >
                  <Card.Meta
                    title={
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: 18, fontWeight: 600 }}>${listing.price.toLocaleString()}</span>
                        <Tag color="blue">
                          {listing.propertyType.charAt(0) + listing.propertyType.slice(1).toLowerCase()}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ 
                          fontSize: 16, 
                          fontWeight: 500,
                          margin: '8px 0',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {listing.title}
                        </div>
                        <div style={{ color: '#666' }}>
                          <HomeOutlined style={{ marginRight: 4 }} />
                          {listing.bedrooms} bd | {listing.bathrooms} ba | {listing.squareFeet.toLocaleString()} sqft
                        </div>
                        <div style={{ color: '#666', marginTop: 4 }}>
                          {listing.address}
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))
          ) : (
            <Col span={24} style={{ textAlign: 'center', padding: '40px 0' }}>
              <Empty description="No listings available" />
            </Col>
          )}
        </Row>
      </div>

      {/* Property Types */}
      <div className="property-types" style={{ marginBottom: 48 }}>
        <Title level={3} style={{ marginBottom: 24 }}>Browse by Property Type</Title>
        <Row gutter={[24, 24]}>
          {[
            { type: 'APARTMENT', label: 'Apartment', icon: '🏢' },
            { type: 'HOUSE', label: 'House', icon: '🏠' },
            { type: 'CONDO', label: 'Condo', icon: '🏢' },
            { type: 'TOWNHOUSE', label: 'Townhouse', icon: '🏘️' },
          ].map(({ type, label, icon }) => (
            <Col xs={12} sm={6} key={type}>
              <Card 
                hoverable
                style={{
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '16px 8px',
                }}
                bodyStyle={{
                  width: '100%',
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
                onClick={() => setFilters({...filters, propertyType: [type]})}
              >
                <div style={{ fontSize: 32, marginBottom: 12, color: '#1890ff' }}>{icon}</div>
                <Text strong>{label}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>


    </div>
  );
};

export default HomePage;
