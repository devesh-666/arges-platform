# ARGES Platform — Full TypeScript Application

> AI Vision Ecosystem for the Visually Impaired
> Forging Light. Empowering Sight.

## Architecture

```
arges-platform/
├── frontend/          ← React 18 + Vite + TypeScript + Tailwind + Framer Motion
├── backend/           ← Express + TypeScript + MongoDB Atlas (Mongoose)
├── shared/            ← Shared TypeScript types
└── README.md
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS v4, Framer Motion, react-router-dom |
| Backend | Express, TypeScript, Mongoose |
| Database | MongoDB Atlas (cloud) |
| Auth | JWT + passkey simulation |
| Maps | Leaflet (CARTO Dark tiles) |

## Quick Start

### 1. Backend
```bash
cd backend
cp .env.example .env    # Add your MongoDB Atlas URI
npm install
npm run dev             # Runs on http://localhost:3001
```

The backend works in **mock mode** without a database — all API calls return mock data automatically.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev             # Runs on http://localhost:5173
```

The frontend proxies `/api` to the backend automatically during development.

## User Roles

| Role | Dashboard | Color | Access |
|------|-----------|-------|--------|
| Admin | `/admin` (password: arges-admin-2026) | Orange | Full system management |
| Family Head | `/family` | Green | Family management, device control |
| Family Member | `/member` | Blue | View blind user (consent-based) |
| Helper | `/helper` | Purple | Echo Network volunteer |

## API Endpoints

```
POST   /api/auth/signup         Family Head registration
POST   /api/auth/login          Login with email/passkey
GET    /api/auth/me             Get current user
GET    /api/users               List all users (admin)
GET    /api/devices             List all devices
GET    /api/families            List family trees
POST   /api/families/:id/members  Add family member
GET    /api/requests            List consent requests
POST   /api/requests            Create consent request
POST   /api/requests/:id/respond  Accept/decline consent
GET    /api/alerts              List SOS/fall alerts
GET    /api/helpers             List Echo helpers
GET    /api/audit               List audit logs
GET    /api/stats               Dashboard statistics
GET    /health                  Health check
```

## Deploy

- **Frontend** → Vercel or Netlify
- **Backend** → Render or Railway
- **Database** → MongoDB Atlas (free tier)

## License
© 2026 ARGES Team · Thiagarajar Polytechnic College, Salem
