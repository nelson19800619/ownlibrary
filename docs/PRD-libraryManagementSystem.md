# PRD — Sistema de Gestión de Biblioteca (OwnLibrary)

**Versión:** 1.0  
**Fecha:** 2026-07-23  
**Autor:** Equipo de desarrollo  
**Estado:** Implementado

---

## 1. Resumen Ejecutivo

OwnLibrary es un sistema web interno full-stack para la gestión integral de una biblioteca. Permite administrar el catálogo de libros y artículos académicos, gestionar usuarios con roles diferenciados y controlar el ciclo de préstamos y devoluciones.

---

## 2. Problema

Las bibliotecas pequeñas y departamentales carecen de un sistema digital accesible que permita:
- Buscar y consultar el catálogo de forma rápida.
- Controlar el inventario y disponibilidad de ejemplares.
- Gestionar préstamos sin formularios en papel.
- Diferenciar permisos entre administradores, bibliotecarios y lectores.

---

## 3. Objetivos del Producto

| Objetivo | Métrica de éxito |
|----------|-----------------|
| Digitalizar el catálogo completo | 100% de libros y artículos registrados |
| Reducir tiempo de préstamo | < 30 segundos por operación |
| Control de acceso por rol | 0 accesos no autorizados |
| Disponibilidad del sistema | 99% uptime en horario laboral |

---

## 4. Usuarios y Roles

### 4.1 ADMIN
- Acceso total al sistema.
- Gestión de usuarios (crear, editar, eliminar, cambiar roles).
- CRUD completo de libros, artículos, categorías y préstamos.

### 4.2 LIBRARIAN (Bibliotecario)
- Gestión del catálogo (libros y artículos).
- Gestión de préstamos y devoluciones.
- Gestión de categorías.
- Sin acceso a gestión de usuarios.

### 4.3 READER (Lector)
- Consulta del catálogo (solo lectura).
- Visualización de sus préstamos activos.

---

## 5. Funcionalidades

### 5.1 Autenticación y Autorización
- Login con email/contraseña → token JWT.
- Registro de nuevos usuarios (rol READER por defecto).
- Middleware de autorización por rol en cada endpoint.
- Persistencia de sesión en localStorage.

### 5.2 Gestión de Libros
- CRUD completo (crear, leer, actualizar, eliminar).
- Campos: título, autor, ISBN, descripción, cantidad, disponibles, fecha publicación, categoría.
- Búsqueda por título/autor.
- Control automático de disponibilidad al prestar/devolver.

### 5.3 Gestión de Artículos Académicos
- CRUD completo.
- Campos: título, autor, journal, DOI, descripción, fecha publicación, categoría.
- Búsqueda por título/autor.

### 5.4 Gestión de Categorías
- CRUD de categorías para clasificar libros y artículos.
- Relación uno-a-muchos con libros y artículos.

### 5.5 Gestión de Préstamos
- Crear préstamo: asignar libro a usuario con fecha de vencimiento.
- Devolver préstamo: registrar fecha de devolución y liberar ejemplar.
- Estados: ACTIVE, RETURNED, OVERDUE.
- Listado de préstamos activos con información de usuario y libro.

### 5.6 Gestión de Usuarios (solo ADMIN)
- Listar todos los usuarios.
- Crear usuario con rol específico.
- Editar datos y rol.
- Eliminar usuario.

### 5.7 Dashboard
- Total de libros en el sistema.
- Total de artículos.
- Préstamos activos.
- Resumen visual para toma de decisiones.

---

## 6. Arquitectura Técnica

### 6.1 Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express 5 + TypeScript |
| ORM | Prisma |
| Base de Datos | PostgreSQL 18 |
| Autenticación | JWT (jsonwebtoken + bcryptjs) |
| HTTP Client | Axios |

### 6.2 Estructura del Proyecto

```
ownlibrary/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Modelos de datos
│   │   └── seed.ts            # Datos iniciales
│   └── src/
│       ├── index.ts           # Entry point Express
│       ├── controllers/       # Lógica de negocio por módulo
│       ├── routes/            # Definición de endpoints
│       ├── middleware/        # Auth + error handling
│       └── lib/               # Prisma client singleton
├── frontend/
│   └── src/
│       ├── pages/             # Vistas por módulo
│       ├── components/        # Componentes reutilizables
│       ├── context/           # AuthContext + ThemeContext
│       └── services/          # Capa de servicios (Axios)
├── docs/                      # Documentación
└── docker-compose.yml         # Infraestructura
```

### 6.3 Modelo de Datos

