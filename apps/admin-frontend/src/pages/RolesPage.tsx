import React from 'react';
import { Card, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const RolesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        {t('menu.roles')}
      </Title>
      <Card>
        <p>{t('common.comingSoon', 'Coming soon...')}</p>
      </Card>
    </div>
  );
};

export default RolesPage;
