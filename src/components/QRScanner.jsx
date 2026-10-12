import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import logo from '../assets/Govigyan_banner_1.png';
import '../styles/QRScanner.css';

// Default product catalog fallback (used when Firestore is inaccessible or offline)
const DEFAULT_PRODUCTS = {
    "P001": { id: "P001", name: "Govigyan Shampoo", price: 150, category: "govigyan" },
    "P002": { id: "P002", name: "Pure Cow Ghee", price: 160, category: "govigyan" },
    "F201": { id: "F201", name: "Organic Honey", price: 250, category: "govigyan" },
    "F203": { id: "F203", name: "A2 Milk", price: 100, category: "govigyan" },
    "M101": { id: "M101", name: "Medicinal Syrup", price: 120, category: "medicinal" },
    "M102": { id: "M102", name: "Medicinal Tablets", price: 90, category: "medicinal" },
    "P004": { id: "P004", name: "Herbal Soap", price: 70, category: "govigyan" },
    "M103": { id: "M103", name: "Ayurvedic Oil", price: 200, category: "medicinal" },
    "M104": { id: "M104", name: "Herbal Tea", price: 180, category: "medicinal" },
    "F202": { id: "F202", name: "Dry Fruits Mix", price: 300, category: "govigyan" },
    "F204": { id: "F204", name: "Jaggery Powder", price: 130, category: "govigyan" }
};

