// import React, { useEffect, useState } from 'react';
// import { doc, getDoc, setDoc } from 'firebase/firestore';
// import { db } from '../firebaseConfig';
// import { useNavigate } from 'react-router-dom';
// import logo from '../assets/Govigyan_banner_1.png';
// import '../styles/BusinessInfo.css';

// const BusinessInfo = () => {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     businessName: '',
//     ownerName: '',
//     gstin: '',
//     address: '',
//     phone: '',
//     email: '',
//     footerNote: ''
//   });

//   useEffect(() => {
//     const fetchBusinessInfo = async () => {
//       const docRef = doc(db, 'settings', 'businessInfo');
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setForm(docSnap.data());
//       }
//     };
//     fetchBusinessInfo();
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSave = async () => {
//     const docRef = doc(db, 'settings', 'businessInfo');
//     await setDoc(docRef, form);
//     alert('Business info updated!');
//   };

//   return (
//     <div className="view-bills-page">
//       {/* ✅ Navbar */}
//       <div className="navbar">
//         <span className="back-arrow" onClick={() => navigate(-1)}>&larr;</span>
//         <img src={logo} alt="Logo" className="logo" />
//       </div>

//       {/* ✅ Business Info Form Container */}
//       <div className="business-info-container">
//         <h2>Business Details</h2>

//         <form className="business-info-form">
//           {Object.entries(form).map(([key, value]) => (
//             <div className="form-field" key={key}>
//               <label className="form-label">
//                 {key.charAt(0).toUpperCase() + key.slice(1)}:
//               </label>
//               <input
//                 type="text"
//                 name={key}
//                 value={value}
//                 onChange={handleChange}
//                 placeholder={`Enter ${key}`}
//               />
//             </div>
//           ))}
//           <button type="button" onClick={handleSave}>Save</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default BusinessInfo;


import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Govigyan_banner_1.png';
import '../styles/BusinessInfo.css';

const BusinessInfo = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    businessName: '',
    ownerName: '',
    gstin: '',
    phone: '',
    email: '',
    address: '',
    footerNote: ''
  });

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      const docRef = doc(db, 'settings', 'businessInfo');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setForm(docSnap.data());
      }
    };
    fetchBusinessInfo();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const docRef = doc(db, 'settings', 'businessInfo');
    await setDoc(docRef, form);
    alert('Business info updated!');
  };

  return (
    <div className="view-bills-page">
      {/* ✅ Navbar */}
      <div className="navbar">
        <span className="back-arrow" onClick={() => navigate(-1)}>&larr;</span>
        <img src={logo} alt="Logo" className="logo" />
      </div>

      {/* ✅ Business Info Form Container */}
      <div className="business-info-container">
        <h2>Business Details</h2>

        <form className="business-info-form">
          <div className="form-field">
            <label>Business Name:</label>
            <input
              type="text"
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              placeholder="Enter business name"
            />
          </div>

          <div className="form-field">
            <label>Owner Name:</label>
            <input
              type="text"
              name="ownerName"
              value={form.ownerName}
              onChange={handleChange}
              placeholder="Enter owner name"
            />
          </div>

          <div className="form-field">
            <label>GSTIN:</label>
            <input
              type="text"
              name="gstin"
              value={form.gstin}
              onChange={handleChange}
              placeholder="Enter GSTIN"
            />
          </div>

          <div className="form-field">
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter contact number"
            />
          </div>

          <div className="form-field">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </div>

          <div className="form-field">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter business address"
            />
          </div>

          <div className="form-field">
            <label>Footer Note:</label>
            <input
              type="text"
              name="footerNote"
              value={form.footerNote}
              onChange={handleChange}
              placeholder="Enter note to show on bills"
            />
          </div>

          <button type="button" onClick={handleSave}>Save</button>
        </form>
      </div>
    </div>
  );
};

export default BusinessInfo;
