import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import {
    ShoppingCart, User, Search, Bell,
    Shirt, Monitor, Sofa, Activity, Sparkles, MoreHorizontal,
    Home, LayoutGrid, ShoppingBag, Contact, SlidersHorizontal,
    Heart, Package, CheckCircle, Upload, X, ShoppingBag as BagIcon,
    Zap, Award, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Category definitions ─────────────────────────────────── */
const CATEGORIES = [
    { name: 'All',         icon: <LayoutGrid size={22} /> },
    { name: 'Men',         icon: <Shirt size={22} /> },
    { name: 'Women',       icon: <Contact size={22} /> },
    { name: 'Beauty',      icon: <Sparkles size={22} /> },
    { name: 'Electronics', icon: <Monitor size={22} /> },
    { name: 'Sports',      icon: <Activity size={22} /> },
    { name: 'Home',        icon: <Sofa size={22} /> },
    { name: 'More',        icon: <MoreHorizontal size={22} /> },
];

/* ── Promo banners ────────────────────────────────────────── */
const PROMOS = [
    { tag: 'Summer Sale',   title: 'Up to 30% OFF',     sub: 'On all fashion items',        btn: 'Shop Now' },
    { tag: 'New Arrivals',  title: 'Fresh Styles',      sub: 'Discover the latest trends',  btn: 'Explore' },
    { tag: 'Electronics',   title: 'Best Gadgets',      sub: 'Top brands, great prices',    btn: 'View Deals' },
];

const Shop = () => {
    const { products, merchants, addOrder } = useAppContext();
    const navigate = useNavigate();

    /* ── State ──────────────────────────────────────────────── */
    const [customerName,       setCustomerName]       = useState('');
    const [quantity,           setQuantity]           = useState(1);
    const [senderNumber,       setSenderNumber]       = useState('');
    const [paymentScreenshot,  setPaymentScreenshot]  = useState('');
    const [selectedProduct,    setSelectedProduct]    = useState<any>(null);
    const [showBuyModal,       setShowBuyModal]       = useState(false);
    const [searchTerm,         setSearchTerm]         = useState('');
    const [activeTab,          setActiveTab]          = useState('Home');
    const [selectedCategory,   setSelectedCategory]   = useState('All');
    const [likedProducts,      setLikedProducts]      = useState<Set<string>>(new Set());
    const [promoIdx,           setPromoIdx]           = useState(0);
    const [orderSuccess,       setOrderSuccess]       = useState(false);

    const fileRef = useRef<HTMLInputElement>(null);

    /* ── Data ───────────────────────────────────────────────── */
    const approvedMerchantIds = merchants
        .filter(m => m.status === 'approved')
        .map(m => m.id);

    const availableProducts = products.filter(p =>
        approvedMerchantIds.includes(p.merchantId)
    );

    const filteredProducts = availableProducts.filter(p => {
        const matchSearch =
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.relatedKeywords?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchCat =
            selectedCategory === 'All' ||
            p.category?.toLowerCase() === selectedCategory.toLowerCase();

        return matchSearch && matchCat;
    });

    /* ── Handlers ───────────────────────────────────────────── */
    const handleBuyClick = (product: any) => {
        setSelectedProduct(product);
        setShowBuyModal(true);
        setQuantity(1);
        setCustomerName('');
        setSenderNumber('');
        setPaymentScreenshot('');
    };

    const closeBuyModal = () => {
        setShowBuyModal(false);
        setSelectedProduct(null);
    };

    const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPaymentScreenshot(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const toggleLike = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setLikedProducts(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const confirmPurchase = () => {
        if (!customerName.trim() || !senderNumber.trim()) {
            alert('Waa inaad gelisaa magacaaga iyo numberka lacagta laga soo dirayo.');
            return;
        }
        if (!paymentScreenshot) {
            alert('Waa inaad soo galisaa sawirka (Screenshot) caddeynta lacag-bixinta.');
            return;
        }
        if (quantity < 1) {
            alert('Fadlan dooro tirada ugu yaraan 1.');
            return;
        }

        const merchant = merchants.find(m => m.id === selectedProduct.merchantId);

        addOrder({
            id: Math.random().toString(36).substr(2, 9),
            productId:          selectedProduct.id,
            productName:        selectedProduct.name,
            price:              selectedProduct.price * quantity,
            merchantId:         selectedProduct.merchantId,
            merchantName:       merchant?.storeName || 'Unknown Store',
            customerName,
            quantity,
            senderNumber,
            paymentScreenshot,
            date:               new Date().toISOString(),
        });

        setShowBuyModal(false);
        setOrderSuccess(true);
        setTimeout(() => setOrderSuccess(false), 3000);
        setCustomerName(''); setQuantity(1);
        setSenderNumber(''); setPaymentScreenshot('');
        setSelectedProduct(null);
    };

    const handleCategoryClick = (name: string) => {
        setSelectedCategory(name);
        setSearchTerm('');
        setActiveTab('Home');
    };

    /* ── Sub-components ─────────────────────────────────────── */
    const ProductCard = ({ product, idx }: { product: any; idx: number }) => {
        const isLiked = likedProducts.has(product.id);
        return (
            <motion.div
                className="product-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.3 }}
            >
                {/* Image */}
                <div className="product-img-wrap">
                    {product.image
                        ? <img src={product.image} alt={product.name} />
                        : (
                            <div style={{
                                width: '100%', height: '100%',
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center',
                                gap: 6, color: 'var(--text-muted)'
                            }}>
                                <Package size={28} />
                                <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>No Image</span>
                            </div>
                        )
                    }
                    {/* Fav */}
                    <button
                        className={`product-fav-btn ${isLiked ? 'liked' : ''}`}
                        onClick={e => toggleLike(e, product.id)}
                    >
                        <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                    </button>
                </div>

                {/* Info */}
                <div className="product-info">
                    {product.category && (
                        <span className="product-cat">{product.category}</span>
                    )}
                    <h4 className="product-title">{product.name}</h4>
                    <div className="product-rating">
                        <span className="stars">★★★★★</span>
                        <span>4.5</span>
                    </div>
                    <div className="product-price-row">
                        <span className="product-price">${Number(product.price).toFixed(2)}</span>
                    </div>
                </div>

                {/* CTA */}
                <div className="product-footer">
                    <button className="buy-btn" onClick={() => handleBuyClick(product)}>
                        Iibso — Buy Now
                    </button>
                </div>
            </motion.div>
        );
    };

    const EmptyProducts = () => (
        <div className="empty-state">
            <div className="empty-icon">
                <ShoppingCart size={36} color="var(--text-muted)" />
            </div>
            <p className="empty-title">
                {searchTerm ? 'Natiijo la ma helin' : 'Hada alaab ma jirto'}
            </p>
            <p className="empty-subtitle">
                {searchTerm
                    ? `"${searchTerm}" waxa la raadiyay, wax la helay ma jiro.`
                    : 'Suuqa ayaa meesha ka bannaan. Dib u soo noqo markii dambe.'}
            </p>
            {searchTerm && (
                <button
                    className="btn btn-outline"
                    style={{ marginTop: 16, fontSize: '0.85rem', padding: '10px 20px' }}
                    onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                >
                    Nadiifi Raadinta
                </button>
            )}
        </div>
    );

    /* ── Render ─────────────────────────────────────────────── */
    return (
        <div className="mobile-app fade-in">

            {/* ── HEADER ──────────────────────────────────────── */}
            <header className="shop-header">
                <div className="shop-header-left">
                    <span className="shop-greeting">Ku Soo Dhawoow 👋</span>
                    <span className="shop-brand">WAA<span>HEEN</span></span>
                </div>
                <div className="shop-header-actions">
                    <button
                        className="header-icon-btn"
                        onClick={() => navigate('/login')}
                        title="Merchant Login"
                    >
                        <User size={18} />
                    </button>
                    <button className="header-icon-btn" title="Notifications">
                        <Bell size={18} />
                        <span className="badge" />
                    </button>
                </div>
            </header>

            {/* ── SEARCH ──────────────────────────────────────── */}
            <div className="search-wrap">
                <div className="search-box">
                    <Search size={17} />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Raadi alaabta aad doonaysid..."
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setActiveTab('Home'); }}
                    />
                    {searchTerm
                        ? (
                            <button
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
                                onClick={() => setSearchTerm('')}
                            >
                                <X size={16} />
                            </button>
                        ) : (
                            <button className="search-filter-btn" title="Filter">
                                <SlidersHorizontal size={14} />
                            </button>
                        )
                    }
                </div>
            </div>

            {/* ── SCROLLABLE CONTENT ──────────────────────────── */}
            <div className="mobile-content">

                {/* ── HOME TAB ──────────────────────────────────── */}
                {activeTab === 'Home' && (
                    <>
                        {/* Promo Banner */}
                        {!searchTerm && (
                            <div style={{ padding: '8px 20px 0' }}>
                                <motion.div
                                    className="promo-banner"
                                    key={promoIdx}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="promo-content">
                                        <span className="promo-tag">{PROMOS[promoIdx].tag}</span>
                                        <h2 className="promo-title">{PROMOS[promoIdx].title}</h2>
                                        <p className="promo-subtitle">{PROMOS[promoIdx].sub}</p>
                                        <button
                                            className="promo-btn"
                                            onClick={() => setPromoIdx((promoIdx + 1) % PROMOS.length)}
                                        >
                                            {PROMOS[promoIdx].btn}
                                        </button>
                                    </div>
                                    <div className="promo-image-bg" />
                                </motion.div>

                                {/* Banner dots */}
                                <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
                                    {PROMOS.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPromoIdx(i)}
                                            style={{
                                                width: i === promoIdx ? 18 : 6,
                                                height: 6,
                                                borderRadius: 999,
                                                background: i === promoIdx ? 'var(--primary)' : 'var(--bg-muted)',
                                                border: 'none',
                                                cursor: 'pointer',
                                                transition: 'all 0.25s ease',
                                                padding: 0,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Categories */}
                        {!searchTerm && (
                            <div style={{ paddingTop: 20 }}>
                                <div className="section-header" style={{ padding: '0 20px', marginBottom: 12 }}>
                                    <h3 className="section-title">Qaybaha</h3>
                                    <button className="see-all-btn">Dhamaan</button>
                                </div>
                                <div className="categories-scroll">
                                    {CATEGORIES.map((cat, i) => (
                                        <div
                                            key={i}
                                            className={`category-chip ${selectedCategory === cat.name ? 'active' : ''}`}
                                            onClick={() => handleCategoryClick(cat.name)}
                                        >
                                            <div className="category-icon-box">{cat.icon}</div>
                                            <span className="category-label">{cat.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stats chips */}
                        {!searchTerm && availableProducts.length > 0 && (
                            <div style={{ display: 'flex', gap: 10, padding: '16px 20px 4px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                                {[
                                    { icon: <TrendingUp size={13} />, label: `${availableProducts.length} Products` },
                                    { icon: <Award size={13} />,     label: 'Verified Stores' },
                                    { icon: <Zap size={13} />,       label: 'Fast Delivery' },
                                ].map((chip, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', gap: 5,
                                        background: 'var(--bg-white)', borderRadius: 999,
                                        padding: '5px 12px', flexShrink: 0,
                                        border: '1px solid var(--bg-muted)',
                                        fontSize: '0.72rem', fontWeight: 600,
                                        color: 'var(--text-secondary)',
                                        boxShadow: 'var(--shadow-xs)',
                                    }}>
                                        <span style={{ color: 'var(--primary)' }}>{chip.icon}</span>
                                        {chip.label}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Products */}
                        <div className="section-container" style={{ paddingBottom: 0 }}>
                            <div className="section-header">
                                <h3 className="section-title">
                                    {searchTerm
                                        ? `Natiijada: "${searchTerm}"`
                                        : selectedCategory !== 'All'
                                            ? selectedCategory
                                            : 'Dhammaan Alaabaha'}
                                </h3>
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                                    {filteredProducts.length} shay
                                </span>
                            </div>
                        </div>

                        {filteredProducts.length === 0
                            ? <EmptyProducts />
                            : (
                                <div className="products-grid">
                                    {filteredProducts.map((p, i) => (
                                        <ProductCard key={p.id} product={p} idx={i} />
                                    ))}
                                </div>
                            )
                        }
                    </>
                )}

                {/* ── CATEGORIES TAB ──────────────────────────── */}
                {activeTab === 'Categories' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ padding: '24px 20px' }}
                    >
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>
                            Dhamaan Qaybaha
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                            {CATEGORIES.filter(c => c.name !== 'All').map((cat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => { handleCategoryClick(cat.name); setActiveTab('Home'); }}
                                    style={{
                                        background: 'var(--bg-white)',
                                        borderRadius: 'var(--r-md)',
                                        padding: '20px 10px',
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', gap: 8,
                                        cursor: 'pointer',
                                        boxShadow: 'var(--shadow-sm)',
                                        border: '1px solid rgba(0,0,0,0.04)',
                                        transition: 'var(--t-base)',
                                    }}
                                >
                                    <div style={{
                                        width: 52, height: 52, borderRadius: 'var(--r-sm)',
                                        background: 'var(--bg-muted)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--primary)',
                                    }}>
                                        {cat.icon}
                                    </div>
                                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)', textAlign: 'center' }}>
                                        {cat.name}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ── CART TAB ────────────────────────────────── */}
                {activeTab === 'Cart' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="empty-state"
                    >
                        <div className="empty-icon">
                            <ShoppingCart size={36} color="var(--text-muted)" />
                        </div>
                        <p className="empty-title">Gaarigu Waa Madhan Yahay</p>
                        <p className="empty-subtitle">
                            Fadlan soo dooro alaabta aad doonaysid inaad iibsato oo ku dar gaarigaaga.
                        </p>
                        <button
                            className="btn btn-primary"
                            style={{ marginTop: 20, borderRadius: 'var(--r-full)', padding: '12px 28px' }}
                            onClick={() => setActiveTab('Home')}
                        >
                            Bilow Xididdiga
                        </button>
                    </motion.div>
                )}

                {/* ── ORDERS TAB ──────────────────────────────── */}
                {activeTab === 'Orders' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="empty-state"
                    >
                        <div className="empty-icon">
                            <ShoppingBag size={36} color="var(--text-muted)" />
                        </div>
                        <p className="empty-title">Ma Lihid Dalabaad Hore</p>
                        <p className="empty-subtitle">
                            Halkan waxaa kasoo muuqan doona dalabaadkaaga markaad wax iibsato.
                        </p>
                        <button
                            className="btn btn-outline"
                            style={{ marginTop: 20, borderRadius: 'var(--r-full)', padding: '12px 28px' }}
                            onClick={() => setActiveTab('Home')}
                        >
                            Dib Ugu Noqo Suuqa
                        </button>
                    </motion.div>
                )}

                {/* ── PROFILE TAB ─────────────────────────────── */}
                {activeTab === 'Account' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ padding: '24px 20px' }}
                    >
                        {/* Profile header */}
                        <div style={{
                            background: 'var(--primary)',
                            borderRadius: 'var(--r-lg)',
                            padding: '24px 20px',
                            marginBottom: 16,
                            display: 'flex', alignItems: 'center', gap: 16,
                        }}>
                            <div style={{
                                width: 56, height: 56,
                                borderRadius: 'var(--r-full)',
                                background: 'rgba(255,255,255,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white',
                            }}>
                                <User size={28} />
                            </div>
                            <div>
                                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>
                                    Marti Ku Soo Dhaw
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>
                                    Waa inaad gasho si aad u heshid faa'iidooyinka oo dhan
                                </div>
                            </div>
                        </div>

                        {/* Menu items */}
                        {[
                            { icon: <ShoppingBag size={18} />, label: 'Dalabaadkeyga',    sub: 'Raadso dalabaadkaaga' },
                            { icon: <Heart size={18} />,       label: 'Jecelkaygii',       sub: 'Alaabta aad jeceshahay' },
                            { icon: <Bell size={18} />,        label: 'Ogeysiisyada',       sub: 'Ogeysiisyada cusub' },
                            { icon: <User size={18} />,        label: 'Gal / Diiwaangeli', sub: 'Meheradaha iyo Admin', action: () => navigate('/login') },
                        ].map((item, i) => (
                            <div
                                key={i}
                                onClick={item.action}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 14,
                                    background: 'var(--bg-white)',
                                    borderRadius: 'var(--r-md)',
                                    padding: '14px 16px',
                                    marginBottom: 10,
                                    cursor: item.action ? 'pointer' : 'default',
                                    boxShadow: 'var(--shadow-xs)',
                                    border: '1px solid rgba(0,0,0,0.04)',
                                    transition: 'var(--t-fast)',
                                }}
                            >
                                <div style={{
                                    width: 40, height: 40,
                                    borderRadius: 'var(--r-sm)',
                                    background: 'var(--bg-muted)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--primary)', flexShrink: 0,
                                }}>
                                    {item.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>
                                        {item.label}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 1 }}>
                                        {item.sub}
                                    </div>
                                </div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>›</span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* ── BOTTOM NAVIGATION ───────────────────────────── */}
            <nav className="bottom-nav">
                {[
                    { name: 'Home',       icon: <Home size={20} /> },
                    { name: 'Categories', icon: <LayoutGrid size={20} /> },
                    { name: 'Cart',       icon: <ShoppingCart size={20} /> },
                    { name: 'Orders',     icon: <BagIcon size={20} /> },
                    { name: 'Account',    icon: <User size={20} /> },
                ].map((tab) => (
                    <div
                        key={tab.name}
                        className={`nav-tab ${activeTab === tab.name ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.name)}
                    >
                        <div className="nav-icon">{tab.icon}</div>
                        <span className="nav-label">{tab.name}</span>
                    </div>
                ))}
            </nav>

            {/* ── ORDER SUCCESS TOAST ─────────────────────────── */}
            <AnimatePresence>
                {orderSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        style={{
                            position: 'fixed', bottom: 90, left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'var(--success)',
                            color: 'white',
                            borderRadius: 'var(--r-full)',
                            padding: '12px 24px',
                            display: 'flex', alignItems: 'center', gap: 8,
                            zIndex: 2000,
                            boxShadow: '0 8px 24px rgba(34,197,94,0.35)',
                            fontWeight: 600, fontSize: '0.88rem',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        <CheckCircle size={16} />
                        Dalabadda waa la qaatay!
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── BUY MODAL (Bottom Sheet) ─────────────────────── */}
            <AnimatePresence>
                {showBuyModal && selectedProduct && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeBuyModal}
                    >
                        <motion.div
                            className="modal-sheet"
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Handle */}
                            <div className="modal-handle" />

                            {/* Product Preview */}
                            <div className="modal-product-preview">
                                {selectedProduct.image
                                    ? <img className="modal-product-img" src={selectedProduct.image} alt={selectedProduct.name} />
                                    : (
                                        <div className="modal-product-img-placeholder">
                                            <Package size={22} />
                                        </div>
                                    )
                                }
                                <div>
                                    <div className="modal-product-name">{selectedProduct.name}</div>
                                    {selectedProduct.category && (
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                                            {selectedProduct.category}
                                        </div>
                                    )}
                                    <div className="modal-product-price">
                                        ${(selectedProduct.price * quantity).toFixed(2)}
                                    </div>
                                </div>
                                <button
                                    onClick={closeBuyModal}
                                    style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Form */}
                            <div className="modal-body">
                                <p className="modal-heading">Faahfaahinta Dalabka</p>

                                {/* Name */}
                                <div className="input-group">
                                    <label className="input-label">
                                        <User size={13} /> Magacaaga
                                    </label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Tusaale: Axmed Cali..."
                                        value={customerName}
                                        onChange={e => setCustomerName(e.target.value)}
                                        autoFocus
                                    />
                                </div>

                                {/* Quantity */}
                                <div className="input-group">
                                    <label className="input-label">
                                        <Package size={13} /> Tirada (Qty)
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <button
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            style={{
                                                width: 38, height: 38, borderRadius: 'var(--r-sm)',
                                                background: 'var(--bg-muted)', border: 'none',
                                                fontSize: '1.2rem', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 700, color: 'var(--primary)',
                                            }}
                                        >−</button>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 700, minWidth: 28, textAlign: 'center' }}>
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(q => q + 1)}
                                            style={{
                                                width: 38, height: 38, borderRadius: 'var(--r-sm)',
                                                background: 'var(--primary)', border: 'none',
                                                fontSize: '1.2rem', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 700, color: 'white',
                                            }}
                                        >+</button>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            × ${selectedProduct.price} = <strong style={{ color: 'var(--primary)' }}>${(selectedProduct.price * quantity).toFixed(2)}</strong>
                                        </span>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="input-group">
                                    <label className="input-label">
                                        📱 Numberka Lacagta Laga Soo Dirayo
                                    </label>
                                    <input
                                        type="tel"
                                        className="input-field"
                                        placeholder="Tusaale: 063XXXXXXX..."
                                        value={senderNumber}
                                        onChange={e => setSenderNumber(e.target.value)}
                                    />
                                </div>

                                {/* Screenshot */}
                                <div className="input-group">
                                    <label className="input-label">
                                        📸 Sawirka Lacag Bixinta (Screenshot)
                                    </label>
                                    <input
                                        ref={fileRef}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleScreenshotUpload}
                                    />
                                    {paymentScreenshot
                                        ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <div className="screenshot-preview">
                                                    <img src={paymentScreenshot} alt="receipt" />
                                                </div>
                                                <button
                                                    className="btn btn-outline"
                                                    style={{ fontSize: '0.8rem', padding: '8px 14px' }}
                                                    onClick={() => fileRef.current?.click()}
                                                >
                                                    Bedel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => fileRef.current?.click()}
                                                style={{
                                                    width: '100%',
                                                    padding: '16px',
                                                    border: '2px dashed #CBD5E1',
                                                    borderRadius: 'var(--r-sm)',
                                                    background: 'var(--bg-muted)',
                                                    cursor: 'pointer',
                                                    display: 'flex', flexDirection: 'column',
                                                    alignItems: 'center', gap: 8,
                                                    color: 'var(--text-muted)',
                                                    transition: 'var(--t-fast)',
                                                }}
                                            >
                                                <Upload size={22} />
                                                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                                                    Taabo si aad u soo galisid sawirka
                                                </span>
                                                <span style={{ fontSize: '0.72rem' }}>PNG, JPG, JPEG</span>
                                            </button>
                                        )
                                    }
                                </div>

                                {/* Order Summary */}
                                <div style={{
                                    background: 'var(--bg-muted)',
                                    borderRadius: 'var(--r-sm)',
                                    padding: '14px 16px',
                                    marginBottom: 20,
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>Shayga:</span>
                                        <span style={{ fontWeight: 600 }}>{selectedProduct.name} × {quantity}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>Qiimaha midkood:</span>
                                        <span>${selectedProduct.price}</span>
                                    </div>
                                    <div style={{ height: 1, background: '#E2E8F0', margin: '8px 0' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800 }}>
                                        <span style={{ color: 'var(--text)' }}>Wadarta:</span>
                                        <span style={{ color: 'var(--primary)' }}>${(selectedProduct.price * quantity).toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button
                                        className="btn btn-outline"
                                        style={{ flex: '0 0 auto', padding: '13px 18px' }}
                                        onClick={closeBuyModal}
                                    >
                                        Jooji
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        style={{ flex: 1, borderRadius: 'var(--r-sm)', fontSize: '0.95rem' }}
                                        onClick={confirmPurchase}
                                    >
                                        ✓ Xaqiiji Dalabka
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Shop;
