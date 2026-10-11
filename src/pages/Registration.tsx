import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LOCATIONS } from '../utils/constants';
import type { Merchant } from '../utils/constants';
import { Store, User, MapPin, Tag, Smartphone, CreditCard, Lock, UserCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Registration = () => {
    const { registerMerchant, categories: CATEGORIES } = useAppContext();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        storeName: '',
        ownerName: '',
        location: LOCATIONS[0],
        category: CATEGORIES[0],
        zaadNumber: '',
        eDahabNumber: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newMerchant: Merchant = {
            ...formData,
            id: Math.random().toString(36).substr(2, 9),
            registrationDate: new Date().toISOString(),
            status: 'pending'
        };
        registerMerchant(newMerchant);
        setIsSubmitted(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (isSubmitted) {
        return (
            <div className="fade-in">
                <header className="header">
                    <h1>Waaheen Market</h1>
                </header>
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ marginBottom: '20px' }}>
                        <CheckCircle size={64} color="#28a745" style={{ margin: '0 auto' }} />
                    </motion.div>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '15px' }}>Registration Submitted</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '30px', lineHeight: '1.5' }}>Your store has been registered and is pending admin approval.<br />You will be able to log in once your application is reviewed.</p>
                    <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ padding: '12px 30px' }}>Return to Login</button>
                </div>
            </div>
        );
    }

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

            <div style={{ padding: '30px 20px' }}>
                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Register Your Business</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join the largest marketplace in Somaliland.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Account Credentials */}
                    <div className="card" style={{ border: '2px solid var(--accent)' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '15px' }}>🔐 Account Credentials</h3>
                        <div className="input-group">
                            <label className="input-label">
                                <UserCircle size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                className="input-field"
                                placeholder="Choose a username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                minLength={3}
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">
                                <Lock size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                className="input-field"
                                placeholder="Choose a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={4}
                            />
                        </div>
                    </div>

                    {/* Store Info */}
                    <div className="card">
                        <div className="input-group">
                            <label className="input-label">
                                <Store size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                                Store Name
                            </label>
                            <input
                                type="text"
                                name="storeName"
                                className="input-field"
                                placeholder="Enter store name"
                                value={formData.storeName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">
                                <User size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                                Owner Name
                            </label>
                            <input
                                type="text"
                                name="ownerName"
                                className="input-field"
                                placeholder="Manager/Owner name"
                                value={formData.ownerName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">
                                <MapPin size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                                Location
                            </label>
                            <select
                                name="location"
                                className="input-field"
                                value={formData.location}
                                onChange={handleChange}
                            >
                                {LOCATIONS.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">
                                <Tag size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                                Category
                            </label>
                            <select
                                name="category"
                                className="input-field"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                {CATEGORIES.map((cat: string) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="card">
                        <h3 style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '15px' }}>Payment Integration</h3>
                        <div className="input-group">
                            <label className="input-label">
                                <Smartphone size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                                ZAAD Number
                            </label>
                            <input
                                type="text"
                                name="zaadNumber"
                                className="input-field"
                                placeholder="e.g. 063XXXXXXX"
                                value={formData.zaadNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">
                                <CreditCard size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                                E-DAHAB Number
                            </label>
                            <input
                                type="text"
                                name="eDahabNumber"
                                className="input-field"
                                placeholder="e.g. 065XXXXXXX"
                                value={formData.eDahabNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px' }}>
                        Register Store
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
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
                            Login here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Registration;
