elevateup/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── projects/
│   │   │   ├── [projectId]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── tasks/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── components/
│   │       ├── Sidebar.tsx
│   │       └── Topbar.tsx
│   └── (public)/
│       └── layout.tsx
├── components/
│   ├── ui/                # Shadcn components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── kanban/
│   │   ├── Board.tsx
│   │   ├── Column.tsx
│   │   └── TaskCard.tsx
│   ├── charts/
│   │   ├── BarChart.tsx
│   │   └── PieChart.tsx
│   └── modals/
│       ├── CreateProject.tsx
│       └── CreateTask.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useProjects.ts
│   └── useSupabase.ts
├── services/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── api/
│       ├── projects/
│       │   └── route.ts
│       └── tasks/
│           └── route.ts
├── styles/
│   ├── globals.css
│   └── tailwind.css
├── types/
│   └── database.types.ts  # Supabase CLI generated
├── public/
│   ├── images/
│   │   └── logo.svg
│   └── favicon.ico
├── middleware.ts
├── tailwind.config.ts
├── postcss.config.ts
├── supabase.config.ts
├── next.config.js
├── package.json
├── tsconfig.json
└── .env.local