// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/FrontPage.css';

// const FrontPage = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="front-page">
//       <h1>QR-Based Billing System</h1>
//       <p>"Effortless billing with real-time QR scanning and inventory management."</p>

//       <div className="buttons">
//         <button onClick={() => navigate('/scan-qr')}>📷 Scan QR</button>
//         <button onClick={() => navigate('/cart')}>🛒 Cart Preview</button>
//         <button onClick={() => navigate('/bills')}>📑 Download Previous Bills</button>  {/* ✅ This now works! */}
//       </div>

//       <footer>© 2025 QR Billing System. All Rights Reserved.</footer>
//     </div>
//   );
// };

// export default FrontPage;



import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineQrcode, AiOutlineShoppingCart, AiOutlineFileText } from 'react-icons/ai'; 
import '../styles/FrontPage.css';
import logo from '../assets/Govigyan_banner_1.png';

const FrontPage = () => {
  const navigate = useNavigate(); // ✅ useNavigate must be inside the component

  return (
    <div className="add-admin-wrapper">
      <div className="navbar">
        <button className="back-arrow" onClick={() => navigate('/')}>←</button>
        <img src={logo} alt="Govigyan Logo" className="logo" />
      </div>
      <div className="front-page">
        <div className="buttons">
          <button onClick={() => navigate('/scan')}>
            <AiOutlineQrcode className="icon" /> Scan QR
          </button>
          <button onClick={() => navigate('/cart')}>
            <AiOutlineShoppingCart className="icon" /> Cart Preview
          </button>
          <button onClick={() => navigate('/bills')}>
            <AiOutlineFileText className="icon" /> Download Previous Bills
          </button>
        </div>

        <footer>© 2025 QR Billing System. All Rights Reserved.</footer>
      </div>
    </div>
  );
};

export default FrontPage;
