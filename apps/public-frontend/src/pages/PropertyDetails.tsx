import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Button, 
  Divider, 
  Tabs, 
  List, 
  Avatar, 
  Rate,
  Carousel,
  Tag,
  Space,
  Skeleton,
  message
} from 'antd';
import { 
  HeartOutlined, 
  ShareAltOutlined, 
  EnvironmentOutlined, 
  PhoneOutlined, 
  MailOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CarOutlined,
  ShopOutlined,
  BankOutlined,
  HomeOutlined,
  ExpandOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import { fetchListing } from '../api/listings';
import { useQuery } from '@tanstack/react-query';
import './PropertyDetails.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const response = await fetchListing(Number(id));
      return response.data;
    },
  });

  if (error) {
    return <div>Error loading property details</div>;
  }

  const handleContactAgent = () => {
    message.info('Contact agent functionality will be implemented soon');
  };

  const handleScheduleTour = () => {
    message.info('Schedule tour functionality will be implemented soon');
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    message.success(!isFavorite ? 'Added to favorites' : 'Removed from favorites');
  };

  const nextImage = () => {
    if (listing?.images) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === listing.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (listing?.images) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? (listing.images?.length || 1) - 1 : prevIndex - 1
      );
    }
  };

  if (isLoading || !listing) {
    return (
      <div style={{ padding: '24px' }}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  const propertyFeatures = [
    { icon: <HomeOutlined />, label: 'Type', value: listing.propertyType },
    { icon: <ShopOutlined />, label: 'Bedrooms', value: `${listing.bedrooms} bed` },
    { icon: <BankOutlined />, label: 'Bathrooms', value: `${listing.bathrooms} bath` },
    { icon: <CarOutlined />, label: 'Area', value: `${listing.squareFeet.toLocaleString()} sqft` },
  ];

  return (
    <div className="property-details">
      <div className="property-header">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)}
          style={{ marginBottom: 16 }}
        >
          Back to Results
        </Button>
        
        <div className="property-title-section">
          <Title level={2} style={{ marginBottom: 8 }}>{listing.title}</Title>
          <div className="property-address">
            <EnvironmentOutlined style={{ marginRight: 8 }} />
            <Text type="secondary">{listing.address}</Text>
          </div>
          <div className="property-price">
            ${listing.price.toLocaleString()}
            <span className="price-suffix">
              {listing.price < 1000 ? '/mo' : ''}
            </span>
          </div>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          {/* Image Gallery */}
          <div className="property-gallery">
            <div className="main-image">
              {listing.images && listing.images.length > 0 ? (
                <>
                  <img 
                    src={listing.images?.[currentImageIndex]?.url} 
                    alt={listing.title}
                    onClick={() => setIsImageModalVisible(true)}
                  />
                  <div className="image-navigation">
                    <Button 
                      type="text" 
                      icon={<LeftOutlined />} 
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                    />
                    <Button 
                      type="text" 
                      icon={<RightOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                    />
                  </div>
                  <Button 
                    className="expand-button"
                    type="text" 
                    icon={<ExpandOutlined />} 
                    onClick={() => setIsImageModalVisible(true)}
                  />
                  <div className="image-counter">
                    {currentImageIndex + 1} / {listing.images.length}
                  </div>
                </>
              ) : (
                <div className="no-image">
                  <HomeOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                  <div>No images available</div>
                </div>
              )}
            </div>
            
            {listing.images && listing.images.length > 1 && (
              <div className="thumbnail-container">
                {listing.images?.slice(0, 4)?.map((img, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img src={img.url} alt={`Thumbnail ${index + 1}`} />
                    {index === 3 && listing.images.length > 4 && (
                      <div className="more-images">+{listing.images.length - 4}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Property Details Tabs */}
          <Card className="property-card">
            <Tabs defaultActiveKey="overview">
              <TabPane tab="Overview" key="overview">
                <div className="property-features-grid">
                  {propertyFeatures.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <div className="feature-icon">{feature.icon}</div>
                      <div className="feature-details">
                        <div className="feature-label">{feature.label}</div>
                        <div className="feature-value">{feature.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Divider />
                
                <Title level={4}>Description</Title>
                <Paragraph>{listing.description || 'No description available.'}</Paragraph>
                
                <Divider />
                
                <Title level={4}>Property Features</Title>
                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                  {listing.features.map((feature, index) => (
                    <Col xs={12} sm={8} key={index}>
                      <div className="property-tag">
                        <CheckCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                        {feature.name}
                      </div>
                    </Col>
                  ))}
                </Row>
              </TabPane>
              
              <TabPane tab="Floor Plan" key="floorplan">
                <div className="floor-plan-placeholder">
                  <img 
                    src="https://via.placeholder.com/800x500?text=Floor+Plan+Coming+Soon" 
                    alt="Floor plan"
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                </div>
              </TabPane>
              
              <TabPane tab="Location" key="location">
                <div className="map-placeholder" style={{ 
                  height: 400, 
                  background: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  marginTop: 16
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <EnvironmentOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                    <div style={{ marginTop: 16 }}>Map view will be available soon</div>
                  </div>
                </div>
              </TabPane>
              
              <TabPane tab="Schools" key="schools">
                <div className="schools-placeholder" style={{ 
                  padding: '40px 0',
                  textAlign: 'center',
                  color: '#8c8c8c'
                }}>
                  School information will be available soon
                </div>
              </TabPane>
            </Tabs>
          </Card>
          
          {/* Similar Properties */}
          <div style={{ marginTop: 24 }}>
            <Title level={4}>Similar Properties</Title>
            <div className="similar-properties-placeholder" style={{
              padding: '40px 0',
              textAlign: 'center',
              background: '#f9f9f9',
              borderRadius: 8,
              marginTop: 16
            }}>
              Similar properties will be shown here
            </div>
          </div>
        </Col>
        
        <Col xs={24} lg={8}>
          {/* Contact Agent Card */}
          <Card className="contact-agent-card">
            <div className="agent-info">
              <Avatar size={64} src="https://randomuser.me/api/portraits/men/32.jpg" />
              <div className="agent-details">
                <Title level={5} style={{ margin: '8px 0 4px' }}>John Doe</Title>
                <Text type="secondary">Real Estate Agent</Text>
                <div className="agent-rating">
                  <Rate disabled defaultValue={4.5} allowHalf style={{ fontSize: 14 }} />
                  <Text type="secondary" style={{ marginLeft: 8 }}>4.5 (24 reviews)</Text>
                </div>
              </div>
            </div>
            
            <Divider style={{ margin: '16px 0' }} />
            
            <div className="contact-actions">
              <Button 
                type="primary" 
                block 
                size="large"
                icon={<PhoneOutlined />}
                onClick={handleContactAgent}
                style={{ marginBottom: 12 }}
              >
                Contact Agent
              </Button>
              <Button 
                block 
                size="large"
                icon={<MailOutlined />}
                onClick={handleContactAgent}
                style={{ marginBottom: 12 }}
              >
                Email Agent
              </Button>
              <Button 
                type="primary" 
                block 
                size="large"
                onClick={handleScheduleTour}
              >
                Schedule a Tour
              </Button>
            </div>
            
            <Divider style={{ margin: '16px 0' }}>
              <Text type="secondary">or</Text>
            </Divider>
            
            <div className="property-actions">
              <Button 
                type="text" 
                icon={<HeartOutlined style={{ color: isFavorite ? '#ff4d4f' : undefined }} />}
                onClick={toggleFavorite}
              >
                {isFavorite ? 'Saved' : 'Save'}
              </Button>
              <Button 
                type="text" 
                icon={<ShareAltOutlined />}
                onClick={() => message.info('Share functionality coming soon')}
              >
                Share
              </Button>
              <Button 
                type="text" 
                icon={<EnvironmentOutlined />}
                onClick={() => message.info('Map view coming soon')}
              >
                Map View
              </Button>
            </div>
          </Card>
          
          {/* Mortgage Calculator */}
          <Card 
            title="Monthly Payment" 
            className="mortgage-calculator"
            style={{ marginTop: 24 }}
          >
            <div className="price-breakdown">
              <div className="price-row">
                <Text>Principal & Interest</Text>
                <Text strong>${Math.round(listing.price * 0.4 / 12).toLocaleString()}</Text>
              </div>
              <div className="price-row">
                <Text>Property Tax</Text>
                <Text>${Math.round(listing.price * 0.012 / 12).toLocaleString()}</Text>
              </div>
              <div className="price-row">
                <Text>Home Insurance</Text>
                <Text>$125</Text>
              </div>
              <Divider style={{ margin: '12px 0' }} />
              <div className="price-row total">
                <Text strong>Total</Text>
                <Title level={4} style={{ margin: 0 }}>
                  ${Math.round((listing.price * 0.4 / 12) + (listing.price * 0.012 / 12) + 125).toLocaleString()}
                </Title>
              </div>
            </div>
            <Button type="primary" block style={{ marginTop: 16 }}>
              Get Pre-Approved
            </Button>
            <Text type="secondary" style={{ display: 'block', marginTop: 16, fontSize: 12, textAlign: 'center' }}>
              * This is an estimate. Actual rates and payments may vary.
            </Text>
          </Card>
        </Col>
      </Row>
      
      {/* Image Modal */}
      {isImageModalVisible && listing.images && (
        <div className="image-modal">
          <div className="image-modal-content">
            <Button 
              className="close-button"
              type="text" 
              icon={<span>&times;</span>}
              onClick={() => setIsImageModalVisible(false)}
            />
            <div className="modal-image-container">
              <img 
                src={listing.images?.[currentImageIndex]?.url} 
                alt={listing.title}
              />
              <Button 
                className="nav-button prev"
                type="text" 
                icon={<LeftOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              />
              <Button 
                className="nav-button next"
                type="text" 
                icon={<RightOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              />
            </div>
            <div className="image-counter">
              {currentImageIndex + 1} / {listing.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
