# UniJoy Events — University Events Platform

UniJoy is a modern platform to discover, host, and manage university events across campuses. Students can explore and book events, hosts can create and manage events and venues, and admins oversee operations.

## Key Features

- **Multi-role access** — Admin, Host, and Student experiences
- **Event discovery** — Browse, filter, and view event details
- **Hosting tools** — Create events, manage categories, halls, schedules
- **Ticketing and payments** — Stripe-powered checkout and receipts
- **Email workflows** — Password reset and notifications via SendGrid
- **Authentication** — JWT-based login with role-aware access
- **Dashboards** — Personalized pages for hosts and admins
- **Media uploads** — Image upload with validation and storage
- **Reports** — Basic reporting and PDF generation
- **Responsive UI** — Dark mode-ready, accessible components

## Technology Stack

- **Frontend**
  - Next.js 15 (App Router, RSC)
  - React 19 + TypeScript
  - Tailwind CSS v4 + tw-animate-css
  - Radix UI primitives + shadcn/ui + lucide-react
  - TanStack Query for data fetching
  - React Hook Form + Zod validation

- **Backend**
  - Node.js + Express 4
  - MongoDB + Mongoose 8
  - Multer for image uploads
  - Stripe for payments
  - Nodemailer + SendGrid transport
  - JSON Web Tokens (JWT) auth
  - Node-Cron for scheduled jobs
  - PDFKit for PDF generation
  - express-validator for request validation

## Use Cases

- **Students** — Discover events, view details, and book tickets
- **Hosts** — Propose, create, and manage events and halls
- **Admins** — Approve hosts, moderate content, monitor reports

## Monorepo Structure

```
unijoy-events/
├── frontend/              # Next.js app (App Router)
│   ├── app/               # Routes, layouts, pages
│   ├── components/        # UI components (shadcn/ui, Radix)
│   ├── context/           # Auth, theme providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # API clients and utilities
│   ├── types/             # TypeScript types
│   ├── public/            # Static assets
│   ├── middleware.ts      # Next middleware
│   ├── next.config.ts     # Next.js config
│   └── app/globals.css    # Tailwind v4 styles
│
└── backend/               # Express API
    ├── controllers/       # Route handlers
    ├── routes/            # API routes
    ├── models/            # Mongoose models
    ├── middleware/        # Auth and other middleware
    ├── jobs/              # Scheduled jobs (node-cron)
    ├── util/              # Helpers (e.g., conflict checks)
    ├── images/            # Uploaded images
    └── app.js             # Server entrypoint (port 8080)
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally (default URI in code: mongodb://127.0.0.1:27017)

### 1) Backend (Express)

```bash
cd backend
npm install

# Create your environment file (.env)
# Required keys used in code:
# STRIPE_SECRET_KEY=sk_test_...
# SENDGRID_API_KEY=SG.XXX...
# Optional:
# FRONTEND_BASE_URL=http://localhost:3000

# Start development (with nodemon)
npm run start

# Or start without nodemon
# npm run start-server
```

Server runs on: http://localhost:8080

### 2) Frontend (Next.js)

```bash
cd frontend
npm install

# Configure local env in .env.local as needed (e.g., API base URL)

npm run dev
```

App runs on: http://localhost:3000

## API Overview

- Base URL: `http://localhost:8080`
- Major route groups: `/auth`, `/events`, `/users`, `/host`, `/halls`, `/host-categories`, `/profile`, `/reports`, `/admin`

## Notes

- CORS is enabled to allow the frontend to call the backend in development.
- MongoDB connection defaults to `mongodb://127.0.0.1:27017` (adjust in code or via config if needed).
- Some session-related code is present but commented; current auth is JWT-based.

## License

This project is provided as-is for educational and portfolio use.
