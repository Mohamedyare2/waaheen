-- ========================================================
-- WAAHEEN MARKET - SUPABASE DATABASE SCHEMA
-- ========================================================
-- Copy and paste this script into your Supabase Dashboard:
-- SQL Editor -> New Query -> Paste -> Run (Ctrl+Enter)
-- ========================================================

-- 1. Create MERCHANTS Table
CREATE TABLE IF NOT EXISTS public.merchants (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    "storeName" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    location TEXT,
    category TEXT,
    "zaadNumber" TEXT,
    "eDahabNumber" TEXT,
    "registrationDate" TEXT,
    status TEXT DEFAULT 'pending'
);

-- 2. Create PRODUCTS Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    "merchantId" TEXT REFERENCES public.merchants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    image TEXT,
    category TEXT,
    description TEXT,
    "relatedKeywords" TEXT
);

-- 3. Create ORDERS Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    "productId" TEXT,
    "productName" TEXT,
    price NUMERIC NOT NULL,
    "merchantId" TEXT,
    "merchantName" TEXT,
    "customerName" TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    "senderNumber" TEXT,
    "paymentScreenshot" TEXT,
    date TEXT
);

-- 4. Create CATEGORIES Table
CREATE TABLE IF NOT EXISTS public.categories (
    name TEXT PRIMARY KEY
);

-- 5. Insert Default Categories
INSERT INTO public.categories (name) VALUES
    ('Men'),
    ('Women'),
    ('Electronics'),
    ('Home'),
    ('Sports'),
    ('Baby'),
    ('Beauty'),
    ('Cosmetics'),
    ('Cafeteria'),
    ('Restaurant'),
    ('Restaurant & Cafeteria'),
    ('Shoes'),
    ('Other')
ON CONFLICT (name) DO NOTHING;

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 7. Create Public Access Policies (Allow Anon Read & Write)
DROP POLICY IF EXISTS "Public access to merchants" ON public.merchants;
CREATE POLICY "Public access to merchants" ON public.merchants FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access to products" ON public.products;
CREATE POLICY "Public access to products" ON public.products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access to orders" ON public.orders;
CREATE POLICY "Public access to orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access to categories" ON public.categories;
CREATE POLICY "Public access to categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

-- 8. Enable Realtime Replication
ALTER PUBLICATION supabase_realtime ADD TABLE public.merchants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
