import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import "../styles/InventoryDashboard.css";

import logo from '../assets/Govigyan_banner_1.png';
// import '../styles/Inventory.css';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: '', qrCode: '' });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            const querySnapshot = await getDocs(collection(db, 'products'));
            const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productList);
        };
        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const addProduct = async () => {
        await addDoc(collection(db, 'products'), newProduct);
        setNewProduct({ name: '', price: '', stock: '', category: '', qrCode: '' });
        window.location.reload();
    };

    const updateProduct = async (id, updatedStock) => {
        const productRef = doc(db, 'products', id);
        await updateDoc(productRef, { stock: updatedStock });
        window.location.reload();
    };

    const deleteProduct = async (id) => {
        await deleteDoc(doc(db, 'products', id));
        window.location.reload();
    };

    return (
        <div>
            {/* ✅ Navbar */}
            <div className="navbar">
                <span className="back-arrow" onClick={() => navigate(-1)}>&larr;</span>
                <img src={logo} alt="Logo" className="logo" />
            </div>

            {/* ✅ Inventory Panel */}
            <div className="inventory-admin-panel">
                <h2>Admin Inventory Management</h2>
                <div className="add-product-form">
                    <input type="text" name="name" placeholder="Product Name" value={newProduct.name} onChange={handleInputChange} />
                    <input type="number" name="price" placeholder="Price" value={newProduct.price} onChange={handleInputChange} />
                    <input type="number" name="stock" placeholder="Stock" value={newProduct.stock} onChange={handleInputChange} />
                    <input type="text" name="category" placeholder="Category" value={newProduct.category} onChange={handleInputChange} />
                    <input type="text" name="qrCode" placeholder="QR Code" value={newProduct.qrCode} onChange={handleInputChange} />
                    <button onClick={addProduct}>Add Product</button>
                </div>
                <ul className="product-list">
                    {products.map(product => (
                        <li key={product.id}>
                            <strong>{product.name}</strong> - ₹{product.price} - Stock: {product.stock} - Category: {product.category}
                            <input type="number" placeholder="Update Stock" onChange={(e) => updateProduct(product.id, e.target.value)} />
                            <button onClick={() => deleteProduct(product.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Inventory;
