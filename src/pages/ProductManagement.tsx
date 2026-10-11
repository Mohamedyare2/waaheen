import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { type Product } from '../utils/constants';
import { ArrowLeft, Package, Plus, Trash2, Edit2, DollarSign, Image as ImageIcon, Camera, Upload, X, LogOut, AlignLeft, Tag, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductManagement = () => {
    const { currentMerchant, products, addProduct, updateProduct, deleteProduct, logout, isAdmin, categories: CATEGORIES } = useAppContext();
    const navigate = useNavigate();
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showRelated, setShowRelated] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image: '',
        category: currentMerchant?.category || CATEGORIES[0],
        description: '',
        relatedKeywords: ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    if (!currentMerchant) return null;

    const merchantProducts = products.filter(p => p.merchantId === currentMerchant.id);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Resize image to reduce localStorage size
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new window.Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_SIZE = 400;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_SIZE) {
                        height = Math.round((height * MAX_SIZE) / width);
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width = Math.round((width * MAX_SIZE) / height);
                        height = MAX_SIZE;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                setFormData(prev => ({ ...prev, image: dataUrl }));
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);

        // Reset input so the same file can be re-selected
        e.target.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentMerchant) return;
        
        if (editingProduct) {
            updateProduct({
                ...editingProduct,
                name: formData.name,
                price: parseFloat(formData.price),
                image: formData.image || editingProduct.image,
                category: formData.category,
                description: formData.description,
                relatedKeywords: formData.relatedKeywords
            });
            setEditingProduct(null);
        } else {
            const newProduct: Product = {
                id: Math.random().toString(36).substr(2, 9),
                merchantId: currentMerchant.id,
                name: formData.name,
                price: parseFloat(formData.price),
                image: formData.image || 'https://via.placeholder.com/150',
                category: formData.category,
                description: formData.description,
                relatedKeywords: formData.relatedKeywords
            };
            addProduct(newProduct);
        }
        
        setFormData({ name: '', price: '', image: '', category: currentMerchant.category || CATEGORIES[0], description: '', relatedKeywords: '' });
        setShowRelated(false);
        setShowAddForm(false);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price.toString(),
            image: product.image,
            category: product.category,
            description: product.description || '',
            relatedKeywords: product.relatedKeywords || ''
        });
        setShowRelated(!!product.relatedKeywords);
        setShowAddForm(true);
    };

    const cancelEdit = () => {
        setEditingProduct(null);
        setFormData({ name: '', price: '', image: '', category: currentMerchant.category || CATEGORIES[0], description: '', relatedKeywords: '' });
        setShowRelated(false);
        setShowAddForm(false);
    };

    return (
        <div className="fade-in">
            <header className="header" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={() => navigate('/dashboard')} className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--white)', padding: '8px' }}>
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ fontSize: '1.2rem', flex: 1 }}>Manage Products {isAdmin && <span style={{ fontSize: '0.7rem', opacity: 0.7, background: 'var(--accent)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>ADMIN</span>}</h1>
                {!isAdmin && (
                    <button onClick={() => { logout(); navigate('/login'); }} className="icon-btn" style={{ color: '#dc3545', background: 'rgba(220, 53, 69, 0.1)', borderRadius: '8px', padding: '8px' }}>
                        <LogOut size={20} />
                    </button>
                )}
            </header>

            <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>Your Listings</h2>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="btn btn-accent"
                        style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                    >
                        <Plus size={18} /> New Product
                    </button>
                </div>

                <AnimatePresence>
                    {showAddForm && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden' }}
                        >
                            <form onSubmit={handleSubmit} className="card" style={{ border: '2px solid var(--accent)' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '15px', color: 'var(--primary)' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>

                                <div className="input-group">
                                    <label className="input-label"><Package size={14} /> Product Name</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label"><DollarSign size={14} /> Price (USD)</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        required
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label"><Tag size={14} /> Category</label>
                                    <select
                                        className="input-field"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        required
                                    >
                                        {CATEGORIES.map((cat: string) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="input-group">
                                    <label className="input-label"><AlignLeft size={14} /> Description</label>
                                    <textarea
                                        className="input-field"
                                        rows={3}
                                        placeholder="Faahfaahinta alaabta..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="input-group" style={{ marginBottom: '15px' }}>
                                    {!showRelated ? (
                                        <button
                                            type="button"
                                            className="btn btn-outline"
                                            onClick={() => setShowRelated(true)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '0.85rem' }}
                                        >
                                            <Link2 size={16} /> Related
                                        </button>
                                    ) : (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                            <label className="input-label"><Link2 size={14} /> Related (Waxyaabaha la xidhiidha)</label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Tusaale: Charger, Earpods, Earphones..."
                                                value={formData.relatedKeywords}
                                                onChange={(e) => setFormData({ ...formData, relatedKeywords: e.target.value })}
                                            />
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                                Erayadan waxay caawinayaan in alaabtan ay soo baxdo marka la raadiyo waxyaabaha la xidhiidha. (U kala saar hakad)
                                            </p>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Image Upload Section */}
                                <div className="input-group">
                                    <label className="input-label"><ImageIcon size={14} /> Sawirka Badeecada</label>

                                    {/* Hidden file inputs */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleImageUpload}
                                    />
                                    <input
                                        ref={cameraInputRef}
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        style={{ display: 'none' }}
                                        onChange={handleImageUpload}
                                    />

                                    {formData.image ? (
                                        /* Image Preview */
                                        <div style={{
                                            position: 'relative',
                                            width: '100%',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            border: '2px solid var(--accent)',
                                            background: '#f8f8f8'
                                        }}>
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                style={{
                                                    width: '100%',
                                                    maxHeight: '200px',
                                                    objectFit: 'cover',
                                                    display: 'block'
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                                style={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    right: '8px',
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: 'rgba(255, 0, 0, 0.8)',
                                                    color: '#fff',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                                                }}
                                            >
                                                <X size={18} />
                                            </button>
                                            <div style={{
                                                padding: '8px',
                                                textAlign: 'center',
                                                fontSize: '0.8rem',
                                                color: 'var(--text-muted)',
                                                background: 'rgba(255,255,255,0.9)'
                                            }}>
                                                ✅ Sawirka waa la doortay
                                            </div>
                                        </div>
                                    ) : (
                                        /* Upload Buttons */
                                        <div style={{
                                            display: 'flex',
                                            gap: '10px',
                                            marginTop: '5px'
                                        }}>
                                            <button
                                                type="button"
                                                onClick={() => cameraInputRef.current?.click()}
                                                style={{
                                                    flex: 1,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    padding: '20px 10px',
                                                    border: '2px dashed var(--primary)',
                                                    borderRadius: '12px',
                                                    background: 'rgba(0, 33, 71, 0.05)',
                                                    cursor: 'pointer',
                                                    color: 'var(--primary)',
                                                    fontWeight: '600',
                                                    fontSize: '0.85rem',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <Camera size={28} />
                                                📷 Sawir Qaad
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                style={{
                                                    flex: 1,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    padding: '20px 10px',
                                                    border: '2px dashed var(--accent)',
                                                    borderRadius: '12px',
                                                    background: 'rgba(255, 193, 7, 0.08)',
                                                    cursor: 'pointer',
                                                    color: 'var(--accent-dark, #e6a800)',
                                                    fontWeight: '600',
                                                    fontSize: '0.85rem',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <Upload size={28} />
                                                📁 Upload Sawir
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingProduct ? 'Update Product' : 'Save Product'}</button>
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={cancelEdit}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {merchantProducts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fcfcfc', borderRadius: '12px', border: '1px dashed #ddd' }}>
                            <Package size={48} color="#ccc" style={{ marginBottom: '15px' }} />
                            <p style={{ color: 'var(--text-muted)' }}>You haven't added any products yet.</p>
                        </div>
                    ) : (
                        merchantProducts.map(product => (
                            <motion.div
                                layout
                                key={product.id}
                                className="card"
                                style={{ display: 'flex', gap: '15px', padding: '12px', alignItems: 'center' }}
                            >
                                <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', background: '#eee' }}>
                                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '600' }}>{product.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{product.category}</div>
                                    {product.description && (
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                                            {product.description}
                                        </div>
                                    )}
                                    <div style={{ color: 'var(--primary)', fontWeight: 'bold', marginTop: '4px' }}>${product.price}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => handleEdit(product)} className="btn" style={{ padding: '8px', color: '#17a2b8', background: 'rgba(23, 162, 184, 0.1)' }}>
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => { if(window.confirm('Ma hubtaa inaad tirtirto alaabtan?')) deleteProduct(product.id); }} className="btn" style={{ padding: '8px', color: '#ff4d4d', background: 'rgba(255,77,77,0.1)' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductManagement;
