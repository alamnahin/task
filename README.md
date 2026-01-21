# Role-Based Admin & Project Management System

A full-stack application built with Node.js/Express, PostgreSQL, React, and TypeScript, implementing role-based access control with invitation-based user onboarding.

**🔗 Live Application:** https://task-phi-puce.vercel.app
**🔗 Backend API:** https://rbac-backend-mohg.onrender.com

> **Note:** If the backend runs on a free tier (e.g., Render/Neon free compute), the first request may take ~45-60 seconds to wake. Subsequent requests are fast.

## 📋 Table of Contents

- [Features](#features)
- [Default Credentials](#default-credentials)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Business Rules](#business-rules)
- [Tradeoffs & Assumptions](#tradeoffs--assumptions)

## ✨ Features

### Authentication & Authorization
- JWT-based authentication
- Invite-only user registration
- Role-based access control (ADMIN, MANAGER, STAFF)
- Secure password hashing with bcrypt

### User Management (Admin Only)
- Create user invites with specific roles
- View all users with pagination
- Update user roles dynamically
- Activate/deactivate user accounts
- Deactivated users cannot log in

### Project Management
- All authenticated users can create projects
- View all projects (excluding soft-deleted)
- Admin-only project editing and deletion
- Soft delete implementation (not permanently removed)
- Project status tracking (ACTIVE, ARCHIVED, DELETED)

## 🔑 Default Credentials

Seeded admin account for quick access:
- **Email**: admin@example.com
- **Password**: admin123

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router v6
- **HTTP Client**: Axios

## 🏗 Architecture

### Backend Architecture

```
backend/
├── prisma/
│   ├── schema.prisma       # Database schema & models
│   └── seed.ts             # Database seeding script
├── src/
│   ├── controllers/        # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   └── project.controller.ts
│   ├── middleware/         # Express middleware
│   │   ├── auth.middleware.ts      # JWT authentication & authorization
│   │   ├── error.middleware.ts     # Centralized error handling
│   │   └── validation.middleware.ts
│   ├── routes/             # API routes
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   └── project.routes.ts
│   ├── services/           # Business logic
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   └── project.service.ts
│   ├── utils/              # Helper utilities
│   │   └── AppError.ts     # Custom error class
│   └── index.ts            # Application entry point
```

**Design Patterns:**
- **Service Layer Pattern**: Business logic separated from controllers
- **Middleware Pattern**: Modular authentication, validation, and error handling
- **Repository Pattern**: Prisma ORM abstracts database access
- **Centralized Error Handling**: Consistent error responses

### Frontend Architecture

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.tsx
│   │   └── PrivateRoute.tsx
│   ├── pages/              # Route-level components
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── UserManagement.tsx
│   │   └── ProjectManagement.tsx
│   ├── services/           # API service layer
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   └── projectService.ts
│   ├── store/              # Redux state management
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── userSlice.ts
│   │   │   └── projectSlice.ts
│   │   └── index.ts
│   ├── App.tsx             # Main application component
│   └── index.tsx           # Application entry point
```

**Design Patterns:**
- **Redux Toolkit**: Simplified state management with slices
- **Service Layer**: API calls abstracted from components
- **Protected Routes**: Authentication-based route guards
- **Interceptors**: Axios interceptors for token management and error handling

### Database Schema

**Users Table:**
- id (UUID, Primary Key)
- name, email (unique), password
- role (ADMIN | MANAGER | STAFF)
- status (ACTIVE | INACTIVE)
- invitedAt, createdAt, updatedAt

**Invites Table:**
- id (UUID, Primary Key)
- email, role, token (unique)
- expiresAt, acceptedAt, createdAt

**Projects Table:**
- id (UUID, Primary Key)
- name, description
- status (ACTIVE | ARCHIVED | DELETED)
- isDeleted (boolean for soft delete)
- createdBy (Foreign Key to Users)
- createdAt, updatedAt

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://username:password@localhost:5432/rbac_db?schema=public"
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   INVITE_EXPIRATION_HOURS=72
   FRONTEND_URL=http://localhost:3000
   ```

4. **Setup database:**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   
   # Seed database with admin user
   npm run prisma:seed
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```
   
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start development server:**
   ```bash
   npm start
   ```
   
   Application will run on `http://localhost:3000`

### Default Credentials

After seeding, use these credentials to log in:
- **Email**: admin@example.com
- **Password**: admin123

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/login`
Login with email and password.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "System Admin",
    "email": "admin@example.com",
    "role": "ADMIN",
    "status": "ACTIVE"
  }
}
```

#### POST `/api/auth/invite` (Admin Only)
Create a new user invite.

**Request:**
```json
{
  "email": "user@example.com",
  "role": "STAFF"
}
```

**Response:**
```json
{
  "invite": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "STAFF",
    "token": "unique-token",
    "expiresAt": "2026-01-24T00:00:00.000Z"
  },
  "inviteLink": "http://localhost:3000/register?token=unique-token"
}
```

#### POST `/api/auth/register-via-invite`
Register using an invite token.

**Request:**
```json
{
  "token": "unique-token",
  "name": "John Doe",
  "password": "password123"
}
```

#### GET `/api/auth/verify-invite/:token`
Verify if an invite token is valid.

### User Management Endpoints (Admin Only)

#### GET `/api/users?page=1&limit=10`
Get all users with pagination.

#### PATCH `/api/users/:id/role`
Update user role.

**Request:**
```json
{
  "role": "MANAGER"
}
```

#### PATCH `/api/users/:id/status`
Update user status.

**Request:**
```json
{
  "status": "INACTIVE"
}
```

### Project Endpoints

#### POST `/api/projects` (All Authenticated Users)
Create a new project.

**Request:**
```json
{
  "name": "New Project",
  "description": "Project description"
}
```

#### GET `/api/projects`
Get all projects (excluding soft-deleted).

#### PATCH `/api/projects/:id` (Admin Only)
Update a project.

**Request:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "status": "ARCHIVED"
}
```

#### DELETE `/api/projects/:id` (Admin Only)
Soft delete a project.

## 📝 Business Rules

### User Management
1. **No Self-Registration**: Users cannot create accounts directly
2. **Invite-Based Onboarding**: Admin must generate invite with email and role
3. **Invite Expiration**: Invites expire after 72 hours (configurable)
4. **One-Time Use**: Each invite token can only be used once
5. **Account Deactivation**: Deactivated users cannot log in
6. **Role Changes**: Admin can change user roles at any time

### Project Management
1. **Universal Creation**: All authenticated users can create projects
2. **Restricted Editing**: Only ADMIN can edit projects
3. **Restricted Deletion**: Only ADMIN can delete projects
4. **Soft Delete**: Projects are never permanently removed from database
5. **View Permissions**: All authenticated users can view active projects
6. **Status Tracking**: Projects can be ACTIVE, ARCHIVED, or DELETED

## 🔄 Tradeoffs & Assumptions

### Tradeoffs

1. **JWT vs Session-Based Auth**
   - **Chosen**: JWT
   - **Reason**: Stateless, scalable, easier for API consumption
   - **Tradeoff**: Cannot invalidate tokens before expiration without additional infrastructure

2. **Soft Delete vs Hard Delete**
   - **Chosen**: Soft delete for projects
   - **Reason**: Data recovery, audit trail, compliance
   - **Tradeoff**: Database grows over time, queries must filter deleted records

3. **Redux Toolkit vs React Query**
   - **Chosen**: Redux Toolkit
   - **Reason**: Requirement specification, familiar patterns
   - **Tradeoff**: More boilerplate than React Query, no built-in caching strategies

4. **Email Simulation vs Real Email**
   - **Chosen**: Simulated (return invite link in API response)
   - **Reason**: Development simplicity, no external dependencies
   - **Tradeoff**: Not production-ready, requires email service integration

### Assumptions

1. **Email Delivery**: In production, integrate with SendGrid/AWS SES for actual email delivery
2. **Token Storage**: JWT stored in localStorage (consider httpOnly cookies for production)
3. **Refresh Tokens**: Not implemented (7-day token expiration for simplicity)
4. **Rate Limiting**: Not implemented (should add in production)
5. **Invite Management**: No UI to revoke/manage pending invites (can be added)
6. **Audit Logs**: Not implemented (should track all admin actions)
7. **File Uploads**: Not required for this MVP
8. **Search/Filters**: Basic UI without advanced search (can be enhanced)
9. **Testing**: Focus on functionality over test coverage for MVP
10. **Deployment**: Designed for local development (needs containerization for production)

### Security Considerations

1. **Password Policy**: Minimum 6 characters (should be stricter in production)
2. **CORS**: Currently allows all origins (configure for production)
3. **Environment Variables**: Must be properly secured in production
4. **SQL Injection**: Protected by Prisma ORM
5. **XSS**: Protected by React's default escaping
6. **CSRF**: Not implemented (add for production)

### Future Enhancements

1. **Refresh Token**: Implement refresh token flow
2. **Email Service**: Integrate actual email delivery
3. **Audit Logs**: Track all administrative actions
4. **Rate Limiting**: Prevent API abuse
5. **Advanced Search**: Add filtering and search capabilities
6. **Dark Mode**: Theme toggle functionality
7. **Unit Tests**: Comprehensive test coverage
8. **Docker**: Containerization for easy deployment
9. **CI/CD**: Automated testing and deployment pipeline
10. **Real-time Updates**: WebSocket for live data updates

## 📄 License

This project is part of a technical assessment task.

## 👨‍💻 Development

**Start Backend:**
```bash
cd backend && npm run dev
```

**Start Frontend:**
```bash
cd frontend && npm start
```

**Access Application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/health

## 🧪 Testing

**Test Admin Flow:**
1. Login with default admin credentials
2. Navigate to User Management
3. Create invite for new user
4. Copy invite link and open in new window
5. Complete registration
6. Test role-based access

**Test Project Flow:**
1. Login as any user
2. Create a new project
3. View project list
4. Login as admin to edit/delete projects
5. Verify non-admin cannot edit/delete

---

**Note**: This is an MVP implementation focusing on core requirements.
