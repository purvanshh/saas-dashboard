# Multi-Tenant SaaS Dashboard

A production-ready multi-tenant B2B SaaS dashboard with role-based access control.

## Project Structure

```
saas-dashboard/
├── frontend/          # Next.js 16 + React 19 + Tailwind CSS 4
│   ├── app/           # App router pages and components
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
├── backend/           # Express/Node.js API server
│   ├── src/           # API source code
│   ├── sql/           # Database schemas
│   └── package.json   # Backend dependencies
└── package.json       # Root monorepo scripts
```

## Quick Start

```bash
# Install all dependencies
npm run install:all

# Run both frontend and backend
npm run dev

# Or run individually
npm run dev:frontend   # http://localhost:3000
npm run dev:backend    # http://localhost:4000
```

## Features

- **Multi-tenancy**: Organization switching with tenant-scoped data
- **RBAC**: Admin / Manager / Viewer role-based access control
- **Permission UI**: Disabled actions, access denied states
- **Audit Logs**: Track team activity
- **Actionable Insights**: Analytics explaining metric changes
