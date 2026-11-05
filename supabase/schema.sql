-- ============================================================================
-- AI-Powered Bible Reading, Scripture Connections & Research Platform
-- Complete PostgreSQL / Supabase Schema (16 Core Tables + RLS Policies)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. BIBLE DATA TABLES
-- ============================================================================

-- 1. bible_translations
CREATE TABLE IF NOT EXISTS public.bible_translations (
    id TEXT PRIMARY KEY, -- e.g. 'KJV', 'NIV', 'ESV', 'NKJV', 'NLT', 'ASV'
    name TEXT NOT NULL,
    abbreviation TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'en',
    license_info TEXT,
    is_public_domain BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. bible_books
CREATE TABLE IF NOT EXISTS public.bible_books (
    id INTEGER PRIMARY KEY, -- Canonical order 1..66
    slug TEXT NOT NULL UNIQUE, -- e.g. 'genesis', 'matthew'
    name TEXT NOT NULL,
    testament TEXT NOT NULL CHECK (testament IN ('OT', 'NT')),
    category TEXT NOT NULL,
    chapter_count INTEGER NOT NULL,
    canonical_order INTEGER NOT NULL UNIQUE
);

-- 3. bible_verses
CREATE TABLE IF NOT EXISTS public.bible_verses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    canonical_ref TEXT NOT NULL, -- e.g. 'MAT.1.23' or 'Matthew 1:23'
    book_id INTEGER NOT NULL REFERENCES public.bible_books(id) ON DELETE CASCADE,
    chapter INTEGER NOT NULL,
    verse INTEGER NOT NULL,
    translation_id TEXT NOT NULL REFERENCES public.bible_translations(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    heading TEXT,
    is_red_letter BOOLEAN DEFAULT false,
    UNIQUE (canonical_ref, translation_id)
);

CREATE INDEX IF NOT EXISTS idx_bible_verses_lookup ON public.bible_verses(book_id, chapter, translation_id);
CREATE INDEX IF NOT EXISTS idx_bible_verses_canonical ON public.bible_verses(canonical_ref);

-- 4. scripture_references (Bidirectional Cross-Reference Graph)
CREATE TABLE IF NOT EXISTS public.scripture_references (
    id TEXT PRIMARY KEY,
    source_ref TEXT NOT NULL, -- Canonical ref e.g. 'Matthew 1:23'
    target_ref TEXT NOT NULL, -- Canonical ref e.g. 'Isaiah 7:14'
    category TEXT NOT NULL CHECK (category IN (
        'Direct quotation',
        'Prophecy',
        'Prophecy fulfilment',
        'Allusion',
        'Thematic connection',
        'Parallel passage',
        'Historical connection'
    )),
    reverse_category TEXT NOT NULL CHECK (reverse_category IN (
        'Direct quotation',
        'Prophecy',
        'Prophecy fulfilment',
        'Allusion',
        'Thematic connection',
        'Parallel passage',
        'Historical connection'
    )),
    title TEXT,
    data_source TEXT NOT NULL DEFAULT 'Treasury of Scripture Knowledge (TSK)',
    verification_status TEXT NOT NULL DEFAULT 'verified' CHECK (verification_status IN ('verified', 'ai_suggested', 'user_created')),
    confidence_score NUMERIC(3,2) DEFAULT 1.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (source_ref, target_ref)
);

CREATE INDEX IF NOT EXISTS idx_scripture_refs_source ON public.scripture_references(source_ref);
CREATE INDEX IF NOT EXISTS idx_scripture_refs_target ON public.scripture_references(target_ref);

-- ============================================================================
-- 2. AI RESEARCH TABLES
-- ============================================================================

-- 5. research_sessions
CREATE TABLE IF NOT EXISTS public.research_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    primary_ref TEXT NOT NULL,
    secondary_ref TEXT,
    translation_id TEXT NOT NULL DEFAULT 'NIV',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. research_messages
CREATE TABLE IF NOT EXISTS public.research_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.research_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    cited_references TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. research_explanations
CREATE TABLE IF NOT EXISTS public.research_explanations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    primary_ref TEXT NOT NULL,
    secondary_ref TEXT,
    translation_id TEXT NOT NULL DEFAULT 'NIV',
    summary TEXT NOT NULL,
    source_context TEXT NOT NULL,
    historical_circumstances TEXT NOT NULL,
    target_context TEXT,
    authorial_intent TEXT,
    similarities_differences TEXT,
    theological_significance TEXT NOT NULL,
    lexical_notes TEXT,
    related_references TEXT[] DEFAULT '{}',
    is_ai_generated BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 3. NOTES & NOTEBOOK TABLES
-- ============================================================================

-- 8. personal_notes
CREATE TABLE IF NOT EXISTS public.personal_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    scripture_refs TEXT[] DEFAULT '{}',
    collection_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. saved_connections
CREATE TABLE IF NOT EXISTS public.saved_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    primary_ref TEXT NOT NULL,
    connected_ref TEXT NOT NULL,
    primary_text TEXT NOT NULL,
    connected_text TEXT NOT NULL,
    translation_id TEXT NOT NULL DEFAULT 'NIV',
    category TEXT NOT NULL,
    verification_status TEXT NOT NULL DEFAULT 'verified',
    ai_explanation JSONB,
    personal_observation TEXT DEFAULT '',
    follow_up_thread JSONB DEFAULT '[]'::jsonb,
    collection_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. saved_scriptures
CREATE TABLE IF NOT EXISTS public.saved_scriptures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    canonical_ref TEXT NOT NULL,
    translation_id TEXT NOT NULL,
    text TEXT NOT NULL,
    ai_explanation JSONB,
    personal_note TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. notebook_collections
CREATE TABLE IF NOT EXISTS public.notebook_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    color TEXT DEFAULT '#d4a373',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. collection_items
CREATE TABLE IF NOT EXISTS public.collection_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_id UUID NOT NULL REFERENCES public.notebook_collections(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    item_type TEXT NOT NULL CHECK (item_type IN ('connection', 'note', 'scripture')),
    item_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (collection_id, item_type, item_id)
);

-- ============================================================================
-- 4. USER DATA TABLES
-- ============================================================================

-- 13. user_preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY,
    default_translation TEXT NOT NULL DEFAULT 'NIV',
    theme TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
    font_size TEXT NOT NULL DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large', 'xlarge')),
    red_letter_enabled BOOLEAN NOT NULL DEFAULT true,
    show_reference_badges BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. reading_history
CREATE TABLE IF NOT EXISTS public.reading_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    book_name TEXT NOT NULL,
    chapter INTEGER NOT NULL,
    translation_id TEXT NOT NULL,
    visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. bookmarks
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    canonical_ref TEXT NOT NULL,
    translation_id TEXT NOT NULL,
    note TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, canonical_ref)
);

