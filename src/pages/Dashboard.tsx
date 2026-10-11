import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LayoutDashboard, Package, LogOut, MapPin, Smartphone, CreditCard, PlusCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { currentMerchant, logout, products, isAdmin, setCurrentMerchant } = useAppContext();
    const navigate = useNavigate();

    if (!currentMerchant) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleBackToAdmin = () => {
        setCurrentMerchant(null);
        navigate('/admin');
    };

    const merchantProducts = products.filter(p => p.merchantId === currentMerchant.id);

    return (
        <div className="fade-in">
            <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px' }}>
                {isAdmin ? (
                    <button onClick={handleBackToAdmin} className="icon-btn" style={{ color: 'var(--white)', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px', padding: '8px', marginRight: '10px' }}>
                        <ArrowLeft size={20} />
                    </button>
                ) : null}
                <h1 style={{ fontSize: '1.2rem', flex: 1 }}>Waaheen Market {isAdmin && <span style={{ fontSize: '0.7rem', opacity: 0.7, background: 'var(--accent)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>ADMIN</span>}</h1>
                {!isAdmin && (
                    <button onClick={handleLogout} className="icon-btn" style={{ color: '#dc3545', background: 'rgba(220, 53, 69, 0.1)', borderRadius: '8px', padding: '8px' }}>
                        <LogOut size={20} />
                    </button>
                )}
            </header>

            <div style={{ padding: '20px' }}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="card"
                    style={{ background: 'var(--primary)', color: 'var(--white)', position: 'relative', overflow: 'hidden' }}
                >
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontSize: '1.4rem', marginBottom: '5px' }}>{currentMerchant.storeName}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', opacity: 0.8 }}>
                            <MapPin size={12} /> {currentMerchant.location} • {currentMerchant.category}
                        </div>

                        <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px' }}>
                                <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>ZAAD</div>
                                <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <Smartphone size={14} /> {currentMerchant.zaadNumber}
                                </div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px' }}>
                                <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>E-DAHAB</div>
                                <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <CreditCard size={14} /> {currentMerchant.eDahabNumber}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1 }}>
                        <LayoutDashboard size={120} />
                    </div>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <Package size={32} color="var(--primary)" style={{ marginBottom: '10px' }} />
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{merchantProducts.length}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Products Listed</div>
                    </div>

                    <button
                        onClick={() => navigate('/products')}
                        className="btn btn-accent"
                        style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}
                    >
                        <PlusCircle size={32} />
                        <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>Add Product</div>
                    </button>
                </div>

                <h3 style={{ marginBottom: '15px', fontSize: '1.1rem', color: 'var(--primary)' }}>Recent Products</h3>
                {merchantProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                        No products added yet. Start by adding your first product!
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        {merchantProducts.slice(0, 4).map(product => (
                            <div key={product.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                                <div style={{ height: '100px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <Package size={24} color="#ccc" />
                                    )}
                                </div>
                                <div style={{ padding: '10px' }}>
                                    <div style={{ fontWeight: '600', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>
                                    <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.85rem' }}>${product.price}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {merchantProducts.length > 4 && (
                    <button
                        onClick={() => navigate('/products')}
                        className="btn btn-outline"
                        style={{ width: '100%', marginTop: '15px' }}
                    >
                        View All Products
                    </button>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
