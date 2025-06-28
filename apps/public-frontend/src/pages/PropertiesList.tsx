import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Card, 
  Input, 
  Select, 
  Button, 
  Typography, 
  Space, 
  Slider, 
  Checkbox,
  Divider,
  Empty,
  Spin
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined,
  HomeOutlined,
  StarFilled,
  EnvironmentOutlined
} from '@ant-design/icons';
import { fetchListings, Listing, SearchParams } from '../api/listings';
import { useQuery } from '@tanstack/react-query';
import './PropertiesList.css';

const { Title, Text } = Typography;
const { Option } = Select;

const PropertiesList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get filter values from URL params
  const query = searchParams.get('query') || '';
  const propertyType = searchParams.get('type')?.split(',') || [];
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const bedrooms = searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined;
  const sortBy = searchParams.get('sortBy') as SearchParams['sortBy'] || 'newest';

  // Local state for filters
  const [searchQuery, setSearchQuery] = useState(query);
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice || 0, maxPrice || 2000000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(propertyType);
  const [selectedBedrooms, setSelectedBedrooms] = useState<number | undefined>(bedrooms);
  const [showFilters, setShowFilters] = useState(false);

  // Update local state when URL params change
  useEffect(() => {
    setSearchQuery(query);
    setSelectedTypes(propertyType);
    setSelectedBedrooms(bedrooms);
    setPriceRange([minPrice || 0, maxPrice || 2000000]);
  }, [query, propertyType, bedrooms, minPrice, maxPrice]);

  // Prepare search params
  const searchParamsObj: SearchParams = {
    query: searchQuery || undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 2000000 ? priceRange[1] : undefined,
    bedrooms: selectedBedrooms,
    propertyType: selectedTypes.length ? selectedTypes : undefined,
    sortBy
  };

  // Fetch listings with search params
  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['listings', searchParamsObj],
    queryFn: async () => {
      const response = await fetchListings(searchParamsObj);
      return response.data;
    },
  });

  // Handle search
  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('query', searchQuery);
    if (selectedTypes.length) params.set('type', selectedTypes.join(','));
    if (selectedBedrooms) params.set('bedrooms', selectedBedrooms.toString());
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString());
    if (priceRange[1] < 2000000) params.set('maxPrice', priceRange[1].toString());
    if (sortBy !== 'newest') params.set('sortBy', sortBy);

    navigate(`/properties?${params.toString()}`);
  };

  // Handle filter reset
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTypes([]);
    setSelectedBedrooms(undefined);
    setPriceRange([0, 2000000]);
    navigate('/properties');
  };

  // Handle property click
  const handlePropertyClick = (id: number) => {
    navigate(`/property/${id}`);
  };

  return (
    <div className="properties-page" style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
      <Title level={2} style={{ marginBottom: 24 }}>Properties for Sale & Rent</Title>
      
      {/* Search and Filter Bar */}
      <Card className="search-filter-card" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input
              placeholder="Search by location, address, or keywords..."
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onPressEnter={handleSearch}
            />
          </Col>
          <Col xs={24} md={6}>
            <Select
              placeholder="Property Type"
              mode="multiple"
              style={{ width: '100%' }}
              value={selectedTypes}
              onChange={setSelectedTypes}
              maxTagCount="responsive"
            >
              <Option value="APARTMENT">Apartment</Option>
              <Option value="HOUSE">House</Option>
              <Option value="CONDO">Condo</Option>
              <Option value="TOWNHOUSE">Townhouse</Option>
              <Option value="LAND">Land</Option>
              <Option value="COMMERCIAL">Commercial</Option>
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <Select
              placeholder="Bedrooms"
              style={{ width: '100%' }}
              value={selectedBedrooms}
              onChange={setSelectedBedrooms}
              allowClear
            >
              <Option value={1}>1+ Bed</Option>
              <Option value={2}>2+ Beds</Option>
              <Option value={3}>3+ Beds</Option>
              <Option value={4}>4+ Beds</Option>
              <Option value={5}>5+ Beds</Option>
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <Button 
              type="primary" 
              icon={<SearchOutlined />} 
              onClick={handleSearch}
              style={{ width: '100%' }}
              loading={isLoading}
            >
              Search
            </Button>
          </Col>
        </Row>
        
        {/* Advanced Filters */}
        <div style={{ marginTop: showFilters ? 16 : 0, maxHeight: showFilters ? '500px' : 0, overflow: 'hidden', transition: 'all 0.3s' }}>
          <Divider style={{ margin: '16px 0' }} />
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <div>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>Price Range</Text>
                <Slider
                  range
                  min={0}
                  max={2000000}
                  step={50000}
                  value={[priceRange[0], priceRange[1]]}
                  onChange={(value) => setPriceRange(value as [number, number])}
                  tipFormatter={(value) => `$${value?.toLocaleString()}`}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <Text type="secondary">${priceRange[0].toLocaleString()}</Text>
                  <Text type="secondary">${priceRange[1].toLocaleString()}+</Text>
                </div>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>Sort By</Text>
                <Select
                  value={sortBy}
                  onChange={(value) => setSearchParams({ ...Object.fromEntries(searchParams), sortBy: value })}
                  style={{ width: '100%' }}
                >
                  <Option value="newest">Newest</Option>
                  <Option value="price_asc">Price: Low to High</Option>
                  <Option value="price_desc">Price: High to Low</Option>
                </Select>
              </div>
            </Col>
            <Col xs={24} md={8} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Button onClick={resetFilters} style={{ marginRight: 8 }}>
                Reset Filters
              </Button>
            </Col>
          </Row>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button 
            type="text" 
            icon={<FilterOutlined rotate={showFilters ? 180 : 0} />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'More Filters'}
          </Button>
        </div>
      </Card>
      
      {/* Results Count and Sort */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text type="secondary">
          {isLoading ? 'Loading...' : `${listings.length} properties found`}
        </Text>
      </div>
      
      {/* Property Listings */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Loading properties...</div>
        </div>
      ) : listings.length === 0 ? (
        <Empty
          description={
            <span>No properties found matching your criteria</span>
          }
          style={{ margin: '40px 0' }}
        >
          <Button type="primary" onClick={resetFilters}>
            Clear all filters
          </Button>
        </Empty>
      ) : (
        <Row gutter={[24, 24]}>
          {listings.map((listing) => (
            <Col xs={24} sm={12} md={8} lg={6} key={listing.id}>
              <Card
                hoverable
                className="property-card"
                cover={
                  <div 
                    className="property-image"
                    style={{ 
                      backgroundImage: `url(${listing.images?.[0] || 'https://via.placeholder.com/300x200'})` 
                    }}
                  />
                }
                onClick={() => handlePropertyClick(listing.id)}
              >
                <div className="property-price">
                  ${listing.price.toLocaleString()}
                </div>
                <div className="property-features">
                  <span><HomeOutlined /> {listing.bedrooms} bd</span>
                  <span>|</span>
                  <span>{listing.bathrooms} ba</span>
                  <span>|</span>
                  <span>{listing.squareFeet.toLocaleString()} sqft</span>
                </div>
                <h3 className="property-title">{listing.title}</h3>
                <div className="property-address">
                  <EnvironmentOutlined /> {listing.address}
                </div>
                <div className="property-type">
                  {listing.propertyType.charAt(0) + listing.propertyType.slice(1).toLowerCase()}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default PropertiesList;
