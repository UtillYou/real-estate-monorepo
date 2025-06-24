import React from 'react';
import { Result, Button, Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const CustomErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f5f7fa',
      padding: '24px'
    }}>
      <Result
        status="404"
        title="404"
        subTitle={t('error.pageNotFound')}
        extra={
          <Space direction="vertical" size="large">
            <Text type="secondary">
              {t('error.pageNotFoundDescription')}
            </Text>
            <Button 
              type="primary" 
              onClick={() => navigate('/')}
            >
              {t('error.backHome')}
            </Button>
          </Space>
        }
      />
    </div>
  );
};

export default CustomErrorPage;
