# Plan: Sistema de Biblioteca (Library Management System)

**TL;DR:** Sistema web interno full-stack para gestión de biblioteca con CRUD de libros/artículos, gestión de usuarios y préstamos. Stack: Node.js + Express + TypeScript (backend), React + Vite + TypeScript + Tailwind (frontend), PostgreSQL + Prisma ORM, autenticación JWT.

---

## Phase 1 — Project Scaffolding ✅
1. ✅ Crear estructura de carpetas `backend/` y `frontend/` bajo `ownlibrary/`
2. ✅ Inicializar backend: `npm init` + Express + TypeScript + Prisma
3. ✅ Inicializar frontend: Vite + React + TypeScript + Tailwind CSS
4. ✅ Crear `docker-compose.yml` para PostgreSQL local
5. ✅ Archivos `.env` para conexión BD y JWT secret

## Phase 2 — Database Schema ✅
6. ✅ Definir modelos Prisma: `User`, `Book`, `Article`, `Category`, `Loan`
7. Ejecutar migraciones iniciales (`npx prisma migrate dev`)

## Phase 3 — Backend API (REST) ✅
8. ✅ Auth: `POST /auth/login`, `POST /auth/register`, `GET /auth/me` con JWT
9. ✅ Middleware de autenticación y autorización por roles (admin, librarian, reader)
10. ✅ Books CRUD: `GET/POST/PUT/DELETE /api/books` con búsqueda/filtros
11. ✅ Articles CRUD: `GET/POST/PUT/DELETE /api/articles`
12. ✅ Users CRUD: `GET/POST/PUT/DELETE /api/users` (solo admin)
13. ✅ Loans: `POST /api/loans` (checkout), `PUT /api/loans/:id/return`
14. ✅ Categories CRUD: `GET/POST/PUT/DELETE /api/categories`

## Phase 4 — Frontend React ✅
15. ✅ Layout principal: sidebar de navegación + header
16. ✅ Página de Login con formulario JWT
17. ✅ Dashboard: estadísticas (total libros, artículos, préstamos activos)
18. ✅ Módulo Libros: tabla con búsqueda, modal de crear/editar, confirmación de eliminar
19. ✅ Módulo Artículos: tabla con búsqueda, modal de crear/editar
20. ✅ Módulo Usuarios: tabla, formulario admin (protegido por rol)
21. ✅ Módulo Préstamos: lista de préstamos activos, acción de devolución
22. ✅ Capa de servicios con Axios + manejo de token en headers

## Phase 5 — Polish & UX ✅
23. ✅ Guards de rutas por rol en React Router
24. ✅ Notificaciones toast (react-hot-toast)
25. ✅ Estados de carga y manejo de errores globales

---

## Relevant Files
- `backend/prisma/schema.prisma` — modelos de datos
- `backend/src/middleware/auth.ts` — validación JWT + roles
- `backend/src/controllers/` — lógica de cada módulo
- `frontend/src/services/api.ts` — cliente Axios centralizado
- `frontend/src/pages/` — una página por módulo
- `docker-compose.yml` — PostgreSQL local

---

## Decisions
- **Roles:** `ADMIN` (todo), `LIBRARIAN` (gestión de libros/préstamos), `READER` (consulta)
- **Artículos vs Libros:** misma estructura base pero modelo separado (artículos tienen `journal`/`doi` en lugar de `ISBN`)
- **No incluye:** sistema de multas, reservas, notificaciones por email (alcance inicial)

---

## Verification
1. `docker-compose up -d` levanta PostgreSQL
2. `cd backend && npx prisma migrate dev` aplica el schema
3. `npm run dev` en backend: probar endpoints con Postman/Thunder Client
4. `npm run dev` en frontend: verificar login, CRUD de libros en UI
5. Verificar que rutas admin no son accesibles con token de reader
