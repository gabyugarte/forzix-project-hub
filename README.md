# Forzix Project Hub

Quiero crear una página web profesional, moderna, elegante, rápida y completamente responsive para una empresa peruana llamada:

FORZIX
Herrajes y Accesorios

==================================================

INFORMACIÓN DE LA EMPRESA
==================================================

FORZIX se dedica a la comercialización, importación y distribución de herrajes y accesorios para la fabricación y montaje de muebles, especialmente productos utilizados en trabajos con melamina.

La empresa distribuye sus productos en todo el Perú.

La web debe transmitir una imagen de empresa profesional, confiable, moderna y especializada en su sector.

IMPORTANTE:

No copiar textos, estructura visual ni contenido de otras empresas.

Todo el contenido debe estar redactado originalmente para FORZIX.

No inventar información que no haya sido proporcionada.

==================================================
2. OBJETIVO PRINCIPAL DE LA WEB

El objetivo principal no es realizar ventas directamente desde la web.

La web funcionará como:

EMPRESA + CATÁLOGO DE PRODUCTOS + GENERACIÓN DE CONTACTOS

El recorrido ideal del visitante debe ser:

Entrar a la web
↓
Conocer FORZIX
↓
Explorar productos
↓
Encontrar el producto que necesita
↓
Consultar precio/disponibilidad
↓
Pulsar "Pedir artículo"
↓
Contactar directamente con el vendedor mediante WhatsApp

La conversión principal de la web será WhatsApp.

==================================================
3. FUNCIONALIDADES QUE NO DEBE TENER

NO crear:

registro de usuarios

inicio de sesión

cuentas de clientes

carrito de compras

checkout

pagos online

sistema interno de pedidos

base de datos

backend innecesario

panel de administración

Los productos estarán inicialmente almacenados en archivos locales/estáticos del proyecto.

La arquitectura debe permitir que en el futuro se pueda incorporar una base de datos como Supabase si el negocio crece, pero NO utilizar una base de datos ahora.

==================================================
4. IDENTIDAD VISUAL DE FORZIX

La identidad visual debe construirse alrededor de los colores oficiales del logo.

COLORES OFICIALES:

Azul principal:
#0E1AC6

Negro:
#18181B

Blanco:
#FFFFFF

Utilizar estos colores de forma consistente en toda la interfaz.

El azul #0E1AC6 será el color principal de marca y de llamadas a la acción.

El negro #18181B será utilizado para:

textos principales

títulos

navegación

elementos estructurales

fondos oscuros cuando corresponda

El blanco #FFFFFF se utilizará para:

fondos principales

contraste

tarjetas

textos sobre fondos oscuros

Se pueden utilizar grises neutros muy claros derivados del blanco para separar secciones y crear profundidad visual.

NO introducir colores adicionales llamativos que compitan con el azul de FORZIX.

No utilizar gradientes excesivos.

No utilizar una estética multicolor.

La página debe sentirse visualmente vinculada al logo.

==================================================
5. ESTILO VISUAL

Crear una estética:

profesional

moderna

limpia

industrial

elegante

sólida

confiable

comercial

Debe relacionarse visualmente con:

herrajes

muebles

melamina

carpintería

fabricación

diseño de muebles

soluciones funcionales

Evitar que parezca:

una tienda de ropa

una startup tecnológica

una página demasiado corporativa

una plantilla genérica

una web excesivamente minimalista sin personalidad

Utilizar espacios en blanco generosos.

Crear una jerarquía visual clara.

Las fotografías de productos deben tener mucho protagonismo.

Utilizar bordes, sombras y efectos con moderación.

Las animaciones deben ser sutiles y profesionales.

==================================================
6. LOGO

Utilizar el logotipo oficial de FORZIX.

NO recrear el logo mediante IA.

NO modificar:

tipografía

icono

proporciones

colores

composición

Dejar preparada una ubicación clara para cargar posteriormente el archivo oficial del logo.

El logo debe utilizarse correctamente en:

navbar

footer

favicon

Open Graph/social sharing cuando corresponda

==================================================
7. NAVEGACIÓN

Crear una navbar moderna y sticky.

Elementos:

Inicio
Productos
Nosotros
Distribución
Contacto

