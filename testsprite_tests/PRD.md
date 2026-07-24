# Product Requirements Document (PRD)
## OwnLibrary - Library Management System

**Version:** 1.0  
**Last Updated:** 2026-07-23  
**Status:** Active Development

---

## Overview

OwnLibrary is a web-based library management system designed for small to medium-sized libraries. It allows administrators and librarians to manage book and article catalogs, user accounts, and loan/return operations with role-based access control.

---

## Core Features

### 1. User Authentication & Authorization
- User login with email/password
- JWT token-based authentication
- Three roles: ADMIN, LIBRARIAN, READER
- Session persistence in localStorage

### 2. Catalog Management
- **Books CRUD**: Create, read, update, delete books
  - Fields: Title, Author, ISBN, Description, Quantity, Available, Published Date, Category
- **Articles CRUD**: Academic articles with DOI/Journal fields
- **Categories**: Organize items by classification

### 3. Loan Management
- Create loans (checkout books)
- Return loans (checkin books)
- Track loan status: ACTIVE, RETURNED, OVERDUE
- Display active loans with due dates

### 4. User Management (Admin only)
- Create users with specific roles
- Edit user information
- Delete users
- Change user roles

### 5. Dashboard
- Display key metrics: Total books, articles, active loans
- Quick access to main modules

### 6. UI/UX Features
- Dark/Light mode toggle
- Responsive sidebar navigation
- Search/filter in tables
- Modal dialogs for create/edit operations
- Toast notifications for feedback
- Logout with confirmation

---

## User Roles & Permissions

| Permission | ADMIN | LIBRARIAN | READER |
|-----------|-------|-----------|--------|
| View Books | ✓ | ✓ | ✓ |
| Create/Edit/Delete Books | ✓ | ✓ | ✗ |
| Manage Users | ✓ | ✗ | ✗ |
| Create Loans | ✓ | ✓ | ✗ |
| Return Loans | ✓ | ✓ | ✗ |
| View Own Loans | ✓ | ✓ | ✓ |
| Manage Categories | ✓ | ✓ | ✗ |

---

## Key User Flows

### Flow 1: Admin Login & Create Book
1. Navigate to /login
2. Enter admin@library.com / admin123
3. Redirected to /dashboard
4. Click "📚 Libros" in sidebar
5. Click "+ Nuevo libro"
6. Fill form: Title, Author, ISBN, Description, Category
7. Click "Guardar"
8. Book appears in table

### Flow 2: Librarian Create Loan
1. Login as librarian@library.com
2. Navigate to /loans
3. Click "+ Nuevo préstamo"
4. Select user and book
5. System auto-calculates due date (14 days)
6. Click "Guardar"
7. Loan appears in active list

### Flow 3: Reader View Books
1. Login as reader (any READER role user)
2. Navigate to /books
3. View all books (read-only, no edit buttons)
4. Use search to filter by title/author
5. See availability status

---

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user (public)
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user profile

### Books
- `GET /api/books` - List all books
- `POST /api/books` - Create book (ADMIN, LIBRARIAN)
- `PUT /api/books/:id` - Update book (ADMIN, LIBRARIAN)
- `DELETE /api/books/:id` - Delete book (ADMIN)

### Articles
- `GET /api/articles` - List articles
- `POST /api/articles` - Create article (ADMIN, LIBRARIAN)
- `PUT /api/articles/:id` - Update article (ADMIN, LIBRARIAN)
- `DELETE /api/articles/:id` - Delete article (ADMIN)

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category (ADMIN, LIBRARIAN)
- `PUT /api/categories/:id` - Update category (ADMIN, LIBRARIAN)
- `DELETE /api/categories/:id` - Delete category (ADMIN)

### Loans
- `GET /api/loans` - List loans
- `POST /api/loans` - Create loan (ADMIN, LIBRARIAN)
- `PUT /api/loans/:id/return` - Return loan (ADMIN, LIBRARIAN)

### Users
- `GET /api/users` - List users (ADMIN)
- `POST /api/users` - Create user (ADMIN)
- `PUT /api/users/:id` - Update user (ADMIN)
- `DELETE /api/users/:id` - Delete user (ADMIN)

---

## Technical Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express 5.2.1 + TypeScript |
| Database | PostgreSQL 18 + Prisma ORM |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| HTTP Client | Axios |
| State Management | React Context API |

---

## Testing Requirements

### Functional Tests
- ✓ User login/logout flow
- ✓ CRUD operations for books, articles, users
- ✓ Loan creation and return
- ✓ Role-based access control
- ✓ Search/filter functionality
- ✓ Dark mode toggle

### API Tests
- ✓ All endpoints respond with correct status codes
- ✓ Authentication tokens are validated
- ✓ Authorization rules are enforced
- ✓ Data persistence in database

### UI Tests
- ✓ Forms validate input correctly
- ✓ Navigation works as expected
- ✓ Responsive design on desktop
- ✓ Error messages display properly

---

## Success Criteria

1. **User Authentication**: Users can login, get JWT, and maintain session
2. **Book Management**: Full CRUD operations functional
3. **Loan Management**: Create loans, track status, return books
4. **Role-Based Access**: Admin, Librarian, Reader roles enforced
5. **Data Persistence**: All data saved in PostgreSQL
6. **UI/UX**: Responsive, fast, dark mode working
7. **Performance**: API responses < 200ms

---

## Known Limitations (v1.0)

- No email notifications
- No book reservations
- No late fees calculation
- No batch import/export
- No mobile app
- No advanced reporting

---

## Initial Test Data

| Entity | Count | Details |
|--------|-------|---------|
| Users | 2 | admin@library.com (ADMIN), librarian@library.com (LIBRARIAN) |
| Categories | 5 | Ficción, No Ficción, Ciencia, Tecnología, Historia |
| Books | 2 | Clean Code, El Proceso |

---
