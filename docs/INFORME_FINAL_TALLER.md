# Informe final — Taller Zustand en React con Vite

**Programa:** Tecnólogo en Análisis y Desarrollo de Software (ADSO)  
**Aprendiz:** Juan Pablo Chamizo  
**Fecha:** 30 de octubre de 2026

## 1. Resumen ejecutivo

La práctica individual **Tienda SENA** quedó implementada y verificada: contador compartido, catálogo desde Fake Store API, carrito con panel de control, favoritos, tema claro/oscuro, filtros compartidos, persistencia y conexión del carrito a Redux DevTools. El build y el lint pasan, y 22 comprobaciones automatizadas de interfaz y persistencia terminaron correctamente.

La **Parte B (transferencia al proyecto formativo)** no se pudo ejecutar: en el equipo no existe un frontend React de ProyecTwin conectado a un backend real. La aplicación Angular disponible usa usuarios simulados y `sessionStorage`; el backend Laravel solo tiene la instalación base con `GET /api/user`; la vista React existente es una sola pantalla estática sin rutas ni API. Para no inventar endpoints ni una autenticación paralela, la transferencia se documentó como bloqueada.

## 2. Actividades realizadas

- Lectura de la guía oficial (se usó el `.docx` equivalente porque el PDF no estaba en el equipo).
- Auditoría de la carpeta de trabajo y de los repositorios ProyecTwin disponibles.
- Creación del proyecto React + Vite + Zustand + React Router.
- Implementación de cinco stores.
- Implementación de catálogo, carrito, favoritos, tema y filtros.
- Respaldo local del catálogo y manejo de errores HTTP.
- Configuración de `persist` y `devtools`.
- Documentación de evidencias escritas.
- Verificación con lint, build y pruebas de interfaz con Chrome headless.
- Revisión de la lista de chequeo de 12 criterios.
- Preparación de la sustentación y de la captura manual de Redux DevTools.

## 3. Stores implementados

| Store | Estado principal | Acciones | Persistencia | Uso |
|---|---|---|---|---|
| `useCounterStore` | `count` | `increment`, `decrement`, `reset` | No | `CounterDisplay`, `CounterButtons` |
| `useCartStore` | `items` | `addItem`, `removeItem`, `updateQty`, `clearCart`, `totalItems`, `totalPrice` | Sí, `tienda-sena-cart` | `Navbar`, `ProductCard`, `CartPanel` |
| `useProductStore` | `products`, `filteredProducts`, `categories`, `query`, `category`, `loading`, `error`, `source` | `fetchProducts`, `setQuery`, `setCategory`, `clearFilters` | No | `Catalog`, `FilterBar` |
| `useFavoritesStore` | `favorites` | `toggleFavorite`, `isFavorite`, `clearFavorites` | Sí, `tienda-sena-favorites` | `ProductCard`, `Favorites` |
| `useUiStore` | `theme`, `cartOpen` | `toggleTheme`, `openCart`, `closeCart`, `toggleCart` | Sí, `tienda-sena-ui` (solo `theme`) | `Navbar`, `CartPanel`, `App` |

El carrito usa `devtools` con el nombre `CartStore` y las acciones `cart/addItem`, `cart/removeItem`, `cart/updateQty` y `cart/clear`.

## 4. Componentes modificados o creados

- `src/App.jsx`: tema global, rutas, layout y panel del carrito.
- `src/main.jsx`: `BrowserRouter`.
- `src/components/Navbar.jsx`: navegación, tema y carrito.
- `src/components/ProductCard.jsx`: favoritos, imagen con respaldo y agregar al carrito.
- `src/components/CartPanel.jsx`: cantidades, eliminación, vaciado y totales.
- `src/components/FilterBar.jsx`: búsqueda y categoría compartidas.
- `src/components/Counter.jsx`: dos componentes que comparten el contador.
- `src/components/Icons.jsx`: iconos SVG.
- `src/pages/Catalog.jsx`: carga, error, reintento, aviso de respaldo y grilla.
- `src/pages/Favorites.jsx`: página independiente de favoritos.
- `src/utils/format.js`: moneda, categorías y unidades.
- `src/index.css`: diseño responsive y variables de tema.

