import React from 'react';
import { Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const AvatarUploader: React.FC<{
  value?: string;
  onChange?: (url: string) => void;
}> = ({ value, onChange }) => {
  const [uploading, setUploading] = React.useState(false);

  const handleChange = async (info: any) => {
    if (info.file.status === 'uploading') {
      setUploading(true);
      return;
    }
    if (info.file.status === 'done') {
      setUploading(false);
      const url = info.file.response?.url;
      if (url && onChange) onChange(url);
      message.success('Avatar uploaded successfully!');
    }
  };

  return (
    <Upload
      name="file"
      showUploadList={false}
      action="/api/uploads/image"
      withCredentials
      accept="image/*"
      onChange={handleChange}
    >
      {value ? (
        <img src={value} alt="avatar" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: 64, height: 64, border: '1px dashed #d9d9d9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
          <PlusOutlined />
        </div>
      )}
    </Upload>
  );
};

export default AvatarUploader;
