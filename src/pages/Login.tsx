import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Lock, UserCircle, LogIn, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const { loginMerchant, setIsAdmin } = useAppContext();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Admin login
        if (username.trim().toLowerCase() === 'admin' && password.trim() === '4015') {
            setIsAdmin(true);
            navigate('/admin');
            return;
        }

        // Merchant login
        const result = loginMerchant(username, password);
        if (result.success && result.data) {
            const merchant = result.data;
            if (merchant.status === 'pending') {
                setError('Your account is pending admin approval.');
            } else if (merchant.status === 'rejected') {
                setError('Your account registration was declined.');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError(result.error || 'Username ama password kaa khalad. Fadlan isku day mar kale.');
        }
    };

    return (
        <div className="fade-in">
            <header className="header">
                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    Waaheen Market
                </motion.h1>
                <p style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '5px' }}>Multi-Vendor Marketplace</p>
            </header>

            <div style={{ padding: '40px 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 15px'
                        }}
                    >
                        <LogIn size={36} color="var(--accent)" />
                    </motion.div>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '5px' }}>Ku Soo Dhawoow</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Gal account-kaaga si aad u maamusho alaabta.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="card">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '12px 15px',
                                    borderRadius: '10px',
                                    background: 'rgba(255, 0, 0, 0.08)',
                                    border: '1px solid rgba(255, 0, 0, 0.2)',
                                    color: '#cc0000',
                                    fontSize: '0.85rem',
                                    marginBottom: '20px'
                                }}
                            >
                                <AlertCircle size={18} />
                                {error}
                            </motion.div>
                        )}

                        <div className="input-group">
                            <label className="input-label">
                                <UserCircle size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                                Username
                            </label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Gali username-kaaga"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">
                                <Lock size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                                Password
                            </label>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="Gali password-kaaga"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px' }}>
                            <LogIn size={18} /> Login
                        </button>
                    </div>
                </form>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Account ma lihid?{' '}
                        <button
                            onClick={() => navigate('/registration')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--primary)',
                                fontWeight: '700',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                fontSize: '0.9rem'
                            }}
                        >
                            Register here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
