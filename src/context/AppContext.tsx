import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_CATEGORIES, type Merchant, type Product, type Order } from '../utils/constants';
import { supabase } from '../lib/supabase';

interface AppContextType {
    currentMerchant: Merchant | null;
    setCurrentMerchant: (merchant: Merchant | null) => void;
    products: Product[];
    addProduct: (product: Product) => Promise<void>;
    updateProduct: (product: Product) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    merchants: Merchant[];
    registerMerchant: (merchant: Merchant) => Promise<void>;
    updateMerchant: (merchant: Merchant) => Promise<void>;
    deleteMerchant: (id: string) => Promise<void>;
    loginMerchant: (username: string, password: string) => { success: boolean; data?: Merchant; error?: string };
    updateMerchantStatus: (id: string, status: 'approved' | 'rejected') => Promise<void>;
    isAdmin: boolean;
    setIsAdmin: (val: boolean) => void;
    orders: Order[];
    addOrder: (order: Order) => Promise<void>;
    updateOrder: (order: Order) => Promise<void>;
    deleteOrder: (id: string) => Promise<void>;
    categories: string[];
    addCategory: (cat: string) => Promise<void>;
    updateCategory: (oldCat: string, newCat: string) => Promise<void>;
    deleteCategory: (cat: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentMerchant, setCurrentMerchant] = useState<Merchant | null>(() => {
        const saved = localStorage.getItem('waaheen_current_merchant');
        return saved ? JSON.parse(saved) : null;
    });

    const [products, setProducts] = useState<Product[]>(() => {
        const saved = localStorage.getItem('waaheen_products');
        return saved ? JSON.parse(saved) : [];
    });

    const [merchants, setMerchants] = useState<Merchant[]>(() => {
        const saved = localStorage.getItem('waaheen_merchants');
        return saved ? JSON.parse(saved) : [];
    });

    const [isAdmin, setIsAdmin] = useState<boolean>(() => {
        const saved = localStorage.getItem('waaheen_is_admin');
        return saved === 'true';
    });

    const [orders, setOrders] = useState<Order[]>(() => {
        const saved = localStorage.getItem('waaheen_orders');
        return saved ? JSON.parse(saved) : [];
    });

    const [categories, setCategories] = useState<string[]>(() => {
        const saved = localStorage.getItem('waaheen_categories');
        return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    });

    const [isLoading, setIsLoading] = useState(true);

    // Save active session locally
    useEffect(() => {
        localStorage.setItem('waaheen_current_merchant', JSON.stringify(currentMerchant));
    }, [currentMerchant]);

    useEffect(() => {
        localStorage.setItem('waaheen_is_admin', String(isAdmin));
    }, [isAdmin]);