const QRScanner = () => {
    const location = useLocation();
    const [products, setProducts] = useState(location.state?.products || []);
    const [manualCode, setManualCode] = useState('');
    const scannerRef = useRef(null);
    const navigate = useNavigate();

    // Look up product by QR code / ID (Firestore first, then local fallback)
    const findProduct = async (code) => {
        const cleanCode = code.trim();
        if (!cleanCode) return null;

        // 1. Try Firestore
        try {
            const querySnapshot = await getDocs(collection(db, 'products'));
            const matchedDoc = querySnapshot.docs.find(doc => {
                const data = doc.data();
                return data.qrCode === cleanCode || doc.id === cleanCode;
            });

            if (matchedDoc) {
                const d = matchedDoc.data();
                return {
                    id: matchedDoc.id,
                    name: d.name,
                    price: parseFloat(d.price) || 0,
                    category: d.category || 'govigyan'
                };
            }
        } catch (err) {
            console.warn("Firestore query note (using local fallback catalog):", err.message);
        }

        // 2. Try localStorage custom products (added via Inventory)
        try {
            const localList = JSON.parse(localStorage.getItem('custom_products') || '[]');
            const localMatch = localList.find(p => 
                p.qrCode === cleanCode || 
                p.id === cleanCode || 
                (p.name && p.name.toLowerCase() === cleanCode.toLowerCase())
            );
            if (localMatch) {
                return {
                    id: localMatch.id || cleanCode,
                    name: localMatch.name,
                    price: parseFloat(localMatch.price) || 0,
                    category: localMatch.category || 'govigyan'
                };
            }
        } catch (localErr) {
            console.warn("LocalStorage check error:", localErr);
        }

        // 3. Fallback to default catalog
        if (DEFAULT_PRODUCTS[cleanCode]) {
            return {
                id: cleanCode,
                name: DEFAULT_PRODUCTS[cleanCode].name,
                price: DEFAULT_PRODUCTS[cleanCode].price,
                category: DEFAULT_PRODUCTS[cleanCode].category
            };
        }

        return null;
    };

    // Add or increment product in cart
    const addProductToCart = (product) => {
        setProducts(prevProducts => {
            const existing = prevProducts.find(p => p.id === product.id);
            if (existing) {
                return prevProducts.map(p => 
                    p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
                );
            } else {
                return [...prevProducts, { ...product, quantity: 1 }];
            }
        });
    };

    // Handle Scanned Product from Camera
    const handleScanSuccess = async (scannedCode) => {
        try {
            const product = await findProduct(scannedCode);
            if (product) {
                addProductToCart(product);
            } else {
                alert(`Product with QR code "${scannedCode.trim()}" not found in database or catalog.`);
            }
        } catch (error) {
            console.error("Error processing scan:", error);
            alert("Failed to retrieve product info.");
        }
    };

    // Handle Manual Code Add
    const handleManualAdd = async () => {
        if (!manualCode.trim()) return;
        const code = manualCode.trim();
        const product = await findProduct(code);
        if (product) {
            addProductToCart(product);
            setManualCode('');
        } else {
            alert(`Product code "${code}" not found. Try P001, P002, F201, or F203.`);
        }
    };

    // Handle Scanner Errors (ignore benign frame errors)
    const handleScanFailure = (error) => {
        // Normal when no QR code is in frame
    };

    // Quantity Adjustments
    const increaseQuantity = (id) => {
        setProducts(prevProducts =>
            prevProducts.map(p =>
                p.id === id ? { ...p, quantity: p.quantity + 1 } : p
            )
        );
    };

    const decreaseQuantity = (id) => {
        setProducts(prevProducts =>
            prevProducts.map(p =>
                p.id === id && p.quantity > 1 ? { ...p, quantity: p.quantity - 1 } : p
            )
        );
    };

    const removeProduct = (id) => {
        setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
    };

    // Start Camera Scanner
    useEffect(() => {
        let isCancelled = false;

        const startScanner = async () => {
            try {
                const element = document.getElementById("reader");
                if (!element) return;

                if (!scannerRef.current) {
                    scannerRef.current = new Html5Qrcode("reader");
                }

                if (!scannerRef.current.isScanning) {
                    await scannerRef.current.start(
                        { facingMode: "environment" },
                        { fps: 10, qrbox: { width: 250, height: 250 } },
                        handleScanSuccess,
                        handleScanFailure
                    );
                    if (isCancelled && scannerRef.current.isScanning) {
                        await scannerRef.current.stop().catch(() => {});
                    }
                }
            } catch (error) {
                console.warn("Camera viewfinder note (manual input available):", error);
            }
        };

        startScanner();

        return () => {
            isCancelled = true;
            if (scannerRef.current) {
                try {
                    if (scannerRef.current.isScanning) {
                        scannerRef.current.stop().catch(() => {});
                    }
                } catch (e) {
                    // Benign unmount error
                }
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className="navbar">
                <button className="back-arrow" onClick={() => navigate('/user-front')}>←</button>
                <img src={logo} alt="Govigyan Logo" className="logo" />
            </div>

            <div className="scanner-page">  
                <h1>Scan Product QR Code</h1>
                
                {/* Live Camera Viewfinder */}
                <div id="reader" className="scanner-box"></div>

                {/* Manual Code Entry & Quick Test */}
                <div style={{ display: 'flex', gap: '8px', width: '90%', maxWidth: '400px', marginTop: '16px' }}>
                    <input
                        type="text"
                        placeholder="Enter QR / Product ID (e.g. P001)"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleManualAdd(); }}
                        style={{
                            flex: 1,
                            padding: '10px 14px',
                            borderRadius: '6px',
                            border: '1px solid #444',
                            background: '#222',
                            color: '#fff',
                            fontSize: '14px'
                        }}
                    />
                    <button
                        onClick={handleManualAdd}
                        style={{
                            padding: '10px 18px',
                            background: '#1769cd',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Add
                    </button>
                </div>

                {/* Shopping Cart */}
                <div className="cart">
                    <h2>Shopping Cart ({products.reduce((acc, p) => acc + p.quantity, 0)} items)</h2>
                    {products.length === 0 ? (
                        <p>Cart is empty. Point your camera at a QR code or click a test button above.</p>
                    ) : (
                        <ul>
                            {products.map((product) => (
                                <li key={product.id}>
                                    <strong>{product.name}</strong> ({product.id})
                                    <br />
                                    Price: ₹{product.price}
                                    <br />
                                    Quantity:
                                    <button className="quantity-btn" onClick={() => decreaseQuantity(product.id)}>-</button>
                                    <span style={{ fontWeight: 'bold', margin: '0 8px' }}>{product.quantity}</span>
                                    <button className="quantity-btn" onClick={() => increaseQuantity(product.id)}>+</button>
                                    <br />
                                    Subtotal: ₹{(product.price * product.quantity).toFixed(2)}
                                    <br />
                                    <button className="remove-btn" onClick={() => removeProduct(product.id)}>Remove</button>
                                    <hr />
                                </li>
                            ))}
                        </ul>
                    )}
                    {products.length > 0 && (
                        <button className="checkout-btn" onClick={() => navigate('/cart', { state: { products } })}>
                            Proceed to Cart (₹{products.reduce((sum, p) => sum + p.price * p.quantity, 0).toFixed(2)})
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default QRScanner;
