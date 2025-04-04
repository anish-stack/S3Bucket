import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [file, setFile] = useState(null);
  const [fileLink, setFileLink] = useState('');
  const [uploadTime, setUploadTime] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileLink('');
    setUploadTime(null);

  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a file.');

    try {
      const formData = new FormData();
      formData.append('file', file);

      setIsUploading(true);
      const startTime = Date.now();

      const { data } = await axios.post('http://localhost:3010/upload-file', formData);
      const { signedUrl, fileLink } = data;



      try {
        const response = await axios.put(signedUrl, file, {
          headers: {
            'Content-Type': file.type,
          },
        });
        const endTime = Date.now();
        const timeTaken = ((endTime - startTime) / 1000).toFixed(2);


        setFileLink(fileLink);
        setUploadTime(timeTaken);
        alert('Upload complete!');
      } catch (uploadErr) {
        console.error('Failed to upload to S3:', uploadErr);
        alert('Upload to S3 failed.');
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const renderPreview = () => {
    if (!file) return null;

    const type = file.type.split('/')[0];
    const url = URL.createObjectURL(file);

    if (type === 'image') {
      return <img src={url} alt="preview" className="preview" />;
    } else if (type === 'video') {
      return <video src={url} controls className="preview" />;
    } else {
      return <p className="no-preview">No preview available</p>;
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload File to S3 via Signed URL</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>

      {isUploading && <div className="loader"></div>}

      {file && (
        <div className="file-info">
          <p><strong>Filename:</strong> {file.name}</p>
          <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
          <p><strong>Type:</strong> {file.type}</p>
        </div>
      )}

      {renderPreview()}

      {uploadTime && (
        <p className="upload-time">⏱ Uploaded in {uploadTime} seconds</p>
      )}

      {fileLink && (
        <div className="file-link">
          <p>✅ File uploaded successfully!</p>
          <a href={fileLink} target="_blank" rel="noopener noreferrer">{fileLink}</a>
        </div>
      )}
    </div>
  );
};

export default App;
