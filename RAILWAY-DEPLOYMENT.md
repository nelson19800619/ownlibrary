# 🚀 Deployment en Railway - Guía Completa

## Paso 1: Preparar el proyecto

```bash
# Asegurar que todo está committeado
git add -A
git commit -m "Add Railway configuration"
git push origin master
```

## Paso 2: Crear cuenta en Railway

1. Ve a https://railway.app
2. Click en "Login" → "GitHub"
3. Autoriza Railway con tu GitHub

## Paso 3: Crear nuevo proyecto

1. Dashboard → "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Busca y selecciona **ownlibrary**
4. Autoriza si es necesario

## Paso 4: Agregar PostgreSQL

1. En el proyecto Railway:
   - Click "+" → "Add Service"
   - Selecciona "PostgreSQL"
   - Se agregará automáticamente

## Paso 5: Configurar Variables de Entorno

En el servicio Node.js (backend):

**Settings** → **Variables** → Agregar:

```
VENV
production

PORT
3001

JWT_SECRET
(genera un secret aleatorio, min 32 caracteres)
Por ej: aB3cD9eF2gH1jK4lM7nO6pQ8rS5tU0vW9xY2zC

CLIENT_URL
https://tudominio.up.railway.app

DATABASE_URL
(Railway lo genera automáticamente desde PostgreSQL)
```

## Paso 6: Revisar conexión a BD

Railway **automáticamente**:
- Crea la BD PostgreSQL
- Asigna `DATABASE_URL`
- Corre migraciones de Prisma

## Paso 7: Deploy

1. Vuelve al proyecto
2. Click en el servicio Node.js
3. Verifica logs: "Successfully deployed"

## Paso 8: Obtener URL pública

En Railway:
- Backend URL: `https://nombre-proyecto-production.up.railway.app`
- Verifica con: `curl https://nombre-proyecto-production.up.railway.app/health`

## Frontend (Opcional: Vercel)

Si quieres hostear el frontend separado:

1. https://vercel.com → Import repo
2. Root directory: `frontend`
3. Build: `npm run build`
4. Output: `dist`
5. Env var: `VITE_API_URL=https://tu-railway-url`

---

## 🔧 Troubleshooting

**Error: "Prisma migration failed"**
- Railway ejecuta `npx prisma migrate deploy`
- Si falla, revisa que `DATABASE_URL` sea correcto

**Error: "Module not found"**
- Verifica que `npm ci` instale dependencias correctamente
- Railway usa `Nixpacks` para detección automática

**Puerto no escucha**
- Asegúrate que backend escucha en `process.env.PORT || 3001`

---

Listo, ¡tu app estará en vivo en ~2 minutos! 🎉