-- 16. highlights
CREATE TABLE IF NOT EXISTS public.highlights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    canonical_ref TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT 'amber',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, canonical_ref)
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.bible_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bible_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bible_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripture_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_explanations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_scriptures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notebook_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;

-- Public read access for canonical Bible & Cross-reference tables
CREATE POLICY "Public read bible_translations" ON public.bible_translations FOR SELECT USING (true);
CREATE POLICY "Public read bible_books" ON public.bible_books FOR SELECT USING (true);
CREATE POLICY "Public read bible_verses" ON public.bible_verses FOR SELECT USING (true);
CREATE POLICY "Public read scripture_references" ON public.scripture_references FOR SELECT USING (true);

-- User-isolated policies for private research, notes, and user data
CREATE POLICY "Users manage own research_sessions" ON public.research_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own research_messages" ON public.research_messages FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own research_explanations" ON public.research_explanations FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users manage own personal_notes" ON public.personal_notes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own saved_connections" ON public.saved_connections FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own saved_scriptures" ON public.saved_scriptures FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own notebook_collections" ON public.notebook_collections FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own collection_items" ON public.collection_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own user_preferences" ON public.user_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own reading_history" ON public.reading_history FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own highlights" ON public.highlights FOR ALL USING (auth.uid() = user_id);

