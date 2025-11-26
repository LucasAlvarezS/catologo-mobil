# 📱 Catálogo Móvil de Teléfonos

Una aplicación web mobile-first para catálogo de teléfonos con panel de administración completo, comparador de productos y consulta por WhatsApp.

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2016-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

## 🎯 Objetivo

Crear una web app mobile-first para catálogo de teléfonos que permita:

- **Clientes:** Ver equipos, compararlos, filtrarlos y consultar por WhatsApp
- **Administrador:** Actualizar precios, datos y gestionar catálogo sin depender de desarrolladores

## ✨ Características

### 👥 Para Clientes

- ✅ **Catálogo responsive** con búsqueda y filtros avanzados
- ✅ **Filtros por:** Marca, precio, categoría de uso (Gaming, Redes Sociales, Banco, etc)
- ✅ **Detalle completo** con especificaciones, imágenes y precios
- ✅ **Comparador de teléfonos** side-by-side
- ✅ **Botón WhatsApp directo** con mensaje preformateado para consultar

### 👨‍💼 Para Administrador

- ✅ **Panel CRUD completo** para gestionar teléfonos
- ✅ **Edición rápida de precios** en tabla
- ✅ **Gestión de imágenes** (URLs validadas)
- ✅ **Asignación de categorías** de uso
- ✅ **Control de visibilidad** (ocultar/mostrar productos)
- ✅ **Reportes de catálogo** (análisis de productos)
- ✅ **Gestión de precios** rápida

### 🔐 Seguridad

- ✅ **Autenticación** con Supabase
- ✅ **Row Level Security (RLS)** en BD
- ✅ **Sistema de roles** (admin, vendedor, usuario)
- ✅ **Middleware** protegiendo rutas `/admin`
- ✅ **Validación de URLs** de imágenes

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 16.0.3, React 19.2.0, TypeScript
- **UI:** Radix UI, Tailwind CSS 4.1.9
- **BD:** Supabase (PostgreSQL) con RLS
- **Autenticación:** Supabase Auth
- **Formularios:** React Hook Form + Zod
- **Hosting:** Vercel
- **Integración:** WhatsApp para consultas

## 📦 Instalación

### Requisitos Previos

- Node.js 18+ 
- npm/pnpm
- Cuenta Supabase
- Cuenta Vercel (para deployment)

### Pasos

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd catologo-mobil

# 2. Instalar dependencias
pnpm install

# 3. Crear archivo .env.local (ver DEPLOYMENT.md)
cp .env.local.example .env.local

# 4. Ejecutar scripts SQL en Supabase
# Ver instrucciones en DEPLOYMENT.md

# 5. Iniciar desarrollo
pnpm dev

# 6. Abrir en navegador
# http://localhost:3000
```

## 📊 Estructura del Proyecto

```
├── app/
│   ├── (public pages)
│   │   ├── page.tsx              # Home / Catálogo
│   │   ├── categorias/page.tsx   # Categorías destacadas
│   │   ├── telefono/[id]/        # Detalle de teléfono
│   │   └── auth/login/           # Login
│   ├── admin/
│   │   ├── page.tsx              # Dashboard
│   │   ├── telefonos/            # CRUD teléfonos
│   │   └── reportes/page.tsx     # Reportes de catálogo
│   │   └── success/page.tsx      # Confirmación
│   └── api/                      # API routes
├── components/
│   ├── admin/                    # Componentes admin
│   ├── ui/                       # Componentes reutilizables
│   ├── phone-*                   # Componentes públicos
│   ├── cart-drawer.tsx           # Carrito
│   ├── phone-comparison.tsx      # Comparador
│   └── header.tsx                # Header global
├── lib/
│   ├── supabase/                 # Clientes Supabase
│   ├── types.ts                  # Tipos TypeScript
│   ├── utils.ts                  # Funciones auxiliares
│   ├── auth.ts                   # Autenticación
│   └── carrito.ts                # Lógica de carrito
├── scripts/
│   ├── 001-005.sql               # Migraciones BD
│   └── 006-007.sql               # Nuevas tablas
└── styles/
    └── globals.css               # Estilos globales
