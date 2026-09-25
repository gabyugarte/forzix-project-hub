# FORZIX — Herrajes y Accesorios

![FORZIX](src/assets/logo-forzix-transparente.png)

**Catálogo web y plataforma de gestión para FORZIX Herrajes y Accesorios**, empresa dedicada a la comercialización, importación y distribución de herrajes y accesorios para la fabricación y montaje de muebles de melamina en Perú.

El proyecto combina **desarrollo frontend, gestión de datos, almacenamiento de imágenes, autenticación, panel administrativo, diseño responsive y despliegue web**, creando una plataforma preparada para crecer junto con el catálogo de productos.

---

## 📌 Sobre el proyecto

FORZIX nace como un proyecto de transformación digital para una empresa dedicada al mercado peruano de herrajes para muebles.

El objetivo principal es disponer de una presencia digital profesional que permita:

* Mostrar el catálogo de productos.
* Organizar los productos por categorías.
* Gestionar productos y categorías desde un panel privado.
* Gestionar imágenes de productos y categorías.
* Mantener la información de contacto desde el panel administrativo.
* Facilitar el contacto comercial mediante WhatsApp.
* Presentar la marca de forma profesional y adaptada a dispositivos móviles.
* Contar con una arquitectura preparada para ampliar el catálogo y funcionalidades en el futuro.

Actualmente el sitio funciona principalmente como **catálogo digital y canal de contacto comercial**, no como una plataforma de venta online directa.

---

## 🚀 Características principales

### 🏠 Página principal

La página de inicio incluye:

* Hero principal con carrusel automático de imágenes.
* Llamadas a la acción para consultar el catálogo y contactar por WhatsApp.
* Presentación de las principales ventajas de FORZIX.
* Categorías dinámicas obtenidas desde Supabase.
* Productos destacados.
* Sección de distribución en Perú.
* CTA final de contacto.
* Botón flotante de WhatsApp.
* Botón de desplazamiento suave hacia el inicio.

---

### 📦 Catálogo de productos

El catálogo está conectado con Supabase y permite:

* Mostrar productos dinámicamente.
* Filtrar productos por categoría.
* Utilizar categorías mediante slugs.
* Mostrar productos disponibles.
* Gestionar productos desde el panel administrativo.
* Mostrar imágenes almacenadas en Supabase Storage.
* Preparar la estructura para futuras ampliaciones del catálogo.

Entre las categorías contempladas se encuentran:

* Bisagras
* Correderas
* Pistones
* Push Open
* Tiradores
* Accesorios

---

### 🗂️ Gestión de categorías

El panel administrativo permite:

* Crear categorías.
* Editar categorías.
* Activar o desactivar categorías.
* Eliminar categorías cuando no existen productos relacionados.
* Gestionar imágenes de categorías.
* Mostrar una previsualización antes de guardar.
* Sustituir imágenes existentes.
* Eliminar imágenes antiguas de Storage cuando son reemplazadas.

Las categorías utilizan **slugs**, permitiendo URLs y filtros más limpios.

---

### 🛠️ Panel administrativo

Se desarrolló un área privada para la gestión del catálogo.

Incluye:

* Inicio del panel administrativo.
* Gestión de productos.
* Gestión de categorías.
* Configuración del sitio.
* Autenticación de administrador.
* Control de acceso mediante Supabase.
* Gestión de información comercial.

El panel permite modificar contenido sin necesidad de editar directamente el código fuente.

---

### ⚙️ Configuración dinámica

La información comercial se gestiona desde Supabase.

Actualmente incluye:

* Número de WhatsApp.
* Mensaje predeterminado de WhatsApp.
* Email.
* Instagram.
* Facebook.

Esto permite actualizar los datos de contacto desde el panel administrativo sin modificar el código de la aplicación.

---

### 📸 Gestión de imágenes

El proyecto utiliza **Supabase Storage** para almacenar imágenes de productos y categorías.

La gestión contempla:

* Subida de imágenes.
* Previsualización.
* Obtención de URLs públicas.
* Sustitución de imágenes.
* Eliminación de imágenes antiguas al reemplazarlas.

Las imágenes del catálogo están separadas de los archivos estáticos utilizados por la interfaz.

---

### 💬 WhatsApp

Se implementó integración con WhatsApp para facilitar el contacto comercial.

Incluye:

* Botones de contacto.
* Mensajes predeterminados.
* Botón flotante.
* Número configurable desde Supabase.
* Generación dinámica del enlace de WhatsApp.

El sitio está planteado como **catálogo + contacto comercial**, permitiendo que el usuario consulte productos directamente con FORZIX.

---

## 🔐 Seguridad y acceso

La aplicación utiliza las funcionalidades de seguridad de Supabase.

Se implementaron:

* Row Level Security (RLS).
* Políticas de acceso para productos.
* Políticas de acceso para categorías.
* Políticas de administración.
* Tabla de administradores.
* Función `is_admin()` con `SECURITY DEFINER`.
* Protección de operaciones de escritura.

La información pública puede consultarse desde el catálogo, mientras que las operaciones administrativas requieren autenticación.

---

# 🧰 Tecnologías utilizadas

## Frontend

* **React**
* **TypeScript**
* **Vite**
* **TanStack Router**
* **Tailwind CSS**
* **Lucide React**

## Backend / BaaS

* **Supabase**

  * PostgreSQL
  * Authentication
  * Row Level Security
  * Storage
  * REST API

## Desarrollo

* **Visual Studio Code**
* **Git**
* **GitHub**
* **npm**

## Deployment

* **Vercel**

---

