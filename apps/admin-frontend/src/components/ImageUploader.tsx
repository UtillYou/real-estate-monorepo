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
  const [uploading, setUploading] = useState(false);

  // Initialize fileList from value prop
  useEffect(() => {
    if (Array.isArray(value) && value.length > 0) {
      const files = value.map((img, index) => ({
        uid: `-${index + 1}`,
        name: img.name,
        status: 'done' as const,
        url: img.url,
        response: { url: img.url, name: img.name },
      }));
      setFileList(files);
    } else {
      setFileList([]);
    }
  }, [value]);

  const handleChange = useCallback((info: UploadChangeParam<UploadFile<UploadResponse>>) => {
    let newFileList = [...info.fileList];

    // Limit the number of uploaded files
    if (newFileList.length > maxCount) {
      newFileList = newFileList.slice(0, maxCount);
      message.warning(t('common.maxImageCount', { maxCount }));
    }

    // Handle file upload status
    if (info.file.status === 'uploading') {
      setUploading(true);
      setFileList(newFileList);
      return;
    }

    if (info.file.status === 'done') {
      // Successfully uploaded
      const uploadedImages = newFileList
        .filter(file => file.status === 'done')
        .map(file => ({
          url: file.response?.url || file.url || '',
          name: file.response?.name || file.name || 'image',
        }));

      setUploading(false);
      onChange?.(uploadedImages);
      message.success(t('common.uploadSuccess', { fileName: info.file.name }));
    } else if (info.file.status === 'error') {
      setUploading(false);
      message.error(t('common.uploadFailed', { fileName: info.file.name }));
    }
  }, [maxCount, onChange, t]);

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
    <div>
      {uploading ? <div>{t('common.uploading')}</div> :
        <>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>{t('common.upload')}</div>
        </>}

    </div>
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
      showUploadList={{
        showRemoveIcon: true,
        showPreviewIcon: true,
      }}
      beforeUpload={(file: RcFile) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
          message.error('You can only upload image files!');
          return Upload.LIST_IGNORE;
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
          message.error('Image must be smaller than 5MB!');
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
