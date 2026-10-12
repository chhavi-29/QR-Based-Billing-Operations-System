import React, { useEffect, useState, useCallback } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../styles/LowStockAlert.css';
import logo from '../assets/Govigyan_banner_1.png'; // ✅ No changes here

const LowStockAlert = () => {
    const [lowStockItems, setLowStockItems] = useState([]);
    const [threshold, setThreshold] = useState(5);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchLowStockItems = useCallback(async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'products'));
            const items = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(item => parseInt(item.stock) <= threshold);
            setLowStockItems(items);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }, [threshold]);

    useEffect(() => {
        fetchLowStockItems();
    }, [fetchLowStockItems]);

    const handleThresholdChange = (e) => {
        const value = parseInt(e.target.value);
        setThreshold(isNaN(value) ? 0 : value);
    };

    return (
        <div className="view-bills-page">
            {/* ✅ Navbar */}
            <div className="navbar">
                <span className="back-arrow" onClick={() => navigate(-1)}>&larr; </span>
                <img src={logo} alt="Logo" className="logo" />
            </div>

            <div className="low-stock-container">
                <div className="header-row">
                    <h2>Low Stock Alerts</h2>
                    
                </div>

                <div className="threshold-input">
                    <label>Alert if stock ≤ </label>
                    <input
                        type="number"
                        value={threshold}
                        onChange={handleThresholdChange}
                        min="1"
                    />
                </div>

                {loading ? (
                    <p>Loading products...</p>
                ) : lowStockItems.length === 0 ? (
                    <p className="no-alert">✅ All products are above the stock threshold.</p>
                ) : (
                    <ul className="low-stock-list">
                        {lowStockItems.map(item => (
                            <li key={item.id}>
                                <strong>{item.name}</strong> – Stock: {item.stock}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default LowStockAlert;
