import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Button, Dropdown, Menu, Typography, Space } from 'antd';
import { 
  MenuOutlined, 
  UserOutlined, 
  HeartOutlined, 
  DownOutlined
} from '@ant-design/icons';
import logo from '../resources/logo192.png';
import './Navbar.css';

const { Header } = Layout;
const { Title } = Typography;

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/properties?type=apartment">Apartments</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/properties?type=house">Houses</Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/properties?type=condo">Condos</Link>
      </Menu.Item>
      <Menu.Item key="4">
        <Link to="/properties?type=townhouse">Townhouses</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src={logo} alt="Logo" className="logo-image" />
            <Title level={4} style={{ margin: 0, color: '#1890ff', marginLeft: 12 }}>RealEstate</Title>
          </Link>
        </div>



        <div className="navbar-menu">
          <Space size="large">
            <Dropdown overlay={menu} placement="bottomCenter">
              <Button type="text" style={{ color: 'inherit' }}>
                <Space>
                  <MenuOutlined />
                  Browse
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
            <Button type="text" icon={<HeartOutlined />}>
              Saved
            </Button>
            <Button type="primary" icon={<UserOutlined />}>
              Sign In
            </Button>
          </Space>
        </div>
      </div>
    </Header>
  );
};

export default Navbar;
