import React, { useCallback, useRef } from "react";
import ReactQuill, { Value, Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageUploader from "quill-image-uploader";
import axios from 'axios';
import { message } from 'antd';

Quill.register("modules/imageUploader", ImageUploader);

export interface IProps {
    value?: Value;
    onChange?: (value: string) => void;
  }

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
    ],
    ["link", "code","image"],
    ["clean"],
  ],
  imageUploader: {
    upload: (file: File) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);

        axios.post<any,{data:{url:string,name:string}},any>('/api/uploads/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true,
          })
          .then((result) => {
            console.log(result);
            resolve(result.data.url);
          })
          .catch((error) => {
            reject("Upload failed");
            console.error("Error:", error);
          });
      });
    },
  },
};
 
 
const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const result = await axios.post<{ url: string; name: string }>(
      '/api/uploads/image',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      }
    );
    return result.data.url;
  } catch (error) {
    console.error("Image upload failed:", error);
    message.error('Image upload failed');
    throw error;
  }
};

const RichEditor: React.FC<IProps> = (props: IProps) => {
  const { value, onChange } = props;
  const quillRef = useRef<ReactQuill>(null);

  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    // Check if there are any image files in the paste event
    const items = e.clipboardData?.items;
    if (!items) return;

    let hasImage = false;
    
    // Check all items in the paste event
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') === 0) {
        hasImage = true;
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          
          try {
            const range = quillRef.current?.getEditor().getSelection(true);
            if (range) {
              // Insert a placeholder
              quillRef.current?.getEditor().insertText(range.index, 'Uploading image...');
              
              // Upload the image
              const imageUrl = await uploadImage(file);
              
              // Remove the placeholder and insert the image
              quillRef.current?.getEditor().deleteText(range.index, 18); // Length of 'Uploading image...'
              const rangeAfterDelete = quillRef.current?.getEditor().getSelection(true);
              if (rangeAfterDelete) {
                quillRef.current?.getEditor().insertEmbed(rangeAfterDelete.index, 'image', imageUrl);
                // Move cursor after the image
                quillRef.current?.getEditor().setSelection(rangeAfterDelete.index + 1, 0);
              }
            }
          } catch (error) {
            message.error('Failed to upload pasted image');
            console.error('Image paste error:', error);
          }
        }
      }
    }
    
    // If no image was found, let the default paste handler handle it
    if (!hasImage) return;
    
    // Prevent the default paste behavior since we've handled it
    e.preventDefault();
  }, []);

  return (
    <div onPaste={handlePaste}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
      />
    </div>
  );
};

export default RichEditor;
