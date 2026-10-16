-- =============================================================================
-- TEA SHOP MVP — Initial Schema
-- Migration: 001_initial_schema.sql
-- =============================================================================


-- =============================================================================
-- 1. EXTENSIONS
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- GIN trigram index for ILIKE search


-- =============================================================================
-- 2. TABLES
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 2.1 users — Customer profiles (linked to Supabase Auth)
-- ---------------------------------------------------------------------------
CREATE TABLE public.users (
    id              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name            TEXT,
    phone           TEXT,
    bonus_points    INTEGER     NOT NULL DEFAULT 0,
    qr_code_hash    UUID        NOT NULL DEFAULT gen_random_uuid(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.users              IS 'Customer profiles linked to Supabase Auth.';
COMMENT ON COLUMN public.users.bonus_points IS 'Accumulated loyalty bonus points.';
COMMENT ON COLUMN public.users.qr_code_hash IS 'Unique UUID used to render a personal QR-code.';


-- ---------------------------------------------------------------------------
-- 2.2 tea_products — Tea catalog
-- ---------------------------------------------------------------------------
CREATE TABLE public.tea_products (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    slug                TEXT            UNIQUE NOT NULL,
    name                TEXT            NOT NULL,
    description         TEXT,
    category            TEXT            NOT NULL,  -- green | oolong | puer | red | white | herbal
    effect              TEXT,                      -- energizing | relaxing | warming | ...
    price               NUMERIC(10, 2)  NOT NULL DEFAULT 0.00,
    stock_quantity      INTEGER         NOT NULL DEFAULT 0,
    image_url           TEXT,
    water_temp          INTEGER,                   -- °C
    brewing_time_sec    INTEGER,                   -- seconds
    grams_per_100ml     NUMERIC(4, 1),             -- grams per 100 ml
    is_available        BOOLEAN         NOT NULL DEFAULT true,
    meta_title          TEXT,
    meta_description    TEXT,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.tea_products                   IS 'Tea catalog with brewing parameters and SEO meta.';
COMMENT ON COLUMN public.tea_products.slug              IS 'URL-friendly identifier (SEO / routing).';
COMMENT ON COLUMN public.tea_products.category          IS 'Tea type: green, oolong, puer, red, white, herbal.';
COMMENT ON COLUMN public.tea_products.effect            IS 'Perceived effect: energizing, relaxing, warming, etc.';
COMMENT ON COLUMN public.tea_products.water_temp        IS 'Recommended water temperature in °C.';
COMMENT ON COLUMN public.tea_products.brewing_time_sec  IS 'Recommended brewing time in seconds.';
COMMENT ON COLUMN public.tea_products.grams_per_100ml   IS 'Tea leaf amount per 100 ml of water.';


-- ---------------------------------------------------------------------------
-- 2.3 store_contacts — Shop contacts & storefront info
-- ---------------------------------------------------------------------------
CREATE TABLE public.store_contacts (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    address         TEXT,
    phone           TEXT,
    working_hours   TEXT,
    social_links    JSONB       DEFAULT '{}'::jsonb,  -- { "telegram": "...", "vk": "..." }
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.store_contacts              IS 'Shop contacts and social network links.';
COMMENT ON COLUMN public.store_contacts.social_links IS 'JSONB map of social network names to URLs.';


-- =============================================================================
-- 3. INDEXES
-- =============================================================================

-- tea_products: exact-match lookups (routing / SEO)
CREATE UNIQUE INDEX idx_tea_products_slug     ON public.tea_products (slug);

-- tea_products: filter by category / effect
CREATE INDEX idx_tea_products_category        ON public.tea_products (category);
CREATE INDEX idx_tea_products_effect          ON public.tea_products (effect);

-- tea_products: available stock listing
CREATE INDEX idx_tea_products_is_available    ON public.tea_products (is_available);

-- tea_products: full-text / ILIKE search on name (GIN trigram)
CREATE INDEX idx_tea_products_name_trgm       ON public.tea_products USING GIN (name gin_trgm_ops);

-- users: lookup by phone (future: login / deduplication)
CREATE INDEX idx_users_phone                  ON public.users (phone);


-- =============================================================================
-- 4. updated_at AUTO-UPDATE TRIGGER
-- =============================================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_store_contacts_updated_at
    BEFORE UPDATE ON public.store_contacts
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- =============================================================================
-- 5. TRIGGER: auto-create public.users on Supabase Auth sign-up
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER          -- run as owner to bypass RLS during insert
SET search_path = public  -- prevent search_path hijacking
AS $$
BEGIN
    INSERT INTO public.users (id, name, phone)
    VALUES (
        NEW.id,
        -- Prefer display_name from raw_user_meta_data, fall back to email prefix
        COALESCE(
            NEW.raw_user_meta_data ->> 'display_name',
            NEW.raw_user_meta_data ->> 'name',
            split_part(NEW.email, '@', 1)
        ),
        NEW.raw_user_meta_data ->> 'phone'
    )
    ON CONFLICT (id) DO NOTHING;  -- idempotent: safe to replay
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- =============================================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tea_products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_contacts ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 6.1 tea_products — public read, no write from client
-- ---------------------------------------------------------------------------
CREATE POLICY "tea_products: public read"
    ON public.tea_products
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- ---------------------------------------------------------------------------
-- 6.2 store_contacts — public read, no write from client
-- ---------------------------------------------------------------------------
CREATE POLICY "store_contacts: public read"
    ON public.store_contacts
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- ---------------------------------------------------------------------------
-- 6.3 users — owner-only SELECT and UPDATE
-- ---------------------------------------------------------------------------
CREATE POLICY "users: owner select"
    ON public.users
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "users: owner update"
    ON public.users
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- INSERT is handled only by the SECURITY DEFINER trigger (handle_new_user).
-- No INSERT policy is granted to anon / authenticated intentionally.


-- =============================================================================
-- 7. SEED DATA — Tea products
-- =============================================================================

INSERT INTO public.tea_products
    (slug, name, description, category, effect, price, stock_quantity,
     water_temp, brewing_time_sec, grams_per_100ml, is_available,
     meta_title, meta_description)
VALUES

-- 1. Шу Пуэр
(
    'shu-puer-klassicheskiy',
    'Шу Пуэр Классический',
    'Выдержанный шу пуэр с землистым, мягким вкусом и нотками сухофруктов. '
    'Производится методом «вотле» — ускоренной ферментации. '
    'Отлично согревает и помогает пищеварению.',
    'puer',
    'warming',
    650.00,
    120,
    95,
    30,
    3.5,
    true,
    'Шу Пуэр Классический — купить в чайном магазине',
    'Купить шу пуэр с доставкой. Мягкий, землистый вкус, '
    'натуральная ферментация. Согревает и улучшает пищеварение.'
),

-- 2. Да Хун Пао
(
    'da-hun-pao-premium',
    'Да Хун Пао Премиум',
    'Легендарный улун «Большой красный халат» с гор Уишань. '
    'Глубокий жареный аромат, карамельное послевкусие, многократная заварка.',
    'oolong',
    'relaxing',
    1200.00,
    60,
    90,
    45,
    5.0,
    true,
    'Да Хун Пао Премиум — купить улун из Уишань',
    'Да Хун Пао — один из самых знаменитых улунов Китая. '
    'Жареный аромат, карамельное послевкусие, до 8 заварок.'
),

-- 3. Те Гуань Инь
(
    'tie-guan-yin-traditsionnyy',
    'Те Гуань Инь Традиционный',
    'Классический улун «Железная Богиня Милосердия» из провинции Фуцзянь. '
    'Цветочный аромат с нотками орхидеи, нежное кремовое послевкусие.',
    'oolong',
    'relaxing',
    850.00,
    80,
    85,
    40,
    4.0,
    true,
    'Те Гуань Инь — купить традиционный улун из Фуцзянь',
    'Те Гуань Инь — улун с цветочным ароматом и кремовым послевкусием. '
    'Традиционный стиль из провинции Фуцзянь, Китай.'
),

-- 4. Лунцзин
(
    'lunczin-sezonniy',
    'Лунцзин Сезонный',
    'Зелёный чай «Колодец дракона» первого весеннего сбора из Ханчжоу. '
    'Плоские листья, ореховый аромат, мягкий сладковатый вкус без горечи.',
    'green',
    'energizing',
    980.00,
    50,
    80,
    120,
    2.5,
    true,
    'Лунцзин — зелёный чай первого сбора из Ханчжоу',
    'Лунцзин (Dragon Well) — один из лучших зелёных чаёв Китая. '
    'Первый весенний сбор, ореховый аромат, мягкий вкус.'
),

-- 5. Белый Бай Хао Инь Чжэнь
(
    'bay-hao-in-chzhen-beliy',
    'Бай Хао Инь Чжэнь Белый',
    'Белый чай «Серебряные иглы» из Фудина — только нераспустившиеся почки, '
    'покрытые белым ворсом. Деликатный медово-цветочный аромат.',
    'white',
    'relaxing',
    1350.00,
    40,
    75,
    180,
    2.0,
    true,
    'Бай Хао Инь Чжэнь — купить белый чай Серебряные иглы',
    'Бай Хао Инь Чжэнь — элитный белый чай из нераспустившихся почек. '
    'Медово-цветочный аромат, минимальная обработка, богат антиоксидантами.'
);


-- =============================================================================
-- 8. SEED DATA — Store contacts
-- =============================================================================

INSERT INTO public.store_contacts
    (address, phone, working_hours, social_links)
VALUES
(
    'г. Москва, ул. Чайная, д. 7, ТЦ «Ароматный квартал», 1 этаж',
    '+7 (999) 123-45-67',
    'Пн–Пт: 10:00–21:00, Сб–Вс: 11:00–20:00',
    '{
        "telegram": "https://t.me/tea_shop_mvp",
        "vk":       "https://vk.com/tea_shop_mvp",
        "instagram": "https://instagram.com/tea_shop_mvp"
    }'::jsonb
);
