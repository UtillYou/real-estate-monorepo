import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Dropdown, Typography, message } from 'antd';
import { GlobalOutlined, CheckOutlined, DownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { MenuProps } from 'antd';

const { Text } = Typography;

const languages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
] as const;

type LanguageCode = typeof languages[number]['code'];

const LanguageSwitcher: React.FC = () => {
  const { i18n, ready } = useTranslation();
  const [currentLang, setCurrentLang] = useState<LanguageCode>(i18n.language as LanguageCode || 'en');
  const [messageApi, contextHolder] = message.useMessage();

  // Update local state when i18n language changes
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      if (lng && lng !== currentLang) {
        setCurrentLang(lng as LanguageCode);
      }
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, currentLang]);

  const changeLanguage = useCallback(async (language: LanguageCode) => {
    if (!ready) {
      console.log('i18n not ready yet');
      messageApi.warning('i18n not ready yet');
      return;
    }
    
    if (language === currentLang) return;
    
    try {
      await i18n.changeLanguage(language);
      setCurrentLang(language);
      messageApi.success(`Language changed to ${languages.find(l => l.code === language)?.name}`);
    } catch (error) {
      console.error('Failed to change language:', error);
      messageApi.error('Failed to change language');
    }
  }, [i18n, ready, currentLang, messageApi]);

  const menuItems = useMemo<MenuProps['items']>(
    () =>
      languages.map((lang) => ({
        key: lang.code,
        label: (
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              minWidth: 100,
              padding: '4px 0'
            }}
          >
            <Text>{lang.name}</Text>
            {currentLang === lang.code && <CheckOutlined style={{ color: '#1890ff' }} />}
          </div>
        ),
        onClick: () => changeLanguage(lang.code),
      })),
    [currentLang, changeLanguage]
  );

  const currentLanguage = useMemo(
    () => languages.find((lang) => lang.code === currentLang) || languages[0],
    [currentLang]
  );

  if (!ready) {
    return (
      <Button type="text" icon={<GlobalOutlined />} loading disabled>
        <span>Loading...</span>
      </Button>
    );
  }

  return (
    <>
      {contextHolder}
      <Dropdown 
        menu={{ items: menuItems }} 
        trigger={['click']} 
        arrow={{ pointAtCenter: true }}
      >
        <Button 
          type="text" 
          icon={<GlobalOutlined />} 
          // style={{ 
          //   display: 'flex', 
          //   alignItems: 'center', 
          //   gap: 8,
          //   padding: '0 8px',
          //   height: '100%'
          // }}
        >
          <span>{currentLanguage.name}</span>
          <DownOutlined style={{ fontSize: 12, opacity: 0.75 }} />
        </Button>
      </Dropdown>
    </>
  );
};

export default React.memo(LanguageSwitcher);
