# শুদ্ধশিক্ষা — Shuddhoshikha

> Apple-inspired EdTech platform for HSC students in Bangladesh.

## Tech Stack
- **React 18** (Functional Components, Lazy Loading)
- **Tailwind CSS** (Custom design tokens)
- **Framer Motion** (Page transitions, animated components)
- **Lucide React** (Icons)
- **WordPress + Tutor LMS Pro** (Headless backend)

## Design System
- **Bengali font:** Hind Siliguri
- **Data font:** Poppins
- **Primary:** Mint Green `#00C9A7`
- **Base:** `#F4F7FB` · Cards: `#FFFFFF` · Lavender fallback: `#F4F2FF`

## Project Structure
```
src/
├── App.jsx                    # Root router (lazy views)
├── index.css                  # Global styles + Google Fonts
├── context/
│   └── AuthContext.jsx        # WordPress JWT auth + profile meta
├── hooks/
│   └── useSubjectFilter.js    # Triple-layer subject filter
├── data/
│   └── syllabus.js            # Master syllabus JSON (12 subjects, 80+ chapters)
├── components/
│   ├── layout/
│   │   ├── MainLayout.jsx     # Auth guard + page transitions
│   │   ├── Sidebar.jsx        # 280px Apple-style sidebar
│   │   ├── MobileTopBar.jsx
│   │   ├── MobileBottomNav.jsx
│   │   └── MobileDrawer.jsx
│   └── ui/
│       └── FallbackCard.jsx   # Soft lavender empty state
└── views/
    ├── LoginView.jsx
    ├── HomeView.jsx            # Welcome card + progress ring + stats
    ├── CoursesView.jsx         # Gradient cards + filter tabs
    ├── PracticeView.jsx        # চর্চাঘর hub
    ├── ProfileView.jsx         # Apple Settings + 3-tier filter
    └── practice/
        ├── ChapterPractice.jsx # Subject → Chapter → Mode
        ├── MockTestWizard.jsx  # 4-Step mock test builder
        └── BoardQuestions.jsx  # Board question bank + breadcrumb
```

## Setup
```bash
# 1. Install dependencies
npm install

# 2. Set WordPress base URL
echo "REACT_APP_WP_BASE_URL=https://your-wp-site.com/wp-json" > .env

# 3. Start dev server
npm start
```

## Backend Requirements
- WordPress REST API + JWT Authentication plugin
- Tutor LMS Pro (course & quiz data)
- Custom endpoint: `GET /shuddhoshikha/v1/dashboard/stats`
- User meta fields: `sh_class`, `sh_group`, `sh_batch`, `sh_optional`
