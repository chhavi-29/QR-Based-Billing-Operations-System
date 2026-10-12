import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import '../styles/Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const [qrURL, setQrURL] = useState('');
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const fetchQR = async () => {
      const qrDoc = await getDoc(doc(db, 'storeInfo', 'paymentQR'));
      if (qrDoc.exists()) {
        setQrURL(qrDoc.data().qrBase64);

      }
    };
    fetchQR();
  }, []);

  const handleUPIPayment = () => {
    if (qrURL) {
      setShowQR(true);
    } else {
      alert('QR Code not available. Please upload in admin panel.');
    }
  };

  return (
    <div className="payment-page">
      <h1>Payment</h1>
      <p>Select your payment method:</p>

      <div className="button-container">
        <button className="payment-button" onClick={() => alert('Payment Successful!')}>
          💳 Pay via Card
        </button>

        <button className="payment-button" onClick={handleUPIPayment}>
          🏦 Pay via UPI
        </button>

        <button className="payment-button" onClick={() => alert('Payment Successful!')}>
          💰 Pay via Cash
        </button>
      </div>

      {showQR && qrURL && (
        <div className="upi-qr">
          <img src={qrURL} alt="UPI QR Code" />
          <p>Scan to Pay</p>
        </div>
      )}

      <button className="home-btn" onClick={() => navigate('/')}>
        🏠 Return to Home
      </button>
    </div>
  );
};

export default Payment;