Añadir un botón CTA destacado:

"WhatsApp"

El botón debe utilizar el azul #0E1AC6.

Al pasar el cursor, utilizar una variación ligeramente más oscura del mismo azul, sin introducir otro color de marca.

En móvil:

utilizar menú hamburguesa

navegación sencilla

CTA de WhatsApp fácilmente accesible

==================================================
8. HERO

Crear un hero visual y comercial.

Mostrar:

FORZIX
Herrajes y Accesorios

Título principal:

"Herrajes y accesorios para mejores proyectos"

Texto:

"Soluciones prácticas y funcionales para la fabricación y montaje de muebles. Descubre nuestro catálogo y encuentra los accesorios que necesitas para tus proyectos."

Crear dos botones:

"Ver productos"

"Hablar por WhatsApp"

El botón principal debe utilizar #0E1AC6.

El segundo botón puede utilizar estilo outline con #0E1AC6.

Utilizar una fotografía profesional relacionada con muebles, melamina, cocinas, closets o herrajes.

La imagen debe sentirse realista y profesional.

Evitar fotografías genéricas de baja calidad.

==================================================
9. CATEGORÍAS

Crear una sección:

"Encuentra lo que necesitas"

Mostrar categorías mediante tarjetas visuales.

Categorías iniciales:

Bisagras

Correderas

Pistones

Sistemas Push Open

Tiradores

Accesorios para muebles

Cada categoría debe tener:

imagen o icono

nombre

breve descripción

enlace para explorar productos

Las tarjetas deben utilizar una estética limpia y profesional.

Utilizar el azul #0E1AC6 para elementos interactivos.

==================================================
10. CATÁLOGO DE PRODUCTOS

Crear una sección principal:

"Nuestros productos"

El catálogo debe ser uno de los elementos más importantes de la web.

Mostrar productos mediante tarjetas visuales.

Cada tarjeta debe incluir:

fotografía

nombre

categoría

descripción corta

precio

moneda S/

botón "Pedir artículo"

Productos iniciales:

Bisagras

Correderas

Pistones

Push Open

Tirador barra de acero inoxidable

Corredera con cierre lento

Corredera Push Open

No inventar características técnicas específicas.

Utilizar información de ejemplo únicamente cuando sea necesario y dejarla claramente estructurada para reemplazarla posteriormente.

==================================================
11. DATOS DE PRODUCTOS

NO utilizar base de datos.

Crear un archivo centralizado de productos, por ejemplo:

src/data/products.ts

Cada producto debe tener una estructura similar a:

id

name

category

description

price

currency

image

productCode

available

Esto debe permitir modificar productos fácilmente desde un único archivo.

El diseño de los componentes NO debe contener los datos directamente.

Separar:

DATOS → products.ts

DISEÑO → componentes React

==================================================
12. BÚSQUEDA Y FILTROS

Agregar una barra de búsqueda:

"¿Qué herraje estás buscando?"

Permitir buscar productos por nombre.

Agregar filtros por categoría:

Todos

Bisagras

Correderas

Pistones

Push Open

Tiradores

Accesorios

Todo el filtrado debe funcionar en el frontend.

No utilizar backend.

==================================================
13. DETALLE DE PRODUCTO

Al seleccionar un producto, mostrar una página o vista de detalle.

Debe incluir:

fotografía grande

nombre

categoría

descripción

código de producto si existe

precio

disponibilidad si existe

botón grande:

"Pedir por WhatsApp"

No incluir:

añadir al carrito

comprar

checkout

==================================================
14. WHATSAPP — FUNCIÓN PRINCIPAL

Crear una función reutilizable para generar enlaces de WhatsApp.

Crear una configuración centralizada:

WHATSAPP_NUMBER

NO inventar el número.

Utilizar un placeholder fácilmente reemplazable.

Cada producto debe generar automáticamente un mensaje personalizado.

Ejemplo:

"Hola, estoy interesado en el producto [NOMBRE DEL PRODUCTO] que vi en la web de FORZIX. ¿Podrían brindarme información sobre precio y disponibilidad?"

El botón:

"Pedir artículo"

debe abrir WhatsApp con el mensaje ya preparado.

