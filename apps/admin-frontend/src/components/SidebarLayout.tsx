import React, { useCallback, useMemo } from 'react';
import { Layout, Menu, Button, Avatar, Typography, theme } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LogoutOutlined, 
  DashboardOutlined, 
  UnorderedListOutlined, 
  UserOutlined,
  UserSwitchOutlined,
  SettingOutlined,
  TagsOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import { useAuth } from '../AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import logo from '../resources/logo192.png';

const { Text } = Typography;

const { Sider, Content } = Layout;

interface MenuItemBase {
  key: string;
  label: string;
  icon?: React.ReactNode;
  requiredRole?: string;
  onClick?: () => void;
}

interface MenuItemWithChildren extends MenuItemBase {
  children: MenuItemBase[];
}

type MenuItem = MenuItemBase | MenuItemWithChildren;

function hasChildren(item: MenuItem): item is MenuItemWithChildren {
  return 'children' in item && Array.isArray(item.children);
}

const getMenuItems = (t: any, isAdmin: boolean): MenuItem[] => [
  {
    key: '/',
    label: t('menu.dashboard', 'Dashboard'),
    icon: <DashboardOutlined style={{ fontSize: '16px' }} />,
  },
  {
    key: '/listings',
    label: t('menu.listings', 'Listings'),
    icon: <UnorderedListOutlined style={{ fontSize: '16px' }} />,
  },
  {
    key: '/features',
    label: t('menu.features', 'Features'),
    icon: <TagsOutlined style={{ fontSize: '16px' }} />,
  },
  ...(isAdmin ? [{
    key: 'system-management',
    label: t('menu.systemManagement', 'System Management'),
    icon: <SettingOutlined style={{ fontSize: '16px' }} />,
    requiredRole: 'admin',
    children: [
      {
        key: '/users',
        label: t('menu.users', 'Users'),
        icon: <UserOutlined style={{ fontSize: '14px' }} />,
      },
      {
        key: '/roles',
        label: t('menu.roles', 'Roles & Permissions'),
        icon: <UserSwitchOutlined style={{ fontSize: '14px' }} />,
      },
      {
        key: '/data-generator',
        label: t('menu.dataGenerator', 'Data Generator'),
        icon: <DatabaseOutlined style={{ fontSize: '14px' }} />,
      },
    ]
  }] : [] as MenuItem[])
];

const SidebarLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const { token: { colorBgContainer } = {} } = theme.useToken();
  const isAdmin = user?.role === 'admin';
  const menuItems = useMemo<MenuItem[]>(() => getMenuItems(t, isAdmin), [t, isAdmin]);
  
  // Get the current selected key based on path
  const getSelectedKeys = useCallback(() => {
    const path = location.pathname;
    const selectedKeys: string[] = [];
    
    // Find the item that matches the current path
    menuItems.forEach((item: MenuItem) => {
      if (item.key === path) {
        selectedKeys.push(item.key);
      } else if (hasChildren(item)) {
        const childMatch = item.children.find(child => child.key === path);
        if (childMatch) {
          selectedKeys.push(item.key);
          selectedKeys.push(childMatch.key);
        }
      }
    });
    
    return selectedKeys.length ? selectedKeys : ['/'];
  }, [location.pathname, menuItems]);
  
  // Get default open keys for submenus
  const getDefaultOpenKeys = useCallback(() => {
    const path = location.pathname;
    const openKeys: string[] = [];
    
    menuItems.forEach((item: MenuItem) => {
      if (hasChildren(item) && item.children.some(child => child.key === path)) {
        openKeys.push(item.key);
      }
    });
    
    return openKeys;
  }, [location.pathname, menuItems]);
  
  // Memoize the selected keys and open keys
  const selectedKeys = useMemo(() => getSelectedKeys(), [getSelectedKeys]);
  const defaultOpenKeys = useMemo(() => getDefaultOpenKeys(), [getDefaultOpenKeys]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        width={260} 
        style={{ 
          background: colorBgContainer,
          boxShadow: '2px 0 8px 0 rgba(29, 35, 41, 0.05)',
          zIndex: 10,
        }}
        className="custom-sider"
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Logo and System Name */}
          <div style={{ 
            padding: '24px 16px', 
            textAlign: 'center',
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
          }}>
            <img 
              src={logo} 
              alt="logo" 
              style={{ 
                width: 40, 
                height: 40, 
                marginBottom: 8,
                borderRadius: '50%'
              }} 
            />
            <div style={{ 
              fontWeight: 600, 
              fontSize: 18, 
              color: 'rgba(0, 0, 0, 0.88)',
              lineHeight: 1.4
            }}>
              {t('common.appTitle')}
            </div>
          </div>

          {/* User Profile */}
          <div style={{ 
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
          }}>
            <Avatar 
              src={user?.avatar} 
              icon={<UserOutlined />} 
              style={{ marginRight: 12 }}
            />
            <div>
              <div style={{ fontWeight: 500 }}>{user?.name || user?.email}</div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {user?.role === 'admin' ? t('common.administrator') : t('common.user')}
              </Text>
            </div>
          </div>

          {/* Navigation Menu */}
          <div style={{ flex: 1, overflow: 'auto', padding: '8px 0' }}>
            <Menu
              mode="inline"
              selectedKeys={selectedKeys}
              defaultOpenKeys={defaultOpenKeys}
              style={{ borderRight: 0 }}
              items={menuItems.map(item => ({
                ...item,
                ...(hasChildren(item) ? {
                  children: item.children.map(child => ({
                    ...child,
                    onClick: () => navigate(child.key)
                  }))
                } : {
                  onClick: () => navigate(item.key)
                })
              }))}
            />
          </div>

          {/* Footer */}
          <div style={{ 
            padding: '16px',
            borderTop: '1px solid rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ marginBottom: 8 }}>
              <LanguageSwitcher />
            </div>
            <Button
              type="text"
              danger
              icon={<LogoutOutlined style={{ fontSize: 16 }} />}
              onClick={logout}
            >
              {t('common.logout')}
            </Button>
          </div>
        </div>
      </Sider>
      <Layout>
        <Content style={{ 
          padding: 24, 
          minHeight: '100vh',
          background: '#f5f7fa',
          margin: 0
        }}>
          <div style={{ 
            background: colorBgContainer,
            borderRadius: 8,
            padding: 24,
            minHeight: '100%',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
          }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default SidebarLayout;
