# AGENTS

## Estructura real
- Este repo tiene 3 apps estáticas separadas: `INICIO/`, `SERVICIOS/` y `TIENDA/`.
- No hay package manager, build, lint, formatter ni tests automáticos.
- Ya no existe `index.html` en la raíz; los entrypoints reales son `TIENDA/`, `INICIO/` y `SERVICIOS/`.
- El flujo de auth está unificado en `INICIO/index.html`; ya no existe `INICIO/bienvenida.html`.

## Cómo correrlo
- Serví siempre desde la raíz: `python -m http.server 8000`
- URLs útiles:
  - `http://localhost:8000/TIENDA/`
  - `http://localhost:8000/INICIO/`
  - `http://localhost:8000/SERVICIOS/`

## Cableado que un agente podría romper
- `INICIO/script.js`: el único estado UI interno sigue siendo `state.mode` (`register` / `login`); si hay sesión en `localStorage`, `INICIO/index.html` muestra el estado post-login en la misma página.
- `SERVICIOS/script.js`: las cards salen del array `services` y se renderizan en `#services-grid`.
- `SERVICIOS/script.js`: cada `services[].id` debe seguir siendo único porque arma `aria-labelledby` y `aria-describedby`.
- `SERVICIOS/script.js`: `services[].neonColor` se inyecta como `--accent-color`; mantené tonos dorados cálidos, no neón agresivo.
- `TIENDA/script.js`: el catálogo sale de `products`; las cards y filas del carrito se clonan desde `#productCardTemplate` y `#cartItemTemplate`.
- `TIENDA/script.js`: el carrito persiste en `localStorage` con la key `chronos-cart`.
- `TIENDA/script.js`: `loadCart()` descarta IDs desconocidos y cantidades inválidas; si cambiás productos, no rompas esa validación.
- `TIENDA/script.js`: las imágenes usan `resolveAsset(...)`; mantené ese patrón para que las rutas sigan funcionando desde `TIENDA/`.

## Convenciones de contenido
- Mantené el copy en español salvo pedido explícito.
- Nuevos assets de tienda van en `TIENDA/public/`.
- La marca apunta a relojería premium: superficies oscuras, acentos metálicos cálidos y animaciones sutiles. Evitá estética cyber/neón.

## Verificación manual mínima
- `INICIO/`: cambiar entre registro/login desde desktop y mobile; enviar ambos formularios y verificar `#feedback`.
- `SERVICIOS/`: verificar que rendericen todas las cards y que no haya IDs ARIA duplicados.
- `TIENDA/`: agregar, aumentar, disminuir y eliminar productos; refrescar y confirmar persistencia en `localStorage`; revisar estados vacíos/deshabilitados.
