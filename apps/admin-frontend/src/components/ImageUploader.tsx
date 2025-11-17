import React, { useEffect, useState, useCallback } from 'react';
import { Upload, message } from 'antd';
import type { UploadFile, UploadChangeParam, RcFile } from 'antd/es/upload/interface';
import { PlusOutlined } from '@ant-design/icons';
import { ImageData } from '../api/listings';
import { useTranslation } from 'react-i18next';

interface UploadResponse {
  url: string;
  name: string;
}

interface ImageUploaderProps {
  value?: ImageData[];
  onChange?: (value: ImageData[]) => void;
  maxCount?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  value = [],
  onChange,
  maxCount = 8,
}) => {
  const { t } = useTranslation();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Initialize fileList from value prop
  useEffect(() => {
    if (Array.isArray(value) && value.length > 0) {
      // Only update if the value has actually changed
      const currentUrls = fileList.map(file => file.url).sort().join(',');
      const newUrls = value.map(img => img.url).sort().join(',');
      console.log('currentUrls', currentUrls);
      console.log('newUrls', newUrls);
      if (currentUrls !== newUrls) {
        const files = value.map((img, index) => ({
          uid: `-${index + 1}`,
          name: img.name,
          status: 'done' as const,
          url: img.url,
          response: { url: img.url, name: img.name },
        }));
        setFileList(files);
      }
    } 
  }, [value,fileList]);

  const handleChange = (info: UploadChangeParam<UploadFile<UploadResponse>>) => {
    try {
      console.log('handleChange', info);
      setFileList(info.fileList);

      if (info.file.status === 'done') {
        // Successfully uploaded
        const uploadedImages = info.fileList
          .filter(file => file.status === 'done')
          .map(file => ({
            url: file.response?.url || file.url || '',
            name: file.response?.name || file.name || 'image',
          }));

        onChange?.(uploadedImages);
        message.success(t('common.uploadSuccess', { fileName: info.file.name }));
      } else if (info.file.status === 'error') {
        console.error('Upload error:', info.file.error);
        message.error(t('common.uploadFailed', { fileName: info.file.name }));
      }
    } catch (error) {
      console.error('Error in handleChange:', error);
    }
  };

  const handleRemove = useCallback((file: UploadFile) => {
    const newFileList = fileList.filter(item => item.uid !== file.uid);
    setFileList(newFileList);

    const uploadedImages = newFileList
      .filter(f => f.status === 'done')
      .map(f => ({
        url: f.response?.url || f.url || '',
        name: f.response?.name || f.name || 'image',
      }));

    onChange?.(uploadedImages);
    return true;
  }, [fileList, onChange]);

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{t('common.upload', 'Upload')}</div>
    </button>
  );

  return (
    <Upload
      action="/api/uploads/image"
      listType="picture-card"
      fileList={fileList}
      onChange={handleChange}
      onRemove={handleRemove}
      multiple
      accept="image/*"
      name="file"
      withCredentials
      beforeUpload={(file: RcFile) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
          message.error(t('errors.imageOnly'));
          return Upload.LIST_IGNORE;
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
          message.error(t('errors.imageTooLarge'));
          return Upload.LIST_IGNORE;
        }
        return true;
      }}

    >
      {fileList.length >= maxCount ? null : uploadButton}
    </Upload>
  );
};

export default ImageUploader;
