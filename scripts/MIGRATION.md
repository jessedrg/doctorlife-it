# DoctorLife — Guía de migración a un nuevo entorno Neon

Esta guía explica paso a paso cómo levantar DoctorLife desde cero en un nuevo proyecto Neon, tanto para un entorno de staging como para una migración completa de producción.

---

## Estructura de la base de datos

| Schema | Propósito |
|---|---|
| `public` | Tablas de aplicación: usuarios, citas, suscripciones, mensajes, etc. |
| `neon_auth` | Tablas gestionadas por Neon Auth (auth, sesiones, organizaciones) |

**Total: 27 tablas** — 19 en `public`, 9 en `neon_auth`.

---

## Opción A — Solo schema nuevo (entorno limpio, sin datos)

Usa esto para staging, desarrollo o para levantar la plataforma desde cero.

### 1. Crear proyecto Neon

1. Ve a [console.neon.tech](https://console.neon.tech) y crea un proyecto nuevo
2. Copia la `DATABASE_URL` de la pestaña **Connection Details**

### 2. Ejecutar el script de schema

```bash
psql $DATABASE_URL -f scripts/create-schema.sql
```

O si usas la Neon CLI:

```bash
neon projects create --name doctorlife-staging
neon connection-string --project-id <ID> | xargs -I{} psql {} -f scripts/create-schema.sql
```

### 3. Configurar variables de entorno en Vercel

En el panel de Vercel del proyecto, añade estas variables:

```
DATABASE_URL=           # Connection string del nuevo Neon
BETTER_AUTH_SECRET=     # openssl rand -base64 32
NEXT_PUBLIC_APP_URL=    # https://tu-dominio.com
STRIPE_SECRET_KEY=      # sk_live_... o sk_test_...
STRIPE_WEBHOOK_SECRET=  # whsec_...
NEXT_PUBLIC_STRIPE_KEY= # pk_live_... o pk_test_...
BLOB_READ_WRITE_TOKEN=  # Token de Vercel Blob
```

### 4. Activar Neon Auth en el nuevo proyecto

1. En la consola de Neon, activa la integración **Neon Auth** en el proyecto
2. Las tablas del schema `neon_auth` se crean automáticamente
3. Copia el `NEON_AUTH_COOKIE_SECRET` generado y añádelo a Vercel

> **Nota:** Si ya ejecutaste el script completo incluyendo las tablas de `neon_auth`, no hay problema — el script usa `CREATE TABLE IF NOT EXISTS` y no romperá nada.

---

## Opción B — Migración completa con datos de producción

Usa esto si quieres mover producción a un nuevo Neon manteniendo todos los datos existentes.

### 1. Exportar datos de la base actual

```bash
# Exportar schema + datos (excluye neon_auth que gestiona Neon internamente)
pg_dump $DATABASE_URL \
  --schema=public \
  --no-owner \
  --no-acl \
  -f backup_$(date +%Y%m%d).sql
```

### 2. Crear el nuevo proyecto Neon

Sigue los pasos 1 y 2 de la Opción A para crear el proyecto y ejecutar el schema.

### 3. Importar los datos

```bash
psql $NEW_DATABASE_URL -f backup_$(date +%Y%m%d).sql
```

### 4. Verificar la migración

```bash
# Contar registros en tablas clave para confirmar que todo llegó
psql $NEW_DATABASE_URL -c "
  SELECT 'users' as tabla, COUNT(*) FROM public.user
  UNION ALL SELECT 'appointments', COUNT(*) FROM public.appointments
  UNION ALL SELECT 'subscriptions', COUNT(*) FROM public.subscriptions
  UNION ALL SELECT 'messages', COUNT(*) FROM public.messages;
"
```

### 5. Actualizar DATABASE_URL en Vercel

Cambia la variable `DATABASE_URL` en el panel de Vercel al nuevo connection string y redeploya.

---

## Descripción de tablas principales

### Usuarios y autenticación (`public`)

| Tabla | Descripción |
|---|---|
| `user` | Usuarios con roles: `patient`, `doctor`, `admin` |
| `account` | Cuentas OAuth vinculadas a usuarios |
| `session` | Sesiones activas (Better Auth) |
| `verification` | Tokens de verificación de email |

### Médicos

| Tabla | Descripción |
|---|---|
| `doctor_profiles` | Perfil, especialidad, Stripe, configuración |
| `doctor_availability` | Franjas horarias por día de semana |
| `availability_exceptions` | Días bloqueados o festivos |

### Pacientes y flujo clínico

| Tabla | Descripción |
|---|---|
| `leads` | Leads del quiz de elegibilidad |
| `subscriptions` | Planes activos con Stripe |
| `appointments` | Citas con estado, pago y Google Meet |
| `prescriptions` | Recetas emitidas por médicos |
| `progress_entries` | Seguimiento de peso, dosis y efectos secundarios |
| `doctor_notes` | Notas clínicas privadas del médico |
| `verification_requests` | Documentos subidos por pacientes para verificación |

### Comunicación

| Tabla | Descripción |
|---|---|
| `conversations` | Hilo de mensajes entre paciente y médico |
| `messages` | Mensajes individuales dentro de una conversación |
| `notifications` | Notificaciones in-app para usuarios |

### Financiero

| Tabla | Descripción |
|---|---|
| `commissions` | Comisiones calculadas por suscripción o cita |

---

## Resolución de problemas frecuentes

**Error: `relation already exists`**
No pasa nada — el script usa `CREATE TABLE IF NOT EXISTS`. Puedes ejecutarlo varias veces sin riesgo.

**Error: `permission denied for schema neon_auth`**
Las tablas de `neon_auth` las gestiona Neon internamente. Si aparece este error, omite manualmente esa sección del script o activa Neon Auth desde la consola de Neon para que las cree automáticamente.

**Error: `foreign key constraint`**
Si importas datos parciales, asegúrate de importar en este orden: `user` → `doctor_profiles` → `leads` → `subscriptions` → `appointments` → resto de tablas.

**La app arranca pero no hay sesión**
Verifica que `BETTER_AUTH_SECRET` sea el mismo que en producción, o los tokens de sesión existentes quedarán invalidados (comportamiento esperado al cambiar de entorno).

---

## Checklist rápido

- [ ] Proyecto Neon creado
- [ ] Script `create-schema.sql` ejecutado sin errores
- [ ] Neon Auth activado en la consola de Neon
- [ ] `DATABASE_URL` actualizada en Vercel
- [ ] `BETTER_AUTH_SECRET` configurado
- [ ] `STRIPE_SECRET_KEY` y `STRIPE_WEBHOOK_SECRET` configurados
- [ ] `BLOB_READ_WRITE_TOKEN` configurado
- [ ] Redeploy hecho en Vercel
- [ ] Login funciona correctamente
- [ ] Webhook de Stripe apuntando al nuevo dominio
