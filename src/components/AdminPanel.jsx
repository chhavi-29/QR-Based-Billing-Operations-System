import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPanel.css';
import { MdBusiness, MdInventory, MdWarning, MdReceipt, MdPersonAdd } from 'react-icons/md';
import { AiOutlineQrcode } from 'react-icons/ai'; 
import logo from '../assets/Govigyan_banner_1.png'; // Adjust path if needed

const AdminPanel = () => {
  const navigate = useNavigate();

  const features = [
    { label: 'Business Info', route: '/business-info', icon: <MdBusiness size={28} /> },
    { label: 'Manage Inventory', route: '/inventory', icon: <MdInventory size={28} /> },
    { label: 'Low Stock Alerts', route: '/lowstockalert', icon: <MdWarning size={28} /> },
    { label: 'All Bills', route: '/view-bills', icon: <MdReceipt size={28} /> },
    { label: 'Add Admin', route: '/add-admin', icon: <MdPersonAdd size={28} /> },
    { label: 'Upload UPI QR', route: '/upload-qr', icon: <AiOutlineQrcode size={28} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/');
  };

  return (
        

    <div className="admin-panel">
      <div className="admin-navbar">
        <img src={logo} alt="Logo" className="admin-logo" />
        <div className="logout-buttons">
    <button className = "scanqr" onClick={() => navigate('/scan')}>
              <AiOutlineQrcode className="icon" />Scan QR
            </button>
    <button className="logout-button" onClick={handleLogout}>Logout</button>
  </div>
      </div>

      <div className="dashboard-container">
        <h2>Admin Dashboard</h2>

        <div className="dashboard-grid">
          {features.map((feature, idx) => (
            <button key={idx} className="dashboard-card" onClick={() => navigate(feature.route)}>
              <span className="icon">{feature.icon}</span>
              <span>{feature.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
