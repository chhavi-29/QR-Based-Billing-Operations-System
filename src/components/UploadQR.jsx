import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import '../styles/UploadQR.css';
import logo from '../assets/Govigyan_banner_1.png';
import { FiUpload, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const UploadQRCode = () => {
  const [preview, setPreview] = useState(null);
  const [existingQR, setExistingQR] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  // Fetch the current QR code on component mount
  useEffect(() => {
    const fetchQR = async () => {
      try {
        const docRef = doc(db, 'storeInfo', 'paymentQR');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.qrBase64) {
            setExistingQR(data.qrBase64);
          }
        }
      } catch (error) {
        console.error('Error fetching QR:', error);
      }
    };

    fetchQR();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result); // Base64 image preview
      setSuccessMsg('');
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!preview) return;

    setIsUploading(true);
    try {
      await setDoc(doc(db, 'storeInfo', 'paymentQR'), {
        qrBase64: preview,
      });

      setSuccessMsg('✅ QR Code uploaded successfully!');
      setExistingQR(preview);
      setPreview(null);
    } catch (error) {
      console.error('Upload failed:', error);
      setSuccessMsg('❌ Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    try {
      await setDoc(doc(db, 'storeInfo', 'paymentQR'), {
        qrBase64: '',
      });

      setExistingQR(null);
      setSuccessMsg('🗑️ QR Code removed.');
    } catch (error) {
      console.error('Error removing QR:', error);
      setSuccessMsg('❌ Failed to remove QR.');
    }
  };

  return (
    <div>
      <div className="navbar">
        <span className="back-arrow" onClick={() => navigate(-1)}>&larr;</span>
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className="qr-upload-container">
        <h3>{existingQR ? 'Change or Remove QR Code' : 'Upload Store QR Code'}</h3>

        <input type="file" accept="image/*" onChange={handleFileChange} />

        {/* Show Preview of Selected QR */}
        {preview && (
          <div className="qr-preview">
            <img src={preview} alt="Preview QR" />
            <p>Preview</p>
          </div>
        )}

        {/* Show Existing QR if no new file is selected */}
        {!preview && existingQR && (
          <div className="qr-preview">
            <img src={existingQR} alt="Existing QR" />
            <p>Current Store QR</p>
          </div>
        )}

        {/* Upload Button */}
        {preview && (
          <button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? 'Uploading...' : (
              <>
                <FiUpload style={{ marginRight: '6px' }} />
                Upload QR
              </>
            )}
          </button>
        )}

        {/* Remove Button */}
        {existingQR && !preview && (
          <button onClick={handleRemove} className="remove-btn">
            <FiTrash2 style={{ marginRight: '6px' }} />
            Remove QR
          </button>
        )}

        {successMsg && <p className="success-msg">{successMsg}</p>}
      </div>
    </div>
  );
};

export default UploadQRCode;