## 5. Funcionalidades verificadas

- La aplicación inicia en Vite.
- Zustand está instalado y los cinco stores se importan correctamente.
- El catálogo carga los 20 productos reales de Fake Store API.
- Se muestran estados de carga, error y aviso de respaldo local.
- El botón de reintento vuelve a ejecutar `fetchProducts(true)`.
- El carrito agrega, incrementa, disminuye y elimina productos.
- Al llegar a cero unidades, el producto se elimina.
- El total de unidades y el valor total se calculan correctamente.
- El carrito persiste después de recargar.
- Los favoritos se marcan con corazón, se muestran en `/favoritos` y persisten.
- El tema claro/oscuro cambia el `body` y persiste.
- Los filtros de texto y categoría funcionan solos y combinados.
- Limpiar filtros restaura los 20 productos.
- No se presentaron errores de ejecución en la página durante la prueba.
- La navegación entre catálogo y favoritos funciona con React Router.

## 6. Pruebas ejecutadas

### `npm run lint`

```text
> actividad-zustand@0.0.0 lint
> oxlint
```

Resultado: sin errores ni advertencias.

### `npm run build`

```text
vite v8.3.5 building client environment for production...
✓ 43 modules transformed.
dist/index.html                   0.60 kB │ gzip:   0.37 kB
dist/assets/index-CcCONNd3.css   14.97 kB │ gzip:   3.92 kB
dist/assets/index-B5jWuJ22.js   281.55 kB │ gzip:  88.99 kB
✓ built in 306ms
```

Resultado: compilación exitosa.

### `npm run test:e2e`

Se ejecutaron 22 comprobaciones con `puppeteer-core` y el Chrome instalado:

```text
OK  Catálogo con los 20 productos de la API — 20 tarjetas
OK  Tema inicial claro — light
OK  El badge del carrito suma unidades — badge 2
OK  CartPanel muestra el producto agregado — 1 producto
OK  CartPanel muestra la cantidad — cantidad 2
OK  El carrito se guarda en localStorage — clave tienda-sena-cart
OK  El carrito sobrevive a la recarga — badge 2
OK  Al llegar a cero se elimina el producto — carrito vacío
OK  El carrito vacío también se persiste — clave tienda-sena-cart
OK  El corazón marca el producto como favorito
OK  Los favoritos se guardan en localStorage — clave tienda-sena-favorites
OK  La página /favoritos muestra el producto — 1 tarjeta
OK  Los favoritos sobreviven a la recarga
OK  El botón cambia al tema oscuro — body[data-theme="dark"]
OK  El tema se guarda en localStorage — clave tienda-sena-ui
OK  El tema oscuro sobrevive a la recarga
OK  El filtro por texto reduce los resultados — 4 resultados
OK  Los filtros de texto y categoría funcionan juntos — 1 resultados
OK  El filtro combinado encuentra la mochila — 1 resultado
OK  La búsqueda sin coincidencias muestra el estado vacío
OK  Limpiar filtros restaura los 20 productos
OK  Sin errores de ejecución en la página
```

Las capturas generadas están en `docs/evidencias/`.

### Prueba de la API

`GET https://fakestoreapi.com/products` respondió `200` con 20 productos. El respaldo local `public/products.json` también responde `200` desde Vite.

## 7. Evidencias

| Evidencia | Ubicación | Estado |
|---|---|---|
| Catálogo funcionando | `docs/evidencias/captura-catalogo.png` | COMPLETADO |
| Carrito con cantidades y totales | `docs/evidencias/captura-carrito.png` | COMPLETADO |
| Favoritos en tema claro | `docs/evidencias/captura-favoritos.png` | COMPLETADO |
| Favoritos en tema oscuro | `docs/evidencias/captura-favoritos-dark.png` | COMPLETADO |
| Pruebas automatizadas | `scripts/verify-ui.mjs` | COMPLETADO |
| Captura de Redux DevTools | `docs/evidencias/captura-redux-devtools.png` | PENDIENTE (manual) |
| Sustentación ante el instructor | Presencial | PENDIENTE |
| Integración Parte B | Repositorio del grupo | BLOQUEADA |

