import React from 'react';
import { Layout, Typography, Row, Col, Divider, Space } from 'antd';
import { 
  FacebookOutlined, 
  TwitterOutlined, 
  InstagramOutlined, 
  LinkedinOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';
import './Footer.css';

const { Footer } = Layout;
const { Text, Link: AntLink } = Typography;

const FooterComponent: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Footer className="footer">
      <div className="footer-container">
        <Row gutter={[48, 32]}>
          <Col xs={24} sm={12} md={6}>
            <div className="footer-section">
              <div className="footer-logo">
                <EnvironmentOutlined style={{ fontSize: 24, marginRight: 8, color: '#1890ff' }} />
                <span className="footer-logo-text">RealEstate</span>
              </div>
              <Text type="secondary" className="footer-description">
                Find your dream home with our award-winning service and the best properties in the market.
              </Text>
              <Space size="middle" className="footer-social">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <FacebookOutlined style={{ fontSize: 20 }} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <TwitterOutlined style={{ fontSize: 20 }} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <InstagramOutlined style={{ fontSize: 20 }} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <LinkedinOutlined style={{ fontSize: 20 }} />
                </a>
              </Space>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div className="footer-section">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="/about">About Us</a></li>
                <li><a href="/properties">Properties</a></li>
                <li><a href="/agents">Agents</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/contact">Contact Us</a></li>
              </ul>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div className="footer-section">
              <h4 className="footer-heading">Property Types</h4>
              <ul className="footer-links">
                <li><a href="/properties?type=apartment">Apartments</a></li>
                <li><a href="/properties?type=house">Houses</a></li>
                <li><a href="/properties?type=condo">Condos</a></li>
                <li><a href="/properties?type=townhouse">Townhouses</a></li>
                <li><a href="/properties?type=commercial">Commercial</a></li>
              </ul>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div className="footer-section">
              <h4 className="footer-heading">Contact Info</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <EnvironmentOutlined className="contact-icon" />
                  <span>123 Real Estate St, San Francisco, CA 94103</span>
                </div>
                <div className="contact-item">
                  <PhoneOutlined className="contact-icon" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <MailOutlined className="contact-icon" />
                  <span>info@realestate.com</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        
        <Divider style={{ borderTopColor: 'rgba(255, 255, 255, 0.1)' }} />
        
        <div className="footer-bottom">
          <Text type="secondary">
            &copy; {currentYear} RealEstate. All rights reserved.
          </Text>
          <div className="footer-legal">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/sitemap">Sitemap</a>
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComponent;
