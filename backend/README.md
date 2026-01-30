# Multi-Tenant SaaS Backend

Production-ready Express.js backend for the enterprise SaaS dashboard. Features multi-tenant isolation, RBAC enforcement, and comprehensive audit logging.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Request Flow (CRITICAL ORDER):                             │
│                                                             │
│  1. authenticateUser()    ← Verify Supabase JWT            │
│  2. resolveTenantContext()← Determine tenant + role        │
│  3. requirePermission()   ← Enforce RBAC                   │
│  4. Route Handler         ← Execute business logic          │
│  5. writeAuditLog()       ← Record action                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 3. Setup Database

1. Create a Supabase project at https://supabase.com
2. Run the SQL schema in `sql/schema.sql` in the Supabase SQL Editor
3. Get your credentials from Settings → API

### 4. Start Development Server

```bash
npm run dev
```

Server runs at `http://localhost:3001`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/me` | Get current user + org context |

### Organizations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/organizations/switch` | Switch active organization |

### Users (Admin only)
| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/api/users` | List all users | `user:view` |
| POST | `/api/users/invite` | Invite new user | `user:invite` |
| PATCH | `/api/users/:id/role` | Update user role | `user:update_role` |

### Projects
| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/api/projects` | List all projects | `project:view` |
| POST | `/api/projects` | Create project | `project:create` |
| PATCH | `/api/projects/:id` | Update project | `project:update` |
| DELETE | `/api/projects/:id` | Soft delete project | `project:delete` |

### Audit Logs (Admin only)
| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/api/audit-logs` | View audit trail | `audit:view` |

## Security Features

### Multi-Tenancy
- Every request is scoped to a tenant
- Tenant ID derived from authenticated user membership
- Cross-tenant access is impossible by design
- RLS policies enforce isolation at database level

### RBAC (Role-Based Access Control)
- **Admin**: Full access (all permissions)
- **Manager**: Can create/update projects, view users
- **Viewer**: Read-only access

Permissions are enforced server-side, never trust frontend checks.

### Audit Logging
All significant actions are logged:
- User invitations and role changes
- Project create/update/delete
- Organization setting changes

Logs are append-only and include:
- Who performed the action
- What was changed (before/after)
- When and from where (IP, user agent)

## Middleware Chain

```typescript
// Example route with full protection
router.post('/projects',
  authenticateUser,           // Step 1: Verify JWT
  resolveTenantContext,       // Step 2: Get tenant + role
  requirePermission('project:create'), // Step 3: Check permission
  createProjectHandler        // Step 4: Execute
);
```

## Error Handling

All errors follow a consistent format:

```json
{
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "You don't have permission to perform this action",
    "status": 403,
    "details": {
      "requiredPermission": "project:delete",
      "currentRole": "manager"
    }
  }
}
```

## Project Structure

```
backend/
├── src/
│   ├── app.ts                 # Main Express app
│   ├── db/
│   │   └── client.ts          # Supabase client
│   ├── middleware/
│   │   ├── auth.ts            # JWT verification
│   │   ├── tenant.ts          # Tenant resolution
│   │   └── rbac.ts            # Permission enforcement
│   ├── routes/
│   │   └── index.ts           # API routes
│   ├── services/
│   │   └── audit.ts           # Audit logging
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   └── utils/
│       └── errors.ts          # Error handling
├── sql/
│   └── schema.sql             # Database schema
├── .env.example               # Environment template
├── package.json
└── tsconfig.json
```

## Development Commands

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
```

## Connecting to Your Frontend

The backend expects:

1. **Authorization header**: `Bearer <supabase_jwt>`
2. **Tenant header** (optional): `X-Tenant-Id: <org_id>`
3. **Content-Type**: `application/json`

Example request:

```javascript
const response = await fetch('http://localhost:3001/api/projects', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${supabaseToken}`,
    'X-Tenant-Id': currentOrgId,
    'Content-Type': 'application/json',
  },
});
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Yes | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Service role key (bypasses RLS) |
| `SUPABASE_JWT_SECRET` | Yes | JWT secret for verifying tokens |
| `FRONTEND_URL` | No | CORS origin (default: http://localhost:3000) |
| `PORT` | No | Server port (default: 3001) |

## Interview Talking Points

When discussing this backend, emphasize:

1. **Tenant Isolation**: "Every query is scoped to the authenticated user's tenant"
2. **RBAC Enforcement**: "Permissions are checked server-side, never trust the frontend"
3. **Audit Trail**: "All changes are logged with before/after state for compliance"
4. **Security**: "JWT verification, rate limiting, and input validation at every layer"
5. **Scalability**: "Stateless design allows horizontal scaling"

## License

MIT