    // Cache products, merchants, orders, categories in localStorage for offline resiliency
    useEffect(() => {
        localStorage.setItem('waaheen_products', JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        localStorage.setItem('waaheen_merchants', JSON.stringify(merchants));
    }, [merchants]);

    useEffect(() => {
        localStorage.setItem('waaheen_orders', JSON.stringify(orders));
    }, [orders]);

    useEffect(() => {
        localStorage.setItem('waaheen_categories', JSON.stringify(categories));
    }, [categories]);

    // Initial Fetch from Supabase
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch merchants
                const { data: merchantsData, error: merchantsError } = await supabase
                    .from('merchants')
                    .select('*');

                if (!merchantsError && merchantsData) {
                    setMerchants(merchantsData as Merchant[]);
                }

                // Fetch products
                const { data: productsData, error: productsError } = await supabase
                    .from('products')
                    .select('*');

                if (!productsError && productsData) {
                    setProducts(productsData as Product[]);
                }

                // Fetch orders
                const { data: ordersData, error: ordersError } = await supabase
                    .from('orders')
                    .select('*')
                    .order('date', { ascending: false });

                if (!ordersError && ordersData) {
                    setOrders(ordersData as Order[]);
                }

                // Fetch categories
                const { data: categoriesData, error: categoriesError } = await supabase
                    .from('categories')
                    .select('name');

                if (!categoriesError && categoriesData && categoriesData.length > 0) {
                    setCategories(categoriesData.map((c: { name: string }) => c.name));
                }
            } catch (err) {
                console.warn('Supabase fetch failed, continuing with local data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        // Setup Realtime subscriptions
        const channel = supabase
            .channel('waaheen_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'merchants' }, async () => {
                const { data } = await supabase.from('merchants').select('*');
                if (data) setMerchants(data as Merchant[]);
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, async () => {
                const { data } = await supabase.from('products').select('*');
                if (data) setProducts(data as Product[]);
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, async () => {
                const { data } = await supabase.from('orders').select('*').order('date', { ascending: false });
                if (data) setOrders(data as Order[]);
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, async () => {
                const { data } = await supabase.from('categories').select('name');
                if (data && data.length > 0) setCategories(data.map((c: { name: string }) => c.name));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // ── PRODUCTS ────────────────────────────────────────────────────────────
    const addProduct = async (product: Product) => {
        setProducts((prev) => [...prev, product]);
        try {
            await supabase.from('products').insert([product]);
        } catch (e) {
            console.error('Error adding product to Supabase:', e);
        }
    };

    const updateProduct = async (updatedProduct: Product) => {
        setProducts((prev) => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        try {
            await supabase.from('products').update(updatedProduct).eq('id', updatedProduct.id);
        } catch (e) {
            console.error('Error updating product in Supabase:', e);
        }
    };

    const deleteProduct = async (id: string) => {
        setProducts((prev) => prev.filter(p => p.id !== id));
        try {
            await supabase.from('products').delete().eq('id', id);
        } catch (e) {
            console.error('Error deleting product from Supabase:', e);
        }
    };

    // ── MERCHANTS ───────────────────────────────────────────────────────────
    const registerMerchant = async (merchant: Merchant) => {
        setMerchants((prev) => [...prev, merchant]);
        try {
            await supabase.from('merchants').insert([merchant]);
        } catch (e) {
            console.error('Error registering merchant in Supabase:', e);
        }
    };

    const updateMerchant = async (updatedMerchant: Merchant) => {
        setMerchants((prev) => prev.map(m => m.id === updatedMerchant.id ? updatedMerchant : m));
        try {
            await supabase.from('merchants').update(updatedMerchant).eq('id', updatedMerchant.id);
        } catch (e) {
            console.error('Error updating merchant in Supabase:', e);
        }
    };

    const deleteMerchant = async (id: string) => {
        setMerchants((prev) => prev.filter(m => m.id !== id));
        try {
            await supabase.from('merchants').delete().eq('id', id);
        } catch (e) {
            console.error('Error deleting merchant from Supabase:', e);
        }
    };

    const updateMerchantStatus = async (id: string, status: 'approved' | 'rejected') => {
        setMerchants(prev => prev.map(m => m.id === id ? { ...m, status } : m));
        try {
            await supabase.from('merchants').update({ status }).eq('id', id);
        } catch (e) {
            console.error('Error updating merchant status in Supabase:', e);
        }
    };

    const loginMerchant = (username: string, password: string): { success: boolean; data?: Merchant; error?: string } => {
        const normalizedUsername = username.trim().toLowerCase();
        const normalizedPassword = password.trim();

        if (merchants.length === 0) {
            return { success: false, error: 'Ma jiraan ciwaan diwaangashan. Fadlan is-diwaangeli.' };
        }

        const userByUsername = merchants.find(m => m.username.trim().toLowerCase() === normalizedUsername);

        if (!userByUsername) {
            return { success: false, error: `Ma jiro username '${normalizedUsername}'.` };
        }

        if (userByUsername.password.trim() !== normalizedPassword) {
            return { success: false, error: `Password-ka waa khalad.` };
        }

        if (userByUsername.status === 'pending' || userByUsername.status === 'rejected') {
            return { success: true, data: userByUsername };
        }

        setCurrentMerchant(userByUsername);
        return { success: true, data: userByUsername };
    };

    // ── ORDERS ──────────────────────────────────────────────────────────────
    const addOrder = async (order: Order) => {
        setOrders((prev) => [order, ...prev]);
        try {
            await supabase.from('orders').insert([order]);
        } catch (e) {
            console.error('Error adding order to Supabase:', e);
        }
    };

    const updateOrder = async (updatedOrder: Order) => {
        setOrders((prev) => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
        try {
            await supabase.from('orders').update(updatedOrder).eq('id', updatedOrder.id);
        } catch (e) {
            console.error('Error updating order in Supabase:', e);
        }
    };

    const deleteOrder = async (id: string) => {
        setOrders((prev) => prev.filter(o => o.id !== id));
        try {
            await supabase.from('orders').delete().eq('id', id);
        } catch (e) {
            console.error('Error deleting order from Supabase:', e);
        }
    };

    // ── CATEGORIES ──────────────────────────────────────────────────────────
    const addCategory = async (cat: string) => {
        setCategories((prev) => [...prev, cat]);
        try {
            await supabase.from('categories').insert([{ name: cat }]);
        } catch (e) {
            console.error('Error adding category to Supabase:', e);
        }
    };

    const updateCategory = async (oldCat: string, newCat: string) => {
        setCategories((prev) => prev.map(c => c === oldCat ? newCat : c));
        try {
            await supabase.from('categories').update({ name: newCat }).eq('name', oldCat);
        } catch (e) {
            console.error('Error updating category in Supabase:', e);
        }
    };

    const deleteCategory = async (cat: string) => {
        setCategories((prev) => prev.filter(c => c !== cat));
        try {
            await supabase.from('categories').delete().eq('name', cat);
        } catch (e) {
            console.error('Error deleting category from Supabase:', e);
        }
    };

    const logout = () => {
        setCurrentMerchant(null);
        setIsAdmin(false);
    };

    return (
        <AppContext.Provider value={{
            currentMerchant,
            setCurrentMerchant,
            products,
            addProduct,
            updateProduct,
            deleteProduct,
            merchants,
            registerMerchant,
            updateMerchant,
            deleteMerchant,
            updateMerchantStatus,
            loginMerchant,
            isAdmin,
            setIsAdmin,
            orders,
            addOrder,
            updateOrder,
            deleteOrder,
            categories,
            addCategory,
            updateCategory,
            deleteCategory,
            logout,
            isLoading
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within AppProvider');
    return context;
};