# 🗄️ Base de datos

La aplicación utiliza PostgreSQL mediante Supabase.

Entre las principales tablas se encuentran:

### `categories`

Gestiona las categorías del catálogo.

Campos principales:

* `id`
* `slug`
* `name`
* `description`
* `image_url`
* `active`
* `display_order`
* `created_at`
* `updated_at`

### `products`

Gestiona los productos del catálogo.

Campos principales:

* `id`
* `slug`
* `name`
* `category_id`
* `description`
* `price`
* `currency`
* `image_url`
* `product_code`
* `available`
* `featured`
* `display_order`
* `created_at`
* `updated_at`

### `site_settings`

Centraliza la configuración comercial y los datos de contacto.

### `admin_users`

Controla los usuarios autorizados para acceder a las funcionalidades administrativas.

---

# 🎨 Diseño y experiencia de usuario

El diseño se desarrolló pensando en una experiencia sencilla y profesional para clientes del sector de fabricación de muebles.

Características:

* Diseño responsive.
* Adaptación a móvil, tablet y escritorio.
* Navegación clara.
* Jerarquía visual orientada al catálogo.
* Botones de contacto visibles.
* Animaciones sutiles.
* Estados hover.
* Transiciones suaves.
* Componentes reutilizables.
* Diseño consistente entre las diferentes secciones.

La identidad visual utiliza principalmente **azul, negro y blanco**, siguiendo la identidad de marca de FORZIX.

---

# 📱 Responsive Design

El proyecto ha sido probado y adaptado para:

* 📱 Móviles
* 📲 Tablets
* 💻 Escritorio

Se han revisado especialmente:

* Navegación.
* Hero.
* Carrusel de imágenes.
* Tarjetas de categorías.
* Catálogo.
* CTA.
* Footer.
* Botones flotantes.
* Panel administrativo.

---

# 🧩 Arquitectura del proyecto

La aplicación utiliza una arquitectura basada en componentes y rutas.

Ejemplo de estructura:

```text
src/
├── assets/
│   ├── products/
│   ├── hero-forzix.jpg
│   ├── hero-forzix2.jpg
│   ├── hero-forzix3.jpg
│   └── logo-forzix-transparente.png
│
├── components/
│   ├── Hero.tsx
│   ├── CategoryCard.tsx
│   ├── ProductGrid.tsx
│   ├── CTASection.tsx
│   ├── PeruMap.tsx
│   ├── WhatsAppButton.tsx
│   ├── WhatsAppFloat.tsx
│   ├── ScrollToTop.tsx
│   └── Footer.tsx
│
├── config/
│   └── business.ts
│
├── lib/
│   ├── supabase.ts
│   ├── catalog.ts
│   └── whatsapp.ts
│
├── routes/
│   ├── __root.tsx
│   ├── index.tsx
│   ├── productos.index.tsx
│   ├── admin.login.tsx
│   ├── admin.index.tsx
│   ├── admin.products.tsx
│   ├── admin.categories.tsx
│   └── admin.settings.tsx
│
└── data/
    └── products.ts
```

---

# 🔄 Flujo de datos

El proyecto utiliza Supabase como fuente principal de datos.

```text
Usuario
   ↓
React / TypeScript
   ↓
TanStack Router
   ↓
Supabase Client
   ↓
PostgreSQL
   ↓
Products / Categories / Site Settings
```

Para las imágenes:

```text
Administrador
   ↓
Panel administrativo
   ↓
Supabase Storage
   ↓
Public Image URL
   ↓
Catálogo FORZIX
```

---

# 🛡️ Variables de entorno

El proyecto utiliza variables de entorno para conectar el frontend con Supabase.

Ejemplo:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

Las claves privadas y credenciales sensibles **no forman parte del repositorio**.

---

# 🧪 Build

Para comprobar que el proyecto compila correctamente:

```bash
npm run build
```

Para ejecutar el proyecto en desarrollo:

```bash
npm run dev
```

---

# 📦 Instalación

Clonar el repositorio:

```bash
git clone https://github.com/gabyugarte/forzix-project-hub.git
```

Entrar en el proyecto:

```bash
cd forzix-project-hub
```

Instalar dependencias:

```bash
npm install
```

Configurar las variables de entorno y ejecutar:

```bash
npm run dev
```

---

# 🌱 Próximas mejoras

El proyecto está diseñado para continuar evolucionando.

Entre las próximas funcionalidades previstas:

* Gestión completa de productos desde el panel.
* Ampliación del catálogo por categorías.
* Mejora de la gestión de imágenes.
* Optimización SEO.
* Mejoras adicionales de accesibilidad.
* Metadatos y Open Graph.
* Posible integración futura con funcionalidades comerciales adicionales.

---

# 🎯 Objetivo profesional del proyecto

FORZIX representa un proyecto real de desarrollo web aplicado a una necesidad empresarial concreta.

El proyecto combina:

**Frontend + Backend + Base de datos + Storage + Autenticación + Administración + Responsive Design + Deployment**

más allá de una página web estática.

La plataforma está construida para que la empresa pueda **gestionar y actualizar su catálogo de forma autónoma**, reduciendo la dependencia de modificaciones directas en el código.

---

# 👩🏻‍💻 Desarrollo

**Gabriela Ugarte M.**

Desarrollo web · Marketing digital · Automatización · Datos · IA

🌐 Portfolio:
https://gabyugarte.github.io/

---

## 📄 Licencia

Proyecto desarrollado para FORZIX Herrajes y Accesorios.

El código y los recursos visuales de este proyecto no están destinados a su redistribución comercial sin autorización.
