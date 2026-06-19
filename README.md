# 🎓 Exlr AI: AKUEB Learning Platform

Next.js Version License: MIT Status: Live

Exlr AI is a full-stack learning platform built to help Pakistani SSC and HSSC students prepare for their AKUEB exams — completely free. It combines a 13-year past papers archive with a suite of AI-powered study tools, so students get everything from notes to a full mock exam in one place, without paying a rupee.

## 🌟 Key Features

| Feature | Description |
|---|---|
| AI Doubt Solver | Ask any AKUEB question and get an instant, syllabus-accurate answer, 24/7. |
| AI Notes Generator | Generates structured study notes for any topic in seconds. |
| MCQ Quiz Engine | AI-generated 10-question quizzes with instant feedback and explanations. |
| SLO Weakness Radar | Tracks quiz performance and surfaces exactly which topics need revision. |
| Personalised Learning Path | A focused 4-week plan generated from a student's actual weak areas. |
| Study Plan Generator | An 8-week study plan built around subjects, exam date, and daily hours. |
| Exam Simulator | A full timed mock exam — Paper 1 (auto-marked MCQs) and Paper 2 (self-assessed CRQ/ERQ). |
| Past Papers Archive | 528 papers spanning 2012–2025, with answer keys, filterable by subject/grade/year. |

## 🛠️ The Powerhouse Backend (AI & Data)

The platform runs on a lightweight, fully serverless architecture:

- **Groq (Llama 3.3 70B Versatile):** Powers every AI feature — the doubt solver, notes generator, quiz engine, study plans, and learning paths — chosen for its speed and generous free tier.
- **Supabase (PostgreSQL):** Single source of truth for user profiles, subjects, past papers, quiz mastery tracking, and feedback.
- **Supabase Auth:** Handles signup, login, and password recovery.
- **Supabase Storage:** Hosts all 528 past paper PDFs in a public bucket.

Technical Foundation:
- **Next.js 16 (App Router):** Full-stack React framework — pages and API routes in one codebase.
- **TypeScript:** Type safety across the entire app.
- **Row Level Security (RLS):** Database-level access control so students only see and write their own data.

## 💻 Modern UI/UX

Built with React 19 and styled with a dark, editorial-inspired theme using Space Grotesk typography. Every page — from the landing site to the exam simulator — follows a consistent design language with subtle glow accents and a focus on readability for long study sessions.

## 🚀 Getting Started

**Prerequisites**
- Node.js (v18+)
- Accounts/keys for: Supabase, Groq, EmailJS

**Installation**

1. Clone and install dependencies
```bash
git clone https://github.com/FarihaKarim12/exlr-ai.git
cd exlr-ai
npm install
```

2. Set up environment variables

Create a `.env.local` file in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_secret_key
GROQ_API_KEY=your_groq_key
```

> **Important:** Never commit `.env.local` to version control. It's already excluded via `.gitignore`.

3. Run the development server
```bash
npm run dev
```

Visit `http://localhost:3000` to see it running.

## 🔒 Security & Data Isolation

Exlr AI uses Supabase Auth combined with Row Level Security policies, so every student can only read and write their own quiz results, profile, and progress data. Admin-only routes are gated behind an `is_admin` flag checked server-side before rendering sensitive panels.

## 🔗 Live Demo
[Exlr AI](https://exlr-ai.vercel.app/)

## 🗺️ Roadmap

- [ ] Parent progress reports
- [ ] YouTube resource links per chapter
- [ ] Mobile app version
- [ ] Custom domain + Resend email integration

Built by a Computer Science student at FAST-NUCES as a free resource for AKUEB students across Pakistan.
