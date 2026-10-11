import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LogOut, Store, Package, MapPin, Tag, Users, ShoppingBag, LayoutGrid, Check, X, ShoppingCart, Clock, ArrowLeft, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const { merchants, products, orders, logout, updateMerchantStatus, deleteMerchant, deleteProduct, deleteOrder, setCurrentMerchant, categories: allCategories, deleteCategory, addCategory } = useAppContext();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'stores' | 'products' | 'categories' | 'orders'>('overview');
    const [newCategory, setNewCategory] = useState('');
    const [reportStoreId, setReportStoreId] = useState<string | null>(null);
    const [reportMonth, setReportMonth] = useState<string>('all');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const pendingMerchants = merchants.filter(m => m.status === 'pending');
    const approvedMerchants = merchants.filter(m => m.status !== 'pending' && m.status !== 'rejected');

    // Group merchants by category
    const merchantsByCategory: Record<string, typeof merchants> = {};
    approvedMerchants.forEach(m => {
        if (!merchantsByCategory[m.category]) {
            merchantsByCategory[m.category] = [];
        }
        merchantsByCategory[m.category].push(m);
    });

    const categories = Object.keys(merchantsByCategory);

    return (
        <div className="fade-in">
            <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px' }}>
                <div>
                    <h1 style={{ fontSize: '1.2rem' }}>Waaheen Market</h1>
                    <span style={{ fontSize: '0.7rem', opacity: 0.7, background: 'var(--accent)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>ADMIN</span>
                </div>
                <button onClick={handleLogout} className="icon-btn" style={{ color: '#dc3545', background: 'rgba(220, 53, 69, 0.1)', borderRadius: '8px', padding: '8px' }}>
                    <LogOut size={20} />
                </button>
            </header>

            <div style={{ padding: '20px' }}>
                {/* Summary Cards */}
                {activeTab === 'overview' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '25px' }}>
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="card"
                            style={{ textAlign: 'center', padding: '15px 10px', cursor: 'pointer' }}
                            onClick={() => setActiveTab('stores')}
                        >
                            <Store size={24} color="var(--primary)" style={{ marginBottom: '6px' }} />
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{approvedMerchants.length}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Stores</div>
                        </motion.div>
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="card"
                            style={{ textAlign: 'center', padding: '15px 10px', cursor: 'pointer' }}
                            onClick={() => setActiveTab('products')}
                        >
                            <ShoppingBag size={24} color="var(--accent)" style={{ marginBottom: '6px' }} />
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{products.length}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Products</div>
                        </motion.div>
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="card"
                            style={{ textAlign: 'center', padding: '15px 10px', cursor: 'pointer' }}
                            onClick={() => setActiveTab('categories')}
                        >
                            <LayoutGrid size={24} color="#28a745" style={{ marginBottom: '6px' }} />
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{categories.length}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Categories</div>
                        </motion.div>
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="card"
                            style={{ textAlign: 'center', padding: '15px 10px', cursor: 'pointer' }}
                            onClick={() => setActiveTab('orders')}
                        >
                            <ShoppingCart size={24} color="#17a2b8" style={{ marginBottom: '6px' }} />
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{orders.length}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Orders</div>
                        </motion.div>
                    </div>
                )}

                {/* Recent Purchases */}
                {activeTab === 'overview' && orders.length > 0 && (
                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShoppingCart size={18} /> Iibsiyadii Udanbeeyay (Recent Orders)
                        </h3>
                        {orders.slice(0, 20).map((order, idx) => {
                            const commission = (order.price * 0.02).toFixed(2);
                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="card"
                                    style={{ padding: '14px', marginBottom: '10px', borderLeft: '4px solid #17a2b8' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--primary)' }}>
                                                {order.productName}
                                                <span style={{ fontSize: '0.8rem', background: 'var(--accent)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px' }}>
                                                    x{order.quantity || 1}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                                                <Store size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                                {order.merchantName}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                <Users size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{order.customerName}</span> - {order.senderNumber}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#28a745' }}>${order.price}</span>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', marginTop: '2px', background: 'rgba(23, 162, 184, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                                                Macaash (2%): ${commission}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                                <Clock size={10} style={{ verticalAlign: 'middle', marginRight: '2px' }} />
                                                {new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                    {order.paymentScreenshot && (
                                        <div style={{ marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Caddeynta Lacagta (Screenshot):</div>
                                            <a href={order.paymentScreenshot} target="_blank" rel="noreferrer">
                                                <img src={order.paymentScreenshot} alt="Payment Receipt" style={{ width: '80px', height: '120px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ddd' }} />
                                            </a>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Pending Approvals */}
                {activeTab === 'overview' && pendingMerchants.length > 0 && (
                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Store size={18} /> Pending Approvals ({pendingMerchants.length})
                        </h3>
                        {pendingMerchants.map((merchant, idx) => (
                            <motion.div
                                key={merchant.id}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="card"
                                style={{ padding: '14px', marginBottom: '10px', borderLeft: '4px solid #ffc107' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--primary)' }}>
                                            {merchant.storeName}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                                            <Users size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                            {merchant.ownerName} • {merchant.location}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => updateMerchantStatus(merchant.id, 'approved')}
                                            className="btn"
                                            style={{ background: '#28a745', color: 'white', padding: '8px 12px', fontSize: '0.85rem' }}
                                        >
                                            <Check size={16} /> Approve
                                        </button>
                                        <button
                                            onClick={() => updateMerchantStatus(merchant.id, 'rejected')}
                                            className="btn"
                                            style={{ background: '#dc3545', color: 'white', padding: '8px 12px', fontSize: '0.85rem' }}
                                        >
                                            <X size={16} /> Deny
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Merchants by Category */}
                {activeTab === 'overview' && (approvedMerchants.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                        <Users size={48} color="#ccc" style={{ marginBottom: '15px' }} />
                        <p>Wali ma jiro meherad diwaan gashan.</p>
                    </div>
                ) : (
                    categories.map(category => (
                        <div key={category} style={{ marginBottom: '25px' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '12px',
                                padding: '8px 12px',
                                background: 'var(--primary)',
                                borderRadius: '8px',
                                color: 'var(--white)'
                            }}>
                                <Tag size={16} />
                                <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{category}</span>
                                <span style={{
                                    marginLeft: 'auto',
                                    background: 'var(--accent)',
                                    color: 'var(--primary)',
                                    padding: '2px 10px',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    fontSize: '0.8rem'
                                }}>
                                    {merchantsByCategory[category].length}
                                </span>
                            </div>

                            {merchantsByCategory[category].map((merchant, idx) => (
                                <motion.div
                                    key={merchant.id}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="card"
                                    style={{ padding: '14px', marginBottom: '10px' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--primary)' }}>
                                                {merchant.storeName}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                                                <Users size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                                {merchant.ownerName}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                                                <MapPin size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                                {merchant.location}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                fontSize: '0.8rem',
                                                color: 'var(--primary)',
                                                fontWeight: '600'
                                            }}>
                                                <Package size={14} />
                                                {products.filter(p => p.merchantId === merchant.id).length} products
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '5px', marginBottom: '8px' }}>
                                                {new Date(merchant.registrationDate).toLocaleDateString()}
                                            </div>
                                            <button
                                                className="btn btn-outline"
                                                style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                                                onClick={() => {
                                                    setCurrentMerchant(merchant);
                                                    navigate('/products');
                                                }}
                                            >
                                                Manage Products
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ))
                ))}

                {activeTab === 'categories' && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
                            <button onClick={() => setActiveTab('overview')} className="icon-btn" style={{ padding: '8px' }}><ArrowLeft size={20} /></button>
                            <h2 style={{ fontSize: '1.2rem', color: 'var(--primary)', margin: 0 }}>Manage Categories</h2>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <input 
                                type="text" 
                                className="input-field" 
                                placeholder="New category name" 
                                value={newCategory} 
                                onChange={(e) => setNewCategory(e.target.value)}
                            />
                            <button 
                                className="btn btn-primary"
                                onClick={() => { if(newCategory.trim()){ addCategory(newCategory.trim()); setNewCategory(''); } }}
                            >
                                Add
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {allCategories.map(cat => (
                                <div key={cat} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px' }}>
                                    <span style={{ fontWeight: '600' }}>{cat}</span>
                                    <button 
                                        className="btn" 
                                        style={{ padding: '6px', color: '#dc3545', background: 'rgba(220, 53, 69, 0.1)' }}
                                        onClick={() => { if(window.confirm(`Delete category ${cat}?`)) deleteCategory(cat); }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'stores' && (
                    <div>
                        {reportStoreId ? (
                            (() => {
                                const merchant = merchants.find(m => m.id === reportStoreId);
                                const storeOrders = orders.filter(o => o.merchantId === reportStoreId);
                                const uniqueMonths = Array.from(new Set(storeOrders.map(o => o.date.substring(0, 7)))).sort().reverse();
                                const filteredOrders = reportMonth === 'all' ? storeOrders : storeOrders.filter(o => o.date.startsWith(reportMonth));
                                const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.price, 0);
                                const totalCommission = totalRevenue * 0.02;

                                return (
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
                                            <button onClick={() => { setReportStoreId(null); setReportMonth('all'); }} className="icon-btn" style={{ padding: '8px' }}><ArrowLeft size={20} /></button>
                                            <h2 style={{ fontSize: '1.2rem', color: 'var(--primary)', margin: 0 }}>Report: {merchant?.storeName}</h2>
                                        </div>

                                        <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                                <h3 style={{ margin: 0, color: 'var(--primary)' }}>Lacagta & Macaashka</h3>
                                                <select 
                                                    className="input-field" 
                                                    style={{ width: 'auto', padding: '6px 12px' }}
                                                    value={reportMonth}
                                                    onChange={e => setReportMonth(e.target.value)}
                                                >
                                                    <option value="all">Waqtiga oo dhan</option>
                                                    {uniqueMonths.map(month => (
                                                        <option key={month} value={month}>{month}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Lacagta Soo Xarootay (Revenue)</div>
                                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>${totalRevenue.toFixed(2)}</div>
                                                </div>
                                                <div style={{ background: 'rgba(23, 162, 184, 0.1)', padding: '15px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(23, 162, 184, 0.3)' }}>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Macaashka Admin (2%)</div>
                                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#17a2b8' }}>${totalCommission.toFixed(2)}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <h3 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Dalabaadka (Orders)</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {filteredOrders.length === 0 ? (
                                                <p style={{ color: 'var(--text-muted)' }}>Wax dalabaad ah ma jiraan.</p>
                                            ) : (
                                                filteredOrders.map(order => (
                                                    <div key={order.id} className="card" style={{ padding: '12px' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <div>
                                                                <div style={{ fontWeight: 'bold' }}>{order.productName} <span style={{ fontSize: '0.8rem', background: 'var(--accent)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px' }}>x{order.quantity || 1}</span></div>
                                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.customerName} - {order.senderNumber}</div>
                                                            </div>
                                                            <div style={{ textAlign: 'right' }}>
                                                                <div style={{ fontWeight: 'bold', color: '#28a745' }}>${order.price.toFixed(2)}</div>
                                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(order.date).toLocaleDateString()}</div>
                                                            </div>
                                                        </div>
                                                        {order.paymentScreenshot && (
                                                            <div style={{ marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Screenshot:</div>
                                                                <a href={order.paymentScreenshot} target="_blank" rel="noreferrer">
                                                                    <img src={order.paymentScreenshot} alt="Payment Receipt" style={{ width: '60px', height: '90px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                );
                            })()
                        ) : (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
                                    <button onClick={() => setActiveTab('overview')} className="icon-btn" style={{ padding: '8px' }}><ArrowLeft size={20} /></button>
                                    <h2 style={{ fontSize: '1.2rem', color: 'var(--primary)', margin: 0 }}>Manage Stores</h2>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {merchants.map(merchant => (
                                        <div key={merchant.id} className="card" style={{ padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>{merchant.storeName}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{merchant.ownerName} • {merchant.location}</div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setReportStoreId(merchant.id)}>Report</button>
                                                <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => { setCurrentMerchant(merchant); navigate('/products'); }}>Manage</button>
                                                <button className="btn" style={{ padding: '6px', color: '#dc3545', background: 'rgba(220, 53, 69, 0.1)' }} onClick={() => { if(window.confirm(`Delete store ${merchant.storeName}?`)) deleteMerchant(merchant.id); }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'products' && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
                            <button onClick={() => setActiveTab('overview')} className="icon-btn" style={{ padding: '8px' }}><ArrowLeft size={20} /></button>
                            <h2 style={{ fontSize: '1.2rem', color: 'var(--primary)', margin: 0 }}>Manage All Products</h2>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {products.map(product => {
                                const merchant = merchants.find(m => m.id === product.merchantId);
                                return (
                                    <div key={product.id} className="card" style={{ padding: '14px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', background: '#eee' }}>
                                            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold' }}>{product.name}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{product.category} • ${product.price}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Store: {merchant?.storeName || 'Unknown'}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => { setCurrentMerchant(merchant || null); navigate('/products'); }}>Edit in Store</button>
                                            <button className="btn" style={{ padding: '6px', color: '#dc3545', background: 'rgba(220, 53, 69, 0.1)' }} onClick={() => { if(window.confirm(`Delete product ${product.name}?`)) deleteProduct(product.id); }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
                            <button onClick={() => setActiveTab('overview')} className="icon-btn" style={{ padding: '8px' }}><ArrowLeft size={20} /></button>
                            <h2 style={{ fontSize: '1.2rem', color: 'var(--primary)', margin: 0 }}>Manage All Orders</h2>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {orders.map(order => {
                                const commission = (order.price * 0.02).toFixed(2);
                                return (
                                    <div key={order.id} className="card" style={{ padding: '14px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>{order.productName} <span style={{ fontSize: '0.8rem', background: 'var(--accent)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px' }}>x{order.quantity || 1}</span></div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{order.customerName} - {order.senderNumber}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Store: {order.merchantName}</div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontWeight: 'bold', color: '#28a745' }}>${order.price}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold', marginTop: '2px', background: 'rgba(23, 162, 184, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                                                        Macaash (2%): ${commission}
                                                    </div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(order.date).toLocaleDateString()}</div>
                                                </div>
                                                <button className="btn" style={{ padding: '6px', color: '#dc3545', background: 'rgba(220, 53, 69, 0.1)' }} onClick={() => { if(window.confirm(`Delete order?`)) deleteOrder(order.id); }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        {order.paymentScreenshot && (
                                            <div style={{ marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Screenshot:</div>
                                                <a href={order.paymentScreenshot} target="_blank" rel="noreferrer">
                                                    <img src={order.paymentScreenshot} alt="Payment Receipt" style={{ width: '60px', height: '90px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;
