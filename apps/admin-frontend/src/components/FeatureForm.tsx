import React from 'react';
import { Form, Input, Modal } from 'antd';
import { Feature } from '../api/features';

interface FeatureFormProps {
  open: boolean;
  initialValues?: Partial<Feature>;
  onCancel: () => void;
  onSubmit: (values: Omit<Feature, 'id' | 'createdAt' | 'updatedAt'>) => void;
  loading?: boolean;
}

const FeatureForm: React.FC<FeatureFormProps> = ({
  open,
  initialValues,
  onCancel,
  onSubmit,
  loading = false,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (open) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue(initialValues);
      }
    }
  }, [open, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      open={open}
      title={initialValues?.id ? 'Edit Feature' : 'Create Feature'}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        preserve={false}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: 'Please enter a name' },
            { max: 100, message: 'Name must be less than 100 characters' },
          ]}
        >
          <Input placeholder="Enter feature name" />
        </Form.Item>
        <Form.Item
          name="icon"
          label="Icon (optional)"
          rules={[
            { max: 50, message: 'Icon must be less than 50 characters' },
          ]}
        >
          <Input placeholder="Enter icon class or emoji" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FeatureForm;
