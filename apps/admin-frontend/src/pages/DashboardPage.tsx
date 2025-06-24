import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { useTranslation } from 'react-i18next';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="dashboard">
      <h1>{t('dashboard.title', 'Dashboard')}</h1>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title={t('dashboard.totalListings', 'Total Listings')} 
              value={0} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title={t('dashboard.activeUsers', 'Active Users')} 
              value={0} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title={t('dashboard.pendingApprovals', 'Pending Approvals')} 
              value={0} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title={t('dashboard.totalRevenue', 'Total Revenue')} 
              value={0} 
              prefix="¥" 
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title={t('dashboard.recentActivity', 'Recent Activity')}>
            <p>{t('dashboard.noRecentActivity', 'No recent activity.')}</p>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={t('dashboard.quickActions', 'Quick Actions')}>
            <p>{t('dashboard.noQuickActions', 'No quick actions available.')}</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
