# CHRONOS

CHRONOS es un proyecto front-end estático compuesto por tres experiencias separadas de marca:

- **TIENDA**: catálogo de relojes con carrito persistente.
- **INICIO**: pantalla demo de registro e inicio de sesión.
- **SERVICIOS**: página de servicios de relojería.

## Vista general

Este repositorio reúne una experiencia demo de marca para CHRONOS con foco en:

- estética premium de relojería
- navegación simple entre módulos
- carrito persistente con `localStorage`
- flujo de acceso demo con sesión simulada

## Acceso rápido

Luego de levantar el servidor local, podés entrar directamente a:

- **Tienda:** `http://localhost:8000/TIENDA/`
- **Inicio / acceso:** `http://localhost:8000/INICIO/`
- **Servicios:** `http://localhost:8000/SERVICIOS/`

### Credenciales demo

- **Usuario:** `Juan`
- **Clave:** `1234`

## Estado del proyecto

Este repositorio **no usa framework ni herramientas de build**. Está hecho con:

- HTML
- CSS
- JavaScript vanilla

No hay:

- `package.json`
- bundler
- linter
- test runner automatizado

## Estructura del proyecto

```text
Proyecto CHRONOS/
├── AGENTS.md
├── README.md
├── INICIO/
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── SERVICIOS/
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── shared/
│   ├── auth-session.js
│   └── ui-patterns.css
└── TIENDA/
    ├── index.html
    ├── script.js
    ├── styles.css
    └── public/
        └── images/
```

## Cómo ejecutar el proyecto en local

Desde la raíz del repositorio ejecuta:

```bash
python -m http.server 8000
```

Luego abre en el navegador alguna de estas rutas:

- Tienda: `http://localhost:8000/TIENDA/`
- Inicio / registro: `http://localhost:8000/INICIO/`
- Servicios: `http://localhost:8000/SERVICIOS/`

> El proyecto ya no usa `index.html` en la raíz. Entrá directamente por `TIENDA/`, `INICIO/` o `SERVICIOS/`.

## Cómo está organizado

### 1. TIENDA

Es la app principal de e-commerce visual.

#### Responsabilidades
- renderizar productos desde el array `products`
- clonar plantillas HTML para cards y carrito
- persistir el carrito con `localStorage`
- recalcular contador, badge y subtotal

#### Detalles importantes
- la llave de persistencia es `chronos-cart`
- `loadCart()` filtra productos inválidos o cantidades corruptas
- los assets se resuelven con `resolveAsset(...)`

### 2. INICIO

Es una vista demo de autenticación.

#### Responsabilidades
- alternar entre registro y login
- mostrar estado de bienvenida en la misma página cuando hay sesión activa
- mostrar mensajes demo en `#feedback`

#### Importante
- no existe backend
- no hay autenticación real
- los formularios solo simulan comportamiento de interfaz

### 3. SERVICIOS

Es una landing de servicios de relojería.

#### Responsabilidades
- renderizar cards desde el array `services`
- mantener atributos accesibles a partir de IDs únicos

#### Importante
- cada `services[].id` debe ser único
- `neonColor` controla el acento visual de cada card

## Convenciones del proyecto

- El contenido visible debe mantenerse en **español**.
- La estética es **premium / relojería de lujo**.
- Evita colores neón agresivos, efectos estridentes o cambios de estilo que rompan la identidad visual.
- Si agregas imágenes nuevas para tienda, ubícalas en `TIENDA/public/`.

## Verificación manual recomendada

### INICIO
- cambiar entre registro e inicio de sesión
- probar botones móviles y desktop
- enviar ambos formularios y revisar el texto de `#feedback`

### SERVICIOS
- comprobar que todas las cards aparezcan
- revisar hover states
- confirmar que no haya IDs ARIA duplicados

### TIENDA
- agregar productos al carrito
- aumentar y disminuir cantidades
- eliminar productos
- refrescar la página y validar persistencia
- revisar el estado vacío del carrito

## Notas de mantenimiento

- Mantener `services[].id` únicos para preservar `aria-labelledby` y `aria-describedby`.
- Mantener `resolveAsset(...)` en TIENDA para evitar roturas de rutas cuando se sirve desde `TIENDA/`.
- No cambiar la key `chronos-cart` en `localStorage` salvo migración explícita.