También crear botones generales:

"Hablar por WhatsApp"

"Solicitar cotización"

"Consultar disponibilidad"

==================================================
15. BOTÓN FLOTANTE DE WHATSAPP

Agregar un botón flotante de WhatsApp visible en toda la web.

Debe:

permanecer accesible en móvil y desktop

utilizar un diseño elegante

no tapar contenido importante

tener una animación muy sutil

llevar directamente al WhatsApp del vendedor

La experiencia debe ser clara y no invasiva.

==================================================
16. SOBRE NOSOTROS

Crear una sección:

"Sobre FORZIX"

Texto original basado en la siguiente idea:

FORZIX se dedica a la comercialización, importación y distribución de herrajes y accesorios destinados a la fabricación y montaje de muebles, ofreciendo soluciones funcionales para proyectos en melamina.

La empresa busca facilitar el acceso a productos prácticos y de calidad para profesionales, fabricantes, carpinteros y personas que desarrollan proyectos de mobiliario.

El tono debe ser:

profesional

cercano

claro

confiable

No utilizar afirmaciones no verificadas como:

"líder del mercado"
"número uno"
"los mejores"
"más de X años"
"miles de clientes"

a menos que posteriormente se proporcione información real.

==================================================
17. DISTRIBUCIÓN

Crear una sección visual:

"Distribuimos en todo el Perú"

Mostrar un mapa estilizado de Perú o un elemento visual relacionado con distribución nacional.

Texto:

"Llevamos nuestros productos a clientes y profesionales en diferentes puntos del Perú."

CTA:

"Consultar por WhatsApp"

No inventar:

tiempos de entrega

costos de envío

ciudades específicas

empresas de transporte

Dejar estos datos preparados para incorporarlos posteriormente.

==================================================
18. POR QUÉ ELEGIR FORZIX

Crear una sección de beneficios:

"¿Por qué FORZIX?"

Cuatro elementos:

Variedad de productos

Soluciones para proyectos en melamina

Atención directa

Distribución en todo el Perú

Utilizar iconos modernos y sencillos.

El azul #0E1AC6 debe utilizarse como color de acento.

==================================================
19. CTA FINAL

Crear una sección final de conversión.

Título:

"¿Buscas el herraje adecuado para tu proyecto?"

Texto:

"Explora nuestro catálogo y contacta directamente con nuestro equipo para consultar precios y disponibilidad."

Botón:

"Hablar por WhatsApp"

Esta sección debe tener alto contraste utilizando la identidad azul/negro/blanco de FORZIX.

==================================================
20. FOOTER

Crear un footer profesional.

Mostrar:

FORZIX
Herrajes y Accesorios

"Distribución en todo el Perú"

Links:

Inicio
Productos
Nosotros
Distribución
Contacto

WhatsApp

Dejar placeholders para:

Instagram

Facebook

TikTok

Email

NO inventar URLs ni datos de contacto.

==================================================
21. IMÁGENES DE PRODUCTOS

La estructura debe estar preparada para utilizar fotografías reales de los productos.

No depender de imágenes generadas por IA para representar productos reales.

Cada producto debe tener una imagen fácilmente reemplazable.

Mantener una proporción visual consistente entre las imágenes.

Utilizar:

object-fit: contain

cuando sea apropiado para productos sobre fondo limpio.

Las imágenes deben cargar de manera optimizada.

==================================================
22. RESPONSIVE DESIGN

La web debe funcionar perfectamente en:

desktop

laptop

tablet

móvil

Prioridad especial para móvil.

En móvil:

botones grandes

navegación sencilla

WhatsApp siempre accesible

tarjetas de producto cómodas de visualizar

imágenes correctamente proporcionadas

textos legibles

buen espacio entre elementos

no utilizar elementos demasiado pequeños

==================================================
23. SEO

Optimizar la página para SEO.

Title:

"FORZIX | Herrajes y Accesorios para Muebles"

Crear una meta description relacionada con:

herrajes

accesorios para muebles

melamina

distribución

Perú

Utilizar correctamente:

H1
H2
H3

Crear URLs limpias.

Preparar Open Graph metadata para compartir la web en:

WhatsApp

Facebook

LinkedIn

