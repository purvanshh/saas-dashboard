# SaaS Dashboard - Production-Ready Mock Implementation

A Modern, Multi-Tenant SaaS Dashboard built with **Next.js 16 (Turbopack)**, **React 19**, and **Tailwind CSS 4**.

This repository features a "Mock-Backed" production-ready implementation, simulating a real-world SaaS application entirely on the client side using a sophisticated mock database layer with `localStorage` persistence. It is designed to demonstrate advanced frontend patterns, including RBAC, Multi-Tenancy, and Optimistic UI updates.

## 🚀 Key Features

### 1. Multi-Tenancy
- **Organization Switching**: Seamlessly toggle between multiple organizations (Acme Corp, TechStart Inc, Global Dynamics).
- **Data Isolation**: All data (projects, users, logs) is strictly scoped to the active organization.
- **Tenant Context**: Global context manages tenant state and ensures isolation.

### 2. Role-Based Access Control (RBAC)
- **Granular Permissions**: 3 distinct roles with specific capabilities:
  - **Admin**: Full access (Create/Edit/Delete projects, Manage users).
  - **Manager**: Operational access (Create/Edit projects, View users).
  - **Viewer**: Read-only access to all resources.
- **Action-Level Security**: Centralized permission logic (`canPerformAction`, `enforcePermission`) guards every interaction.
- **UI Adaptation**: Elements hide or disable based on the user's role (e.g., Delete buttons are invisible to Viewers).

### 3. Persistent Mock Database
- **Zero-Backend Config**: Runs entirely in the browser.
- **LocalStorage Persistence**: Data survives page reloads and browser restarts.
- **Simulated Latency**: API calls include artificial delay to mimic real network conditions, enabling testing of loading states.
- **Rich Seed Data**: Pre-populated with diverse datasets for different organizations.

### 4. Interactive UX
- **User Management**: Invite users, change roles, and deactivate accounts.
- **Project CRUD**: Create, Read, Update, and Delete projects with validation and confirmation dialogs.
- **Audit Logging**: Automatic tracking of all key actions (Who, What, When).
- **Toast Notifications**: Real-time feedback for success and error states.
- **Skeletons & Loaders**: Polished loading states for smoother perception.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16.1.6](https://nextjs.org/) (App Directory)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Build Tool**: Turbopack
- **Icons**: SVG (lucide-react style)
- **State Management**: React Context (AuthContext, TenantContext)

### Backend (Reference)
- There is a `backend/` directory containing a reference Express.js implementation.
- *Note: The current demo runs independently of this backend to ensure easy deployment and testing.*

---

## 📂 Project Structure

### `/frontend`
The main application code.

- **`app/`**
  - **`components/`**: Feature-specific UI components.
    - `dashboard/`: Widgets and charts.
    - `layout/`: Sidebar, TopNav, specialized layouts.
    - `projects/`: Project list, modals, and forms.
    - `users/`: User management tables and actions.
    - `audit/`: Audit log table and filters.
    - `ui/`: Reusable primitives (Modal, Skeleton, Toast).
  - **`contexts/`**
    - `AuthContext.tsx`: Manages user identity, roles, and permissions.
    - `TenantContext.tsx`: Manages active organization and data reloading.
  - **`lib/`**
    - `mockDb.ts`: The heart of the mock system. In-memory store with `localStorage` sync.
    - `mockApi.ts`: REST-like API layer that wraps `mockDb` with async signatures.
    - `permissions.ts`: RBAC definitions and matrix.
    - `api.ts`: Constraints and other system-wide API definitions.

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+ installed.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd saas-dashboard
   ```

2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing the Demo

### Login & Roles
By default, you are logged in as **Sarah Chen** (Admin) in **Acme Corp**.

- **Switch Roles**: Click the role badge ("Admin") in the top right to instantly switch between Admin, Manager, and Viewer to test permissions.
- **Switch User**: Click the user profile dropdown to switch identity entirely.
- **Switch Organization**: Click the organization name in the top left ("Acme Corp") to switch to "TechStart Inc" or "Global Dynamics".

### Verification Flows
1. **RBAC Test**: Switch to "Viewer" -> Try to delete a project. (Should be disabled/hidden).
2. **Persistence Test**: Create a new project. Refresh the page. The project should still be there.
3. **Multi-Tenant Test**: Switch to "TechStart Inc". You should see different projects and users.
4. **Audit Test**: Perform an action (e.g., Change Role). Go to "Audit Logs". You should see your action listed.

---

## 📝 License
This project is open source and available under the [MIT License](LICENSE).
