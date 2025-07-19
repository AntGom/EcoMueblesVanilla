# EcoMuebles

**EcoMuebles** es una tienda online de muebles sostenibles desarrollada en JavaScript puro (Vanilla JS), HTML5 y CSS3, sin frameworks. El objetivo es ofrecer una experiencia de usuario moderna, rápida y educativa sobre buenas prácticas de desarrollo web front-end.

---

## 🛠️ Tecnologías utilizadas

- **HTML5**: Estructura semántica de todas las páginas.
- **CSS3**: Estilos personalizados, responsive y adaptados a cada sección. Incluye media queries y organización modular por página.
- **JavaScript (ES6+)**: Lógica de negocio, interacción con la API, gestión de usuario, carrito, lista de deseos, notificaciones, etc.
- **LocalStorage**: Persistencia de datos de usuario, carrito, lista de deseos y pedidos.
- **Fetch API**: Consumo de una API REST externa para productos.

---

## 📁 Estructura del proyecto

```
EcoMueblesVanilla/
├── css/           # Hojas de estilo CSS por página y globales
├── html/          # Páginas HTML individuales (productos, detalle, login, etc.)
├── img/           # Imágenes y recursos gráficos
├── js/            # Lógica JavaScript modularizada por funcionalidad
├── index.html     # Página principal
```

---

## 🚦 Flujo de información y funcionamiento

### 1. **Navegación y páginas**
- **index.html**: Landing page con presentación, valores y acceso a catálogo.
- **products.html**: Catálogo de productos con filtros, ordenación y paginación. Los productos se obtienen de una API externa.
- **detail.html**: Vista detallada de cada producto, con opción de añadir al carrito o lista de deseos.
- **shooping-cart.html**: Carrito de compras, edición de cantidades, eliminación y resumen de pedido.
- **wishList.html**: Lista de deseos personal, con opción de mover productos al carrito.
- **profile.html**: Perfil de usuario, edición de datos y visualización de historial de pedidos.
- **login.html / register.html**: Autenticación y registro de usuarios (gestión local, sin backend real).
- **contact.html / faq.html / blog.html**: Información adicional, contacto y blog de inspiración.

### 2. **Gestión de usuario y autenticación**
- El registro y login se gestionan en el navegador usando LocalStorage.
- El usuario puede editar sus datos y ver su historial de pedidos.
- El estado de login controla la visibilidad de opciones como carrito, perfil y lista de deseos.

### 3. **Carrito de compras**
- Los productos añadidos se almacenan en LocalStorage.
- Se puede modificar la cantidad, eliminar productos o vaciar el carrito.
- El resumen del pedido calcula subtotal, envío y total.
- Al finalizar la compra, se simula el guardado del pedido en el historial del usuario.

### 4. **Lista de deseos**
- Permite guardar productos favoritos para futuras compras.
- Se puede mover un producto de la lista de deseos al carrito.

### 5. **Catálogo y detalle de productos**
- Los productos se obtienen de una API REST externa.
- Filtros por categoría, tipo de madera, acabado y precio.
- Ordenación y paginación dinámica.
- Vista detallada con imágenes, características y acciones rápidas.

### 6. **Notificaciones y feedback**
- El sistema de notificaciones informa al usuario de acciones importantes (añadir al carrito, errores, éxito, etc.).

### 7. **Responsive Design**
- El sitio es completamente responsive y usable en dispositivos móviles y escritorio.

---

## 📦 Instalación y uso

1. **Clona el repositorio:**
   ```bash
   git clone <URL-del-repo>
   ```
2. **Abre `index.html` en tu navegador.**
   - No requiere servidor ni dependencias externas.

---

## ✨ Características destacadas
- 100% Vanilla JS, sin frameworks.
- Modularidad y separación de responsabilidades.
- Persistencia local de datos.
- Interfaz moderna y accesible.
- Código comentado y fácil de mantener.

---

## 📄 Licencia

© 2025 Antonio Gómez. Desde Andalucía, con ❤.