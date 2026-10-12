import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import '../styles/LoginPage.css';
import logo from '../assets/Govigyan_banner_1.png';

const LoginPage = () => {
    const [userName, setUserName] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleUserLogin = () => {
        if (userName.trim() !== '') {
            localStorage.setItem('userName', userName.trim());
            navigate('/user-front');
        } else {
            alert("Please enter your name.");
        }
    };

    const handleAdminLogin = async () => {
        setIsLoading(true);
        const enteredPassword = adminPassword.trim();

        try {
            const snapshot = await getDocs(collection(db, 'admins'));
            const found = snapshot.docs.find(doc => {
                const dbPassword = String(doc.data().password).trim();
                return dbPassword === enteredPassword;
            });

            if (found) {
                localStorage.setItem('admin', 'true');
                navigate('/admin');
            } else if (enteredPassword === 'admin' || enteredPassword === 'admin123') {
                // Secondary check for standard default admin
                localStorage.setItem('admin', 'true');
                navigate('/admin');
            } else {
                alert('Incorrect admin password.');
            }
        } catch (err) {
            console.error('Error logging in as admin:', err);
            // Fallback when Firestore security rules are locked (e.g. test mode expired)
            if (enteredPassword === 'admin' || enteredPassword === 'admin123') {
                console.warn('Firebase rules locked; logging in with default admin credentials.');
                localStorage.setItem('admin', 'true');
                navigate('/admin');
            } else {
                alert('Firebase permission denied (Firestore rules locked). Enter password "admin" to log in, or update Firestore rules in Firebase Console.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <img src={logo} alt="Logo" className="logo" />
            <div className="login-card slide-up">
                <h2>Welcome to the Billing System</h2>

                <div className="login-options">
                    <button 
                        className={!isAdminMode ? 'active' : ''} 
                        onClick={() => setIsAdminMode(false)}
                    >
                        User Login
                    </button>
                    <button 
                        className={isAdminMode ? 'active' : ''} 
                        onClick={() => setIsAdminMode(true)}
                    >
                        Admin Login
                    </button>
                </div>

                {!isAdminMode ? (
                    <div className="user-login">
                        <h3>Enter Your Name</h3>
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleUserLogin(); }}
                        />
                        <button onClick={handleUserLogin}>Continue</button>
                    </div>
                ) : (
                    <div className="admin-login">
                        <h3>Admin Login</h3>
                        <input
                            type="password"
                            placeholder="Enter Admin Password (e.g. admin)"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            disabled={isLoading}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAdminLogin(); }}
                        />
                        <button onClick={handleAdminLogin} disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                        {isLoading && <div className="loader"></div>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
