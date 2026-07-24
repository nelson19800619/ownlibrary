# OwnLibrary - AI Agent Instructions

**Project:** Library Management System (Full-Stack)  
**Stack:** TypeScript, React, Express, Prisma, PostgreSQL, Playwright  
**Deployments:** Frontend on Vercel, Backend on Railway (⚠️ See Known Issues)

---

## Quick Start

### Backend
```bash
cd backend
npm install
npm run dev              # Local dev at http://localhost:3001
npm run build            # Production build
npm start               # Run production build
npm run db:migrate      # Apply database migrations
npm run db:seed         # Seed database with test data
```

### Frontend
```bash
cd frontend
npm install
npm run dev             # Dev server at http://localhost:5173
npm run build           # Production build
npm run preview         # Preview production build
```

### Tests
```bash
npm run test            # Run Playwright E2E tests (requires both servers running)
```

---

## Project Structure

```
backend/
├── src/
│   ├── controllers/       # Business logic for each resource
│   ├── routes/            # Express route definitions
│   ├── middleware/        # Auth, error handling
│   ├── lib/prisma.ts      # Database client
│   └── index.ts           # Server entry point
├── prisma/
│   ├── schema.prisma      # Database models & migrations
│   ├── seed.ts            # Seed script for test data
│   └── migrations/        # Migration history
└── package.json

frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page-level components
│   ├── services/          # API client functions
│   ├── context/           # React Context (Auth, Theme)
│   ├── App.tsx            # Main router
│   └── main.tsx           # Entry point
├── public/
├── vite.config.ts
└── package.json

tests/
├── e2e.spec.ts           # E2E test suite
└── e2e-comprehensive.spec.ts
```

---

## Architecture

### Backend Routes
- `GET /health` - Health check
- `POST /auth/register` - User registration
- `POST /auth/login` - User login (returns JWT)
- `GET /api/books` - List books (paginated)
- `POST/PUT/DELETE /api/books/:id` - CRUD books
- `GET /api/users` - List users (admin only)
- `GET /api/loans` - Loans management
- `GET /api/articles` - Articles
- `GET /api/categories` - Book categories

### Frontend Routes
- `/login` - Authentication
- `/` - Dashboard
- `/books` - Book management
- `/articles` - Articles
- `/loans` - Loans (librarian+)
- `/users` - Users (admin only)

### Database Models
- **Users**: id, email, name, role (ADMIN|LIBRARIAN|READER), password
- **Books**: id, title, author, isbn, quantity, available, categoryId
- **Loans**: id, userId, bookId, borrowedAt, returnedAt
- **Articles**: id, title, content, published
- **Categories**: id, name

### Authentication
- JWT tokens stored in localStorage
- Token validation on protected routes
- Role-based access control (RBAC)
- Middleware: `auth.ts` validates token and user role

---

## Key Files by Domain

| Domain | Key Files |
|--------|-----------|
| **Auth** | `backend/src/controllers/auth.controller.ts`, `frontend/src/context/AuthContext.tsx` |
| **Books** | `backend/src/controllers/books.controller.ts`, `frontend/src/pages/BooksPage.tsx` |
| **Users** | `backend/src/controllers/users.controller.ts`, `frontend/src/pages/UsersPage.tsx` |
| **Loans** | `backend/src/controllers/loans.controller.ts`, `frontend/src/pages/LoansPage.tsx` |
| **API Client** | `frontend/src/services/api.ts` (base axios config) |
| **DB Schema** | `backend/prisma/schema.prisma` |
| **Types** | `backend/**/*.ts`, `frontend/src/**/*.tsx` (TypeScript throughout) |

---

## Development Conventions

### Backend
- **Controllers**: Named `*.controller.ts`, export async functions matching route handlers
- **Routes**: Named `*.ts` in `routes/` folder, use `router.get/post/put/delete`
- **Middleware**: `auth.ts` for JWT validation, `errorHandler.ts` for error responses
- **Error Handling**: Throw errors in controllers, `errorHandler` formats response
- **Database**: Use Prisma Client from `lib/prisma.ts` for all queries

### Frontend
- **Components**: Functional components with TypeScript
- **Styling**: Tailwind CSS utility classes (no inline styles)
- **State**: React Context for global state (Auth, Theme)
- **API**: Use axios instances in `services/` folder
- **Routes**: Protected routes use `<ProtectedRoute>` component

### Environment Variables

**Backend (.env)**
```
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/library_db
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:5173
```

**Frontend (.env.local)**
```
VITE_API_URL=http://localhost:3001
```

**Production (Vercel)**
```
VITE_API_URL=https://web-production-18137.up.railway.app
```

---

## Known Issues & Fixes

### 🔴 Railway Backend Trial Expired (Critical)
**Problem**: Backend returns "Application not found" (404)  
**Root Cause**: Railway's free trial expired (~2 months ago), services stopped  
**Solution**:
1. Upgrade Railway to paid plan, OR
2. Migrate to free alternative (Render.com, Fly.io, Railway paid tier)

**Vercel Variable**: Update `VITE_API_URL` environment variable after backend migration

### Database Migrations
**Problem**: `prisma migrate deploy` fails in production  
**Solution**: Add `|| true` to ignore errors (already in `railway.json`)

### CORS Issues
**Problem**: Frontend can't reach backend during development  
**Solution**: Backend CORS config includes localhost ports 5173-5175

### Testing
**Problem**: Playwright tests fail if servers not running  
**Solution**: Must start both `npm run dev` (backend) and frontend before running tests

---

## Common Tasks

### Add New Endpoint
1. Create controller function in `backend/src/controllers/`
2. Add route in `backend/src/routes/` using Prisma queries
3. Create API service in `frontend/src/services/`
4. Use in React component

### Add Database Model
1. Update `backend/prisma/schema.prisma`
2. Run `npm run db:migrate` (creates migration)
3. Update backend types/controllers
4. Regenerate Prisma Client: `npx prisma generate`

### Fix API Connectivity
1. Check `frontend/src/services/api.ts` for correct base URL
2. Verify backend is running: `curl http://localhost:3001/health`
3. Check CORS headers if cross-origin error
4. In production: Verify `VITE_API_URL` in Vercel settings

### Deploy Changes
```bash
# Backend (Railway)
git push origin master  # Auto-deploys from railway.json

# Frontend (Vercel)
git push origin master  # Auto-deploys from GitHub integration
```

---

## Useful Links

- [Prisma ORM Docs](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Playwright Testing](https://playwright.dev/)
- [Railway Docs](https://docs.railway.app/)
- [Vercel Deployment](https://vercel.com/docs)

---

## Testing & Validation

- **E2E Tests**: 20+ tests covering auth, CRUD, roles, UI theme
- **Test Files**: `tests/e2e.spec.ts`, `tests/e2e-comprehensive.spec.ts`
- **Reports**: See `playwright-report/` after test runs
- **Commands**: 
  - `npm run test` - Full suite
  - `npm run test -- --headed` - Visual mode
  - `npm run test -- -g "keyword"` - Filter by name

---

## For New Contributors

1. **Setup**: Follow "Quick Start" section above
2. **Explore**: Check `docs/` folder for detailed documentation
3. **Code**: Follow conventions in relevant domain (Backend/Frontend sections)
4. **Test**: Run E2E tests before committing: `npm run test`
5. **Commit**: Reference issue/feature in commit message
6. **Deploy**: Push to master, verify in Vercel/Railway dashboards

---

*Last Updated: 2026-07-24 | Status: Backend trial expired (⚠️ requires migration)*
