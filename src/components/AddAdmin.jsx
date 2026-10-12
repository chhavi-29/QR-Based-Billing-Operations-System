import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Govigyan_banner_1.png';
import '../styles/AddAdmin.css';

const AddAdmin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null); // for success or error
  const [messageType, setMessageType] = useState(''); // success or error
  const navigate = useNavigate();

  const handleAddAdmin = async () => {
    if (!username || !password) {
      setMessage('Please fill in all fields.');
      setMessageType('error');
      return;
    }

    try {
      await addDoc(collection(db, 'admins'), {
        username,
        password,
      });

      setMessage('New admin added successfully!');
      setMessageType('success');
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Error adding new admin:', error);
      setMessage('Something went wrong!');
      setMessageType('error');
    }
  };

  return (
    <div className="add-admin-wrapper">
      <div className="navbar">
        <button className="back-arrow" onClick={() => navigate('/admin')}>←</button>
        <img src={logo} alt="Govigyan Logo" className="logo" />
      </div>

      <div className="add-admin-container">
        {/* <img src={logo} alt="Floating Logo" className="floating-logo" /> */}
        <h2>Add New Admin</h2>

        {message && (
          <div className={`feedback-message ${messageType}`}>
            {message}
          </div>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={handleAddAdmin}>Add Admin</button>
      </div>
    </div>
  );
};

export default AddAdmin;
