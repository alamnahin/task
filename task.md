# Mid-Level Full Stack Developer Assessment Task

**Deadline:** 23 January at 12:00 AM (Strict Deadline)

## Objective:

This task evaluates a mid-level Full Stack Developer's ability to design, implement, and explain a real-world system involving authentication, role-based access control, invitations, frontend state management, and backend architecture.

## Tech Stack (Mandatory)

### Backend:

* Node.js
* Express.js or Fastify
* TypeScript
* PostgreSQL or MongoDB
* ORM: Prisma / TypeORM/Mongoose

### Frontend:

* React
* TypeScript
* Redux Toolkit or React Query
* UI Library: MUI/AntD/Tailwind CSS

---

## System Overview

Build a Role-Based Admin & Project Management System with Invitation-Based User Onboarding.
Admins fully manage users and projects. New users can only register via an admin-generated invite.

## Core Business Rules (IMPORTANT)

### User Management:

* Users CANNOT self-register
* Admin generates user invites via admin panel
* Invited users receive an invite token (email simulation acceptable)
* Users complete registration using invite link/token
* Admin can:
* Change user roles
* Activate / deactivate users
* View all users


* Deactivated users cannot log in

### Project Management:

* All authenticated users can CREATE projects
* Only ADMIN can EDIT or DELETE projects
* Projects use SOFT DELETE (not permanently removed)
* Non-admin users can view projects but cannot edit or delete them

---

## Backend Requirements

### Authentication:

* JWT-based authentication
* Login endpoint
* Invite-based registration endpoint
* Password hashing
* Protected routes & role middleware

### Entities:

**User:**

* id
* name
* email (unique)
* password
* role: ADMIN | MANAGER | STAFF
* status: ACTIVE | INACTIVE
* invitedAt
* createdAt

**Invite:**

* id
* email
* role
* token
* expiresAt
* acceptedAt

**Project:**

* id
* name
* description
* status: ACTIVE | ARCHIVED | DELETED
* isDeleted (boolean)
* createdBy (User ID)
* createdAt
* updatedAt

### API Endpoints:

* `POST/auth/login`
* `POST/auth/invite` (ADMIN)
* `POST/auth/register-via-invite`
* `GET/users` (ADMIN, paginated)
* `PATCH/users/:id/role` (ADMIN)
* `PATCH/users/:id/status` (ADMIN)
* `POST/projects`
* `GET/projects`
* `PATCH/projects/:id` (ADMIN only)
* `DELETE/projects/:id` (ADMIN only, soft delete)

### Validation & Error Handling:

* Centralized error handling
* Request validation
* Proper HTTP status codes

---

## Frontend Requirements

### Pages:

* Login
* Invite-based Registration
* Dashboard
* User Management (ADMIN)
* Project Management

### Features:

* Auth-protected routes
* Role-based UI rendering
* Invite flow UI
* User status & role management
* Project permission handling
* Loading & error states
* Optimistic updates where applicable

---

## State Management & Performance

* Persist auth state securely
* Cache API responses
* Avoid unnecessary refetches
* Memoized selectors & components

## MUST-HAVE REQUIREMENTS (Evaluation Blocking)

### Backend:

* Invite-based registration flow
* Role-based access control
* Soft delete implementation
* Secure authentication
* Clean architecture & TypeScript usage

### Frontend:

* Invite registration UI
* Admin user management
* Permission-based UI restrictions
* Stable global state handling
* Clean, usable admin UI

### General:

* App runs locally
* README with setup & architecture
* Clear commit history

---

## OPTIONAL/BONUS (Differentiators)

### Backend:

* Invite expiration handling
* Refresh tokens
* Audit logs
* Rate limiting

### Frontend:

* Search & filters
* Pagination UI
* Dark mode
* Reusable form abstractions

### Engineering:

* Unit/integration tests
* Environment-based configs
* Seed data scripts

---

## Submission Instructions

1. GitHub repository link
2. README.md including:
* Setup steps
* Architecture explanation
* Tradeoffs & assumptions


3. Separate frontend & backend folders preferred
4. Provide environment configuration examples (e.g., .env.example)
5. If possible, provide a deployed or hosted application URL

## Evaluation Criteria

* Backend design & security
* RBAC correctness
* TypeScript discipline
* State management strategy
* UI/UX clarity
* System thinking
* Deadline adherence