```mermaid
erDiagram
    User ||--o{ Loan : "tiene"
    Book ||--o{ Loan : "prestado en"
    Category ||--o{ Book : "clasifica"
    Category ||--o{ Article : "clasifica"

    User {
        string id PK
        string name
        string email UK
        string password
        enum role
        datetime createdAt
        datetime updatedAt
    }

    Book {
        string id PK
        string title
        string author
        string isbn UK
        string description
        int quantity
        int available
        datetime publishedAt
        string categoryId FK
    }

    Article {
        string id PK
        string title
        string author
        string journal
        string doi UK
        string description
        datetime publishedAt
        string categoryId FK
    }

    Category {
        string id PK
        string name UK
    }

    Loan {
        string id PK
        string userId FK
        string bookId FK
        enum status
        datetime loanedAt
        datetime dueDate
        datetime returnedAt
    }
```

### 6.4 API Endpoints

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| POST | `/auth/register` | Registrar usuario | Público |
| POST | `/auth/login` | Iniciar sesión | Público |
| GET | `/auth/me` | Obtener perfil | Autenticado |
| GET | `/api/books` | Listar libros | Autenticado |
| POST | `/api/books` | Crear libro | ADMIN, LIBRARIAN |
| PUT | `/api/books/:id` | Actualizar libro | ADMIN, LIBRARIAN |
| DELETE | `/api/books/:id` | Eliminar libro | ADMIN, LIBRARIAN |
| GET | `/api/articles` | Listar artículos | Autenticado |
| POST | `/api/articles` | Crear artículo | ADMIN, LIBRARIAN |
| PUT | `/api/articles/:id` | Actualizar artículo | ADMIN, LIBRARIAN |
| DELETE | `/api/articles/:id` | Eliminar artículo | ADMIN, LIBRARIAN |
| GET | `/api/categories` | Listar categorías | Autenticado |
| POST | `/api/categories` | Crear categoría | ADMIN, LIBRARIAN |
| PUT | `/api/categories/:id` | Actualizar categoría | ADMIN, LIBRARIAN |
| DELETE | `/api/categories/:id` | Eliminar categoría | ADMIN |
| GET | `/api/loans` | Listar préstamos | Autenticado |
| POST | `/api/loans` | Crear préstamo | ADMIN, LIBRARIAN |
| PUT | `/api/loans/:id/return` | Devolver préstamo | ADMIN, LIBRARIAN |
| GET | `/api/users` | Listar usuarios | ADMIN |
| POST | `/api/users` | Crear usuario | ADMIN |
| PUT | `/api/users/:id` | Actualizar usuario | ADMIN |
| DELETE | `/api/users/:id` | Eliminar usuario | ADMIN |

---

## 7. Requisitos No Funcionales

| Requisito | Especificación |
|-----------|---------------|
| Rendimiento | Respuesta API < 200ms para operaciones CRUD |
| Seguridad | Passwords hasheados con bcrypt, JWT con expiración 24h |
| Responsividad | UI adaptable a desktop (1024px+) |
| Tema | Soporte dark/light mode con persistencia |
| Validación | Validación en frontend y backend |
| Manejo de errores | Middleware centralizado + toast notifications |

---

## 8. Datos Iniciales (Seed)

| Entidad | Datos |
|---------|-------|
| Admin | admin@library.com / admin123 (rol ADMIN) |
| Bibliotecario | librarian@library.com / librarian123 (rol LIBRARIAN) |
| Categorías | Ficción, No Ficción, Ciencia, Tecnología, Historia |

---

## 9. Fuera de Alcance (v1.0)

- Sistema de multas por retraso.
- Reservas de libros.
- Notificaciones por email.
- Importación/exportación masiva de datos.
- App móvil nativa.
- Integración con sistemas externos (OPAC, Z39.50).
- Reportes avanzados con gráficos.

---

## 10. Roadmap Futuro

| Versión | Funcionalidad |
|---------|--------------|
| v1.1 | Sistema de reservas + notificaciones email |
| v1.2 | Reportes y estadísticas avanzadas |
| v1.3 | Importación masiva CSV/Excel |
| v2.0 | App móvil (React Native) + API pública |

---

## 11. Dependencias Técnicas

### Producción
- `express` ^5.2.1
- `@prisma/client` ^5.7.0
- `jsonwebtoken` ^9.0.2
- `bcryptjs` ^2.4.3
- `cors` ^2.8.5
- `dotenv` ^16.3.1

### Desarrollo
- `typescript` ^5.3.2
- `prisma` ^5.7.0
- `ts-node-dev` ^2.0.0
- `vite` ^8.1.5
- `tailwindcss` v4
- `react` 18+
- `axios`

---

## 12. Configuración de Entorno

```env
# Backend (.env)
DATABASE_URL=postgresql://postgres:Admin123@localhost:5432/library_db?schema=public
JWT_SECRET=<secret>
PORT=3001
```

```yaml
# docker-compose.yml (PostgreSQL)
# Alternativa: PostgreSQL 18 nativo en Windows como servicio
```

Frontend proxy en `vite.config.ts` redirige `/api` y `/auth` a `localhost:3001`.
