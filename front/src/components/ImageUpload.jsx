import React, { useState } from 'react';
import axios from 'axios';
import './ImageUpload.css';

const ImageUpload = ({ onImageUploaded, existingImageId = null }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('L\'image ne doit pas dépasser 5MB');
        return;
      }
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Veuillez sélectionner une image');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (onImageUploaded) {
        onImageUploaded(response.data.imageId);
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'upload de l\'image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-upload">
      <div className="preview-container">
        {preview ? (
          <img src={preview} alt="Aperçu" className="image-preview" />
        ) : existingImageId ? (
          <img src={`/api/images/${existingImageId}`} alt="Image existante" className="image-preview" />
        ) : (
          <div className="no-image">Aucune image sélectionnée</div>
        )}
      </div>

      <div className="upload-controls">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="file-input"
        />
        <button
          onClick={handleUpload}
          disabled={!selectedFile || loading}
          className="upload-button"
        >
          {loading ? 'Upload en cours...' : 'Uploader l\'image'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ImageUpload; 