```

## 🗄️ Base de Datos

### Tablas Principales

- **telefonos:** Catálogo de productos
- **tags:** Categorías de uso (Gaming, Redes Sociales, etc)
- **telefono_tags:** Relación M2M
- **carrito_items:** Items del carrito
- **ordenes:** Órdenes de compra
- **orden_items:** Items de cada orden
- **users_roles:** Sistema de roles

Ver `DEPLOYMENT.md` para documentación completa de BD.

## 🚀 Deploy en Vercel

```bash
# Push a GitHub
git push origin main

# Vercel desplegará automáticamente
# O usa:
vercel
```

[Ver guía completa en DEPLOYMENT.md](./DEPLOYMENT.md)

## 📖 Guía de Configuración

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para:

- ✅ Configuración de variables de entorno
- ✅ Setup de Supabase y scripts SQL
- ✅ Asignación de roles de admin
- ✅ Integración de Mercado Pago
- ✅ Deployment en Vercel
- ✅ Troubleshooting

## 🔄 Workflow de Desarrollo

### Para Agregar Teléfono

1. Ir a `/admin`
2. Click "Nuevo Teléfono"
3. Completar form
4. Seleccionar categorías
5. Guardar

### Para Cambiar Precio Rápido

1. Ir a `/admin`
2. Localizar teléfono en tabla
3. Click en precio
4. Editar inline y guardar

### Para Ver Reportes

1. Ir a `/admin/reportes`
2. Ver estadísticas de ventas
3. Consultar productos más vendidos

## 🎨 Personalización

### Cambiar Nombre de Tienda

Editar en `components/header.tsx`:
```tsx
<span className="font-bold text-xl">TU TIENDA AQUÍ</span>
```

### Cambiar Colores

Editar `tailwind.config.ts` o usar clases Tailwind directamente.

### Agregar Categorías Nuevas

1. Agregar en Supabase tabla `tags`
2. Actualizar `lib/types.ts` (TAG_LABELS)
3. Reasignar a productos

## 📱 Responsive Design

- ✅ Optimizado para mobile (< 640px)
- ✅ Tablet (640px - 1024px)
- ✅ Desktop (> 1024px)

## 🔐 Seguridad

### Verificaciones Implementadas

- Autenticación requerida para `/admin`
- Validación de roles en middleware
- RLS en BD para datos confidenciales
- Validación de URLs de imágenes
- Variables sensibles en `.env.local`

## 🐛 Issues Comunes

**P:** No puedo entrar a `/admin`
**R:** Verifica estar logeado y tener email en `ADMIN_EMAILS`

**P:** Carrito no guarda
**R:** Verifica estar autenticado y ejecutar script `007_create_cart_and_orders.sql`

**P:** Imágenes no cargan
**R:** Verifica URLs en formato `https://...` con extensión `.jpg/.png`

Ver más en [DEPLOYMENT.md - Troubleshooting](./DEPLOYMENT.md#-troubleshooting)

## 📝 Próximas Fases

- 🛒 Sistema de carrito y checkout
- 💳 Integración de pagos con Mercado Pago
- 📧 Notificaciones por email
- ⭐ Sistema de reseñas y ratings
- 📊 Exportación de reportes CSV
- 🎯 Descuentos dinámicos por cantidad
- 📸 Upload de imágenes en lugar de URLs

## 👨‍💻 Desarrollo

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor dev
pnpm dev

# Build para producción
pnpm build

# Ejecutar tests
pnpm test

# Lint
pnpm lint
```

## 📄 Licencia

MIT

## 👤 Autor

**Lucas Álvarez**

---

**Última actualización:** 26 de noviembre de 2025  
**Versión:** 1.0 - MVP Completo
