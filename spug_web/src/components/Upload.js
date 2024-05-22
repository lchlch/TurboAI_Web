import React from 'react';
import ResumableUploader from 'react-resumable-uploader';
import axios from 'axios';

const MyUploader = () => {
  const handleFileAdded = (file) => {
    const chunkSize = 1 * 1024 * 1024; // 1MB
    const totalChunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;

    const uploadChunk = (start, end) => {
      const formData = new FormData();
      formData.append('file', file.slice(start, end));

      axios.post('http://your-upload-endpoint.com', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        currentChunk++;
        if (currentChunk < totalChunks) {
          const start = currentChunk * chunkSize;
          const end = Math.min(start + chunkSize, file.size);
          uploadChunk(start, end);
        } else {
          console.log('File uploaded successfully:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error uploading chunk:', error);
      });
    };

    const start = 0;
    const end = Math.min(chunkSize, file.size);
    uploadChunk(start, end);
  };

  return (
    <ResumableUploader
      onFileAdded={handleFileAdded}
    />
  );
};

export default MyUploader;