## 8. Requisitos que no pudieron completarse

### 8.1 Transferencia al proyecto formativo

**Estado:** BLOQUEADO.

**Motivo:** no hay un frontend React del proyecto formativo con backend y autenticación reales en el equipo. El proyecto Angular no puede usar Zustand; el backend Laravel no tiene login ni endpoints de dominio; la vista React disponible es estática.

**Información necesaria:** repositorio React real, URL del backend, contrato de la ruta de login, al menos un endpoint de dominio, mecanismo de sesión y autorización para crear la rama y el PR. El detalle está en `docs/ANALISIS_ESTADO_GLOBAL.md`.

### 8.2 Captura de Redux DevTools

**Estado:** PENDIENTE manual.

El código está listo. La extensión Redux DevTools no se puede ejecutar dentro del navegador headless usado en las pruebas. Los pasos para tomarla están en `docs/evidencias/captura-redux-devtools.md`.

### 8.3 Sustentación

**Estado:** PENDIENTE.

Se preparó el guion y la documentación; falta la exposición ante el instructor.

## 9. Lista de chequeo de 12 criterios

La lista del PDF evalúa el **producto de transferencia**. Se indica también el avance de la práctica.

| N.° | Criterio | Estado | Observaciones |
|---|---|---|---|
| 1 | Zustand instalado y stores en `src/store/` | COMPLETADO en práctica / BLOQUEADO en producto | `zustand@5.0.16`; cinco stores |
| 2 | Mínimo dos stores tipo hook | COMPLETADO en práctica / BLOQUEADO en producto | Cinco stores con nombres descriptivos |
| 3 | Store de autenticación completo | BLOQUEADO | No hay login React ni backend real disponible |
| 4 | Acción asíncrona con backend, loading y error | COMPLETADO en práctica / BLOQUEADO en producto | `fetchProducts` con API real |
| 5 | `persist` justificado y sin datos sensibles | COMPLETADO en práctica / BLOQUEADO en producto | Carrito, favoritos y tema; sin secretos |
| 6 | Selectores en los componentes | COMPLETADO en práctica / BLOQUEADO en producto | Selectores individuales y `useShallow` |
| 7 | Actualizaciones inmutables | COMPLETADO en práctica / BLOQUEADO en producto | `map`, `filter` y spread |
| 8 | Prop drilling eliminado | COMPLETADO en práctica / BLOQUEADO en producto | Navbar, tarjetas y filtros por stores |
| 9 | Funcionalidades existentes siguen funcionando | COMPLETADO en práctica | 22 pruebas y build exitoso |
| 10 | Rama `feature/zustand`, commits y PR | PENDIENTE | Requiere el repositorio del grupo y revisión |
| 11 | README con "Manejo de estado" | COMPLETADO en práctica / BLOQUEADO en producto | Documentado en `README.md` |
| 12 | Sustentación clara de cada store | PENDIENTE | Guion preparado; falta exponer |

## 10. Guion breve para la sustentación

1. Explicar el problema del prop drilling con el ejemplo del edificio.
2. Mostrar `useCounterStore` y cómo `CounterDisplay` y `CounterButtons` comparten `count`.
3. Mostrar `useCartStore`: agregar dos unidades, abrir `CartPanel`, incrementar, disminuir hasta cero y vaciar.
4. Recargar la página y comprobar que el carrito y el tema persisten.
5. Mostrar `useFavoritesStore` y la página `/favoritos`.
6. Mostrar `useProductStore`: buscar, filtrar por categoría y limpiar filtros.
7. Mostrar `useUiStore` y el cambio de tema.
8. Abrir Redux DevTools y explicar `cart/addItem`, `cart/updateQty`, `cart/removeItem` y `cart/clear`.
9. Explicar por qué no se inventó la autenticación de la Parte B y qué información falta.

## 11. Conclusión

La práctica individual cumple los ejercicios 1 a 5 y deja preparado el ejercicio 6. El código es funcional, verificable y está documentado. La transferencia al proyecto formativo no se puede declarar terminada sin el repositorio React y los endpoints reales; declararla completada con datos simulados sería incorrecto.
