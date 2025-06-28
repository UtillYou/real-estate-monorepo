import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Row, Col, Card, Input, Button, Select, Typography, Spin, Empty, Slider, Checkbox, Divider, Modal } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { fetchListings, Listing, SearchFilters } from '../api/listings';

const { Title, Text } = Typography;
const { Option } = Select;

const SearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Omit<SearchFilters, 'propertyType' | 'minBathrooms' | 'minArea' | 'maxArea'> & { 
    propertyType: string[];
    minBathrooms: number;
    minArea: number;
    maxArea: number;
  }>({
    minPrice: undefined,
    maxPrice: undefined,
    bedrooms: undefined,
    propertyType: [],
    minBathrooms: 1,
    minArea: 0,
    maxArea: 10000,
    hasGarage: false,
    hasParking: false,
    hasAC: false,
    hasPool: false,
  });
  
  const [searchResults, setSearchResults] = useState<Listing[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // Handle search from URL params on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    setSearchQuery(query);
    
    if (query) {
      performSearch(query);
    }
  }, [location.search]);

  const performSearch = async (query: string) => {
    try {
      setIsSearching(true);
      
      const searchParams: SearchFilters = {
        ...filters,
        query: query || undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        bedrooms: filters.bedrooms ? Number(filters.bedrooms) : undefined,
        propertyType: filters.propertyType && filters.propertyType.length > 0 ? filters.propertyType : undefined,
        ...(filters.hasGarage && { hasGarage: true }),
        ...(filters.hasParking && { hasParking: true }),
        ...(filters.hasAC && { hasAC: true }),
        ...(filters.hasPool && { hasPool: true }),
        sortBy: 'newest',
      };
      
      const response = await fetchListings(searchParams);
      setSearchResults(response.data);
      
      // Close the filter modal if open
      setIsFilterModalVisible(false);
    } catch (error) {
      console.error('Error searching listings:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleAreaChange = (value: number | [number, number]) => {
    if (Array.isArray(value) && value.length === 2) {
      setFilters({
        ...filters,
        minArea: value[0],
        maxArea: value[1],
      });
    } else if (typeof value === 'number') {
      setFilters({
        ...filters,
        minArea: value,
      });
    }
  };

  const resetFilters = () => {
    setFilters({
      minPrice: undefined,
      maxPrice: undefined,
      bedrooms: undefined,
      propertyType: [],
      minBathrooms: 1,
      minArea: 0,
      maxArea: 10000,
      hasGarage: false,
      hasParking: false,
      hasAC: false,
      hasPool: false,
    });
  };

  const toggleFilterModal = () => {
    setIsFilterModalVisible(!isFilterModalVisible);
  };

  const handlePropertyClick = (id: number) => {
    navigate(`/properties/${id}`);
  };

  return (
    <div className="search-page" style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <div className="search-section" style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <Input
            placeholder="Search by location, property type, or keyword"
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onPressEnter={handleSearch}
            style={{ flex: 1 }}
          />
          <Button type="primary" onClick={handleSearch}>
            Search
          </Button>
          <Button 
            type={filters.minBathrooms > 1 || filters.minArea > 0 || filters.hasGarage || filters.hasParking || filters.hasAC || filters.hasPool ? 'primary' : 'default'}
            icon={<FilterOutlined />} 
            onClick={toggleFilterModal}
          >
            Filters
          </Button>
        </div>

        <div style={{ marginBottom: 24 }}>
          <Title level={3} style={{ marginBottom: 16 }}>
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Properties'}
            {searchResults.length > 0 && (
              <Text type="secondary" style={{ fontSize: 16, marginLeft: 12 }}>
                ({searchResults.length} {searchResults.length === 1 ? 'property' : 'properties'} found)
              </Text>
            )}
          </Title>
          
          {/* Filter chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {filters.minPrice && (
              <span className="filter-chip">Min Price: ${filters.minPrice.toLocaleString()}</span>
            )}
            {filters.maxPrice && (
              <span className="filter-chip">Max Price: ${filters.maxPrice.toLocaleString()}</span>
            )}
            {filters.bedrooms && (
              <span className="filter-chip">{filters.bedrooms}+ Beds</span>
            )}
            {filters.minBathrooms > 1 && (
              <span className="filter-chip">{filters.minBathrooms}+ Baths</span>
            )}
            {(filters.minArea > 0 || filters.maxArea < 10000) && (
              <span className="filter-chip">
                {filters.minArea.toLocaleString()}-{filters.maxArea.toLocaleString()} sqft
              </span>
            )}
            {filters.hasGarage && <span className="filter-chip">Garage</span>}
            {filters.hasParking && <span className="filter-chip">Parking</span>}
            {filters.hasAC && <span className="filter-chip">A/C</span>}
            {filters.hasPool && <span className="filter-chip">Pool</span>}
            {(filters.minPrice || filters.maxPrice || filters.bedrooms || filters.minBathrooms > 1 || 
              filters.minArea > 0 || filters.maxArea < 10000 || filters.hasGarage || 
              filters.hasParking || filters.hasAC || filters.hasPool) && (
              <Button type="link" onClick={resetFilters} style={{ padding: 0, height: 'auto' }}>
                Clear all
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="search-results">
        {isSearching ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>Searching properties...</div>
          </div>
        ) : searchResults.length === 0 ? (
          <Empty 
            description={
              <span>
                No properties found matching your search criteria.
                <br />
                <Button type="link" onClick={resetFilters} style={{ marginTop: 8 }}>
                  Clear filters
                </Button>
              </span>
            } 
          />
        ) : (
          <Row gutter={[24, 24]}>
            {searchResults.map((listing) => (
              <Col xs={24} sm={12} md={8} lg={6} key={listing.id}>
                <Card
                  hoverable
                  cover={
                    <div style={{ height: 200, overflow: 'hidden' }}>
                      <img
                        alt={listing.title}
                        src={listing.images?.[0]?.url || '/placeholder-property.jpg'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  }
                  onClick={() => handlePropertyClick(listing.id)}
                >
                  <Card.Meta
                    title={listing.title}
                    description={
                      <div>
                        <div>{listing.address}</div>
                        <div style={{ marginTop: 8, fontWeight: 'bold' }}>
                          ${listing.price?.toLocaleString()}
                        </div>
                        <div style={{ marginTop: 8, color: '#666' }}>
                          {listing.bedrooms} bd | {listing.bathrooms} ba | {listing.squareFeet?.toLocaleString()} sqft
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Filter Modal */}
      <Modal
        title="Advanced Filters"
        open={isFilterModalVisible}
        onCancel={toggleFilterModal}
        footer={[
          <Button key="reset" onClick={resetFilters}>
            Reset Filters
          </Button>,
          <Button 
            key="apply" 
            type="primary" 
            onClick={() => {
              toggleFilterModal();
              performSearch(searchQuery);
            }}
            style={{ marginLeft: 8 }}
          >
            Apply Filters
          </Button>,
        ]}
        width={600}
      >
        <div style={{ padding: '16px 0' }}>
          <Divider orientation="left" style={{ marginTop: 0 }}>Price Range</Divider>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 8 }}>Min Price</div>
              <Input
                type="number"
                placeholder="Min"
                prefix="$"
                value={filters.minPrice || ''}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? parseInt(e.target.value) : undefined })}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 8 }}>Max Price</div>
              <Input
                type="number"
                placeholder="Max"
                prefix="$"
                value={filters.maxPrice || ''}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? parseInt(e.target.value) : undefined })}
              />
            </div>
          </div>

          <Divider orientation="left">Bedrooms</Divider>
          <div style={{ marginBottom: 24 }}>
            <Select
              style={{ width: '100%' }}
              placeholder="Any"
              value={filters.bedrooms}
              onChange={(value) => setFilters({ ...filters, bedrooms: value })}
              allowClear
            >
              <Option value={1}>1+ Bedrooms</Option>
              <Option value={2}>2+ Bedrooms</Option>
              <Option value={3}>3+ Bedrooms</Option>
              <Option value={4}>4+ Bedrooms</Option>
              <Option value={5}>5+ Bedrooms</Option>
            </Select>
          </div>

          <Divider orientation="left">Bathrooms</Divider>
          <div style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 8 }}>Minimum Bathrooms: {filters.minBathrooms}+</div>
            <Slider
              min={1}
              max={6}
              marks={{
                1: '1',
                2: '2',
                3: '3',
                4: '4',
                5: '5',
                6: '6+',
              }}
              value={filters.minBathrooms}
              onChange={(value) => setFilters({ ...filters, minBathrooms: value })}
              tooltip={{ formatter: (value) => `${value}+` }}
            />
          </div>

          <Divider orientation="left">Area (sqft)</Divider>
          <div style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 8 }}>
              Range: {filters.minArea.toLocaleString()} - {filters.maxArea.toLocaleString()} sqft
            </div>
            <Slider
              range
              min={0}
              max={10000}
              step={100}
              value={[filters.minArea, filters.maxArea]}
              onChange={(value) => handleAreaChange(value as [number, number])}
              tooltip={{ formatter: (value) => `${Number(value).toLocaleString()} sqft` }}
            />
          </div>

          <Divider orientation="left">Amenities</Divider>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <Checkbox 
                checked={filters.hasGarage}
                onChange={(e) => setFilters({ ...filters, hasGarage: e.target.checked })}
              >
                Garage
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox 
                checked={filters.hasParking}
                onChange={(e) => setFilters({ ...filters, hasParking: e.target.checked })}
              >
                Parking
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox 
                checked={filters.hasAC}
                onChange={(e) => setFilters({ ...filters, hasAC: e.target.checked })}
              >
                Air Conditioning
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox 
                checked={filters.hasPool}
                onChange={(e) => setFilters({ ...filters, hasPool: e.target.checked })}
              >
                Swimming Pool
              </Checkbox>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
};

export default SearchPage;