Preparar favicon utilizando el logo oficial.

==================================================
24. ACCESIBILIDAD

Utilizar:

contraste adecuado

textos alternativos para imágenes

HTML semántico

botones accesibles

navegación mediante teclado

tamaños de texto legibles

Verificar especialmente que el azul #0E1AC6 tenga suficiente contraste cuando se utilice como fondo de botones.

==================================================
25. ARQUITECTURA DEL PROYECTO

Quiero poder continuar el desarrollo posteriormente fuera de Lovable.

El flujo será:

Lovable
↓
GitHub
↓
Visual Studio Code
↓
Vercel

Crear código limpio, organizado y mantenible.

Utilizar:

React

TypeScript

Tailwind CSS

componentes reutilizables

Si se utiliza Next.js, mantener compatibilidad completa con Vercel.

Crear componentes reutilizables:

Navbar
Hero
CategoryCard
ProductCard
ProductGrid
ProductFilters
ProductDetail
WhatsAppButton
CTASection
Footer

Centralizar configuración empresarial:

src/config/business.ts

Incluir allí placeholders para:

WhatsApp

email

Instagram

Facebook

TikTok

nombre de empresa

==================================================
26. ESTRUCTURA RECOMENDADA

Utilizar una estructura organizada similar a:

src/
components/
data/
products.ts
config/
business.ts
pages/
assets/
products/
styles/

Mantener separados:

datos

componentes

configuración

imágenes

estilos

==================================================
27. RENDIMIENTO

Priorizar:

carga rápida

imágenes optimizadas

lazy loading cuando corresponda

código limpio

componentes reutilizables

responsive design

accesibilidad

No utilizar animaciones pesadas.

No utilizar efectos visuales innecesarios.

La web debe sentirse rápida y profesional.

==================================================
28. PREPARACIÓN PARA FUTURO CRECIMIENTO

Aunque inicialmente NO utilizaremos base de datos, diseñar la arquitectura de productos de forma que posteriormente pueda sustituirse:

products.ts
↓
Supabase / API

sin tener que reconstruir toda la interfaz.

No implementar Supabase ahora.

No implementar autenticación ahora.

No implementar backend ahora.

==================================================
29. PRINCIPIOS DE DISEÑO

IMPORTANTE:

No llenar la página de elementos.

No utilizar demasiados colores.

No utilizar demasiadas animaciones.

No utilizar gradientes llamativos.

No utilizar sombras exageradas.

No utilizar diseños genéricos de plantillas.

La identidad debe sentirse como una marca real.

La combinación principal debe ser:

#0E1AC6
#18181B
#FFFFFF

con grises neutros como apoyo.

El azul FORZIX debe utilizarse estratégicamente para:

botones

enlaces

iconos destacados

estados activos

elementos importantes de marca

El negro debe aportar:

contraste

elegancia

estructura

El blanco debe proporcionar:

limpieza

espacio

legibilidad

==================================================
30. EXPERIENCIA DEL USUARIO

El visitante debe entender en los primeros segundos:

Qué es FORZIX.

Qué productos ofrece.

Que distribuye en Perú.

Cómo contactar.

Que puede pedir información directamente por WhatsApp.

La web debe reducir al máximo los pasos necesarios para contactar.

Cada producto debe tener un CTA claro.

No esconder el contacto.

No obligar al usuario a rellenar formularios largos.

==================================================
RESULTADO FINAL

Crear una web de FORZIX que parezca una empresa profesional, moderna y consolidada del sector de herrajes y accesorios.

La prioridad es:

Branding consistente con el logo.

Colores #0E1AC6 y #18181B.

Catálogo visual.

Fotografías de productos.

Precios.

Búsqueda y filtros.

Fichas de producto.

WhatsApp como principal canal de conversión.

Distribución en todo Perú.

Excelente experiencia móvil.

SEO.

Código limpio.

Fácil mantenimiento desde VS Code.

Compatibilidad con GitHub y Vercel.

Sin base de datos inicialmente.

Antes de implementar cualquier funcionalidad adicional, priorizar siempre simplicidad, velocidad, claridad y conversión.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ee35bc8a-2ace-47c0-9903-bf35cf43f790).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
