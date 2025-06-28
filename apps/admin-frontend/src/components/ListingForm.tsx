import React, { useEffect, useState } from 'react';
import { 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Switch, 
  Button, 
  Card, 
  Row, 
  Col, 
  Checkbox,
} from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import RichEditor from './RichEditor';
import ImageUploader from './ImageUploader';
import { Listing, CreateListingDto, UpdateListingDto } from '../api/listings';
import { Feature, getFeatures } from '../api/features';

const { Option } = Select;

interface Props {
  initialValues?: Listing | null;
  onSubmit: (values: CreateListingDto | UpdateListingDto) => void;
  loading?: boolean;
  onCancel: () => void;
}

const ListingForm: React.FC<Props> = ({ initialValues, onSubmit, loading, onCancel }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<number[]>([]);
  
  const propertyTypes = [
    { value: 'APARTMENT', label: t('propertyTypes.APARTMENT') },
    { value: 'HOUSE', label: t('propertyTypes.HOUSE') },
    { value: 'CONDO', label: t('propertyTypes.CONDO') },
    { value: 'TOWNHOUSE', label: t('propertyTypes.TOWNHOUSE') },
    { value: 'LAND', label: t('propertyTypes.LAND') },
    { value: 'COMMERCIAL', label: t('propertyTypes.COMMERCIAL') },
    { value: 'OTHER', label: t('propertyTypes.OTHER') },
  ];

  // Load available features
  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const data = await getFeatures();
        setFeatures(data);
      } catch (error) {
        console.error('Failed to load features:', error);
      }
    };
    
    loadFeatures();
  }, []);

  // Initialize form with default values and initial values
  useEffect(() => {
    const initializeForm = () => {
      if (initialValues) {
        // For existing listing, set the form values including featureIds
        const featureIds = initialValues.features?.map((f: any) => {
          if (typeof f === 'object' && f !== null && 'id' in f) {
            return f.id;
          }
          return typeof f === 'string' ? parseInt(f, 10) : f;
        }).filter((id): id is number => !isNaN(id as number)) || [];
        
        const formValues = {
          ...initialValues,
          propertyType: initialValues.propertyType || 'HOUSE',
          isActive: initialValues.isActive !== undefined ? initialValues.isActive : true,
          images: initialValues.images || [],
          featureIds: featureIds
        };
        
        form.setFieldsValue(formValues);
        setSelectedFeatureIds(featureIds);
      } else {
        // For new listing, set default values
        form.setFieldsValue({
          featureIds: [],
          images: [],
          isActive: true,
          propertyType: 'HOUSE'
        });
        setSelectedFeatureIds([]);
      }
    };
    
    initializeForm();
  }, [form, initialValues, features]);

  const handleFeatureChange = (checkedValues: number[]) => {
    setSelectedFeatureIds(checkedValues);
    form.setFieldsValue({ 
      featureIds: checkedValues 
    });
    form.validateFields();
  };

  const handleFinish = async (values: any) => {
    try {
      console.log('handleFinish', values);
      // Use the selectedFeatureIds as the source of truth
      const finalFeatureIds = [...selectedFeatureIds];
      
      // Get the full feature objects for the selected feature IDs
      const selectedFeatures = features
        .filter((feature: Feature) => finalFeatureIds.includes(feature.id))
        .map(({ id, name, icon }) => ({
          id,
          name,
          icon
        }));
      
      // Create the submission object
      const submissionData = {
        ...values,
        price: Number(values.price) || 0,
        bedrooms: Number(values.bedrooms) || 0,
        bathrooms: Number(values.bathrooms) || 0,
        squareFeet: Number(values.squareFeet) || 0,
        yearBuilt: values.yearBuilt ? Number(values.yearBuilt) : undefined,
        features: selectedFeatures,
        featureIds: finalFeatureIds,
        images: values.images || [],
        isActive: !!values.isActive
      };
      
      // Submit the form data
      onSubmit(submissionData);
      
    } catch (error) {
      console.error('Form validation failed:', error);
      // Form validation will show errors automatically
    }
  };


  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: 'calc(100vh - 200px)',
      maxHeight: '80vh',
      overflow: 'hidden'
    }}>
      <Form
        form={form}
        onFinish={handleFinish}
        layout="vertical"
        initialValues={{
          isActive: true,
          propertyType: 'HOUSE',
          images: [],
          featureIds: []
        }}
        onValuesChange={(changedValues, allValues) => {
          // If featureIds changed, update the selectedFeatureIds state
          if (changedValues.featureIds !== undefined) {
            const newFeatureIds = Array.isArray(changedValues.featureIds) 
              ? changedValues.featureIds 
              : [];
            
            // Ensure we only have valid numbers
            const validFeatureIds = newFeatureIds
              .map((id: string | number) => typeof id === 'string' ? parseInt(id, 10) : id)
              .filter((id: number) => !isNaN(id));
              
            setSelectedFeatureIds(validFeatureIds);
          }
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden'
        }}
      >
        <div style={{ overflowY: 'auto', padding: '16px 16px 16px 0px', flex: 1 }}>
          {/* Basic Information */}
          <Card 
            title={t('form.basicInformation')}
            style={{ marginBottom: 24 }}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="title"
                  label={t('form.title')}
                  rules={[{ required: true, message: t('form.requiredField', { field: t('form.title') }) }]}
                >
                  <Input placeholder={t('form.enterPropertyTitle')} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="propertyType"
                  label={t('form.propertyType')}
                  rules={[{ required: true, message: t('form.requiredField', { field: t('form.propertyType') }) }]}
                >
                  <Select placeholder={t('form.selectPropertyType')}>
                    {propertyTypes.map(type => (
                      <Option key={type.value} value={type.value}>
                        {type.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Property Details */}
          <Card 
            title={t('form.propertyDetails')}
            style={{ marginBottom: 24 }}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="bedrooms"
                  label={t('form.bedrooms')}
                  rules={[{ required: true, message: t('form.requiredField', { field: t('form.bedrooms') }) }]}
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="bathrooms"
                  label={t('form.bathrooms')}
                  rules={[{ required: true, message: t('form.requiredField', { field: t('form.bathrooms') }) }]}
                >
                  <InputNumber min={0} step={0.5} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="squareFeet"
                  label={t('form.squareFeet')}
                  rules={[{ required: true, message: t('form.requiredField', { field: t('form.squareFeet') }) }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    formatter={(value: number | string | undefined) => `${value || 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value: string | undefined) => Number(value ? value.replace(/\D/g, '') : '0')}
                    placeholder="0"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="yearBuilt"
                  label={t('form.yearBuilt')}
                >
                  <InputNumber
                    min={1800}
                    max={new Date().getFullYear() + 1}
                    style={{ width: '100%' }}
                    placeholder={t('form.year', 'Year')}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Location */}
          <Card 
            title={t('form.location')}
            style={{ marginBottom: 24 }}
          >
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  name="address"
                  label={t('form.address')}
                  rules={[{ required: true, message: t('form.requiredField', { field: t('form.address') }) }]}
                >
                  <Input placeholder={t('form.enterStreetAddress')} prefix={<HomeOutlined />} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="city"
                  label={t('form.city')}
                  rules={[{ required: true, message: t('form.requiredField', { field: t('form.city') }) }]}
                >
                  <Input placeholder={t('form.enterCity')} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="state"
                  label={t('form.state')}
                >
                  <Input placeholder={t('form.enterStateProvince')} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="zipCode"
                  label={t('form.zipCode')}
                >
                  <Input placeholder={t('form.enterZipPostalCode')} />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Pricing */}
          <Card 
            title={t('form.pricing')}
            style={{ marginBottom: 24 }}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="price"
                  label={t('form.price')}
                  rules={[{ required: true, message: t('form.requiredField', { field: t('form.price') }) }]}
                >
                  <InputNumber 
                    style={{ width: '100%' }} 
                    min={0}
                    step={1000}
                    formatter={(value: number | string | undefined) => `$ ${value || 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value: string | undefined) => Number(value ? value.replace(/\$\s?|(,*)/g, '') : '0')}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Features */}
          <Card 
            title={t('form.featuresAndAmenities')}
            style={{ marginBottom: 24 }}
          >
            <Form.Item
              name="featureIds"
              label={t('form.selectFeatures')}
            >
              <Checkbox.Group 
                style={{ width: '100%' }}
                value={selectedFeatureIds}
                onChange={handleFeatureChange}
              >
                <Row gutter={[16, 8]}>
                  {features.map((feature: Feature) => (
                    <Col xs={12} sm={8} md={6} lg={6} xl={4} key={feature.id}>
                      <Checkbox value={feature.id}>
                        {feature.icon && <span style={{ marginRight: 8 }}>{feature.icon}</span>}
                        {feature.name}
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Card>

          {/* Description & Images */}
          <Card 
            title={t('form.descriptionAndImages')}
            style={{ marginBottom: 24 }}
          >
            <Form.Item
              name="description"
              label={t('form.description')}
              rules={[{ required: true, message: t('form.requiredField', { field: t('form.description') }) }]}
            >
              <RichEditor />
            </Form.Item>

            <Form.Item
              name="images"
              label={t('form.images')}
            >
              <ImageUploader maxCount={10} />
            </Form.Item>
          </Card>

          {/* Status */}
          <Card 
            title={t('form.status')}
            style={{ marginBottom: 0 }}
          >
            <Form.Item
              name="isActive"
              label={t('form.isActive')}
              valuePropName="checked"
            >
              <Switch
                checkedChildren={t('form.active')}
                unCheckedChildren={t('form.inactive')}
                defaultChecked
              />
            </Form.Item>
          </Card>
        </div>
        
        {/* Fixed Footer */}
        <div style={{ 
          padding: '16px 0', 
          borderTop: '1px solid #f0f0f0', 
          textAlign: 'right',
          background: '#fff',
          position: 'sticky',
          bottom: 0,
          zIndex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px'
        }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues ? t('listings.editListing') : t('listings.createListing')}
          </Button>
          <Button onClick={onCancel} disabled={loading}>
            {t('common.cancel')}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ListingForm;
