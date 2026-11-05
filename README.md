# Bible Verse — AI-Powered Bible Reading, Scripture Context & Research Platform

An intelligent, responsive Bible reading and biblical cross-reference research web application built with **Next.js 14**, **React 18**, **TypeScript**, **Tailwind CSS**, and **Supabase / PostgreSQL**.

---

## Core Architecture & Product Experience

In strict accordance with the Product Requirements Document (PRD), the entire platform revolves around **two interconnected primary pages**:

1. **Bible (`src/components/BibleReaderPage.tsx`)**:
   - **66-Book & Chapter Navigation (`src/components/BookChapterSelectorModal.tsx`)**: Searchable book & chapter grid with `Intro` + numbered chapter tiles (`1..N`), Old/New Testament filters, Alphabetical (`A–Z`) vs. Canonical sort toggle, and Reading History.
   - **6 Bible Translations**: Switch seamlessly between `NIV`, `KJV`, `ESV`, `NKJV`, `NLT`, and `ASV`.
   - **Automatic Bidirectional Cross-Reference Indicators**: Verses with established canonical cross-references automatically display an unobtrusive `[N Reference]` pill and marginalia icon (`目`).
   - **Contextual Reference Panel (`src/components/ReferencePanelModal.tsx`)**: View connected scriptures, connection category (`Prophecy fulfilment`, `Direct quotation`, `Prophecy`, `Allusion`, `Thematic connection`, `Parallel passage`, `Historical connection`), verification badge, full scripture text, side-by-side translation comparison, 7-part AI Connection Explanation with clickable references & Hebrew/Greek lexical studies, and one-click **Save to Notes** while preserving your original reading position.
   - **Red-Letter Edition & Poetic Formatting**: Supports toggleable Red-Letter words of Christ (e.g., `Matthew 18:15–20`) and poetic line indentation (e.g., `Deuteronomy 32:1–10`).

2. **Notes (`src/components/NotesPage.tsx`)**:
   - **Three Organised Views**: `All Notes`, `Saved References`, and `Collections`.
   - **Create New Reference Directly from Notes (`+ New Reference`)**: Select or search any two scriptures (e.g., `John 1:1` and `Genesis 1:1`), automatically retrieve both scripture texts without manual typing, generate an AI explanation, attach personal observations, and save.
   - **Persistent AI Research & Follow-Up Q&A**: Saved AI explanations are stored with the connection so reopening them never requires another AI request, while allowing follow-up questions in context.
   - **Immediate Live Search**: Search by scripture reference (e.g., `Isaiah 7:14`), keywords, titles, observations, or collection names.

---

## Database Schema

The complete 16-table PostgreSQL / Supabase schema with Row Level Security (RLS) policies is located in [`supabase/schema.sql`](./supabase/schema.sql).

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

