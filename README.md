# Tienda SENA — Taller de Zustand

Aplicación de práctica del taller **Zustand en React con Vite** para el programa ADSO del SENA. Incluye contador compartido, catálogo desde una API, carrito persistente, favoritos, tema claro/oscuro, filtros compartidos y conexión del carrito a Redux DevTools.

## Tecnologías

- React 19.3.1
- Vite 8.3.5
- Zustand 5.0.16
- React Router 7
- JavaScript y JSX
- CSS con variables para tema claro/oscuro
- Puppeteer Core para la verificación automatizada de la interfaz

## Scripts

```bash
npm install
npm run dev        # servidor de desarrollo
npm run build      # compilación de producción
npm run lint       # revisión con oxlint
npm run preview    # vista previa del build
npm run test:e2e   # 22 comprobaciones de interfaz y persistencia
```

`test:e2e` usa el Chrome o Edge instalado en el equipo; no descarga un navegador. Si el navegador está en otra ruta, se puede indicar con la variable `CHROME_PATH`.

## Estructura

```text
src/
├── components/
│   ├── CartPanel.jsx
│   ├── Counter.jsx
│   ├── FilterBar.jsx
│   ├── Icons.jsx
│   ├── Navbar.jsx
│   └── ProductCard.jsx
├── pages/
│   ├── Catalog.jsx
│   └── Favorites.jsx
├── store/
│   ├── useCartStore.js
│   ├── useCounterStore.js
│   ├── useFavoritesStore.js
│   ├── useProductStore.js
│   └── useUiStore.js
├── utils/
│   └── format.js
├── App.jsx
├── index.css
└── main.jsx
```

## Funcionalidades

- Contador con dos componentes independientes que comparten `useCounterStore`.
- Catálogo con 20 productos de [Fake Store API](https://fakestoreapi.com/products).
- Estado de carga, error HTTP y reintento.
- Respaldo local `public/products.json` si la API no responde; la interfaz indica que se está usando el respaldo.
- Carrito con agregar, incrementar, disminuir, eliminar, vaciar, total de unidades y total en dinero.
- Favoritos con corazón en cada tarjeta y página `/favoritos`.
- Tema claro/oscuro aplicado al `body` y persistido.
- Filtros por texto y categoría que funcionan al mismo tiempo.
- Persistencia del carrito, los favoritos y el tema mediante `persist`.
- Acciones del carrito nombradas para Redux DevTools.

## Manejo de estado

La aplicación usa un store por dominio. Los componentes leen el estado con selectores y no reciben props para transportar datos globales.

### `useCounterStore`

- **Propósito:** demostrar que dos componentes separados comparten el mismo estado.
- **Estado:** `count`.
- **Acciones:** `increment`, `decrement`, `reset`.
- **Componentes que lo usan:** `CounterDisplay`, `CounterButtons` y `Counter`.
- **Justificación:** el ejercicio pide que los dos componentes compartan el valor sin props.
- **Persistencia:** no.
- **Backend:** no.

### `useCartStore`

- **Propósito:** administrar el carrito de compras.
- **Estado:** `items` (arreglo de `{ id, name, price, qty, ...product }`).
- **Acciones:** `addItem(product)`, `removeItem(id)`, `updateQty(id, qty)`, `clearCart()`, `totalItems()`, `totalPrice()`.
- **Componentes que lo usan:** `Navbar`, `ProductCard`, `CartPanel`.
- **Justificación:** el carrito se lee y se modifica desde ramas distintas del árbol de componentes y debe sobrevivir a una recarga.
- **Persistencia:** sí, en `localStorage` con la clave `tienda-sena-cart`; `partialize` guarda solo `items`.
- **Backend:** no. Los productos vienen de la API, pero el carrito es local.
- **DevTools:** `devtools` con el nombre `CartStore` y acciones `cart/addItem`, `cart/removeItem`, `cart/updateQty`, `cart/clear`.

### `useProductStore`

- **Propósito:** cargar el catálogo y compartir los filtros entre el formulario de búsqueda y la lista.
- **Estado:** `products`, `filteredProducts`, `categories`, `query`, `category`, `loading`, `error`, `notice`, `source`.
- **Acciones:** `fetchProducts(force)`, `setQuery(query)`, `setCategory(category)`, `clearFilters()`.
- **Componentes que lo usan:** `Catalog` y `FilterBar`.
- **Justificación:** el catálogo, la carga y los filtros son datos que necesitan dos componentes separados; además la acción asíncrona debe vivir fuera de la vista.
- **Persistencia:** no. El catálogo se vuelve a pedir al iniciar.
- **Backend:** sí. `GET {VITE_API_URL}/products` con manejo de `loading`, `error` y respaldo local.

### `useFavoritesStore`

- **Propósito:** guardar y quitar productos favoritos.
- **Estado:** `favorites`.
- **Acciones:** `toggleFavorite(product)`, `isFavorite(id)`, `clearFavorites()`.
- **Componentes que lo usan:** `ProductCard`, `Favorites`.
- **Justificación:** las tarjetas y la página `/favoritos` comparten la misma lista y debe persistir.
- **Persistencia:** sí, en `localStorage` con la clave `tienda-sena-favorites`.
- **Backend:** no.

### `useUiStore`

- **Propósito:** administrar preferencias visuales y la apertura del panel del carrito.
- **Estado:** `theme` (`light` o `dark`) y `cartOpen`.
- **Acciones:** `toggleTheme`, `openCart`, `closeCart`, `toggleCart`.
- **Componentes que lo usan:** `Navbar`, `CartPanel`, `App`.
- **Justificación:** el tema se aplica a toda la aplicación y el botón que abre el carrito está en la Navbar, mientras el panel se renderiza en `App`.
- **Persistencia:** sí, en `localStorage` con la clave `tienda-sena-ui`; `partialize` guarda solo `theme`, no `cartOpen`.
- **Backend:** no.

### Selectores

```jsx
// Un solo dato
const totalItems = useCartStore((state) =>
  state.items.reduce((acc, item) => acc + item.qty, 0),
)

// Varios datos con comparación superficial
import { useShallow } from 'zustand/react/shallow'

const { query, category, setQuery } = useProductStore(
  useShallow((state) => ({
    query: state.query,
    category: state.category,
    setQuery: state.setQuery,
  })),
)
```

No se usa `useCartStore()` sin selector. Los valores derivados del carrito se calculan con selectores para que el componente se actualice cuando cambian los items.

### Claves de persistencia

| Clave | Store | Qué guarda |
|---|---|---|
| `tienda-sena-cart` | `useCartStore` | `items` |
| `tienda-sena-favorites` | `useFavoritesStore` | `favorites` |
| `tienda-sena-ui` | `useUiStore` | `theme` |

No se guardan contraseñas, tokens ni información sensible.

## API y respaldo local

La URL se configura en `.env`:

```env
VITE_API_URL=https://fakestoreapi.com
```

`useProductStore` hace `fetch` a `${VITE_API_URL}/products`. Si la petición falla o responde un error HTTP, intenta `fetch('/products.json')` y muestra un aviso visible de que se está usando el catálogo local. Si ambos fallan, muestra el error y un botón para reintentar. El archivo `public/products.json` contiene una copia de respaldo del catálogo; no se presenta como una integración de backend.

## Redux DevTools

El store del carrito está envuelto con `devtools` en desarrollo. Para verlo:

1. Instalar la extensión Redux DevTools en Chrome o Firefox.
2. Ejecutar `npm run dev` y abrir la aplicación.
3. Abrir las herramientas de desarrollo (F12) y entrar a la pestaña Redux.
4. Seleccionar el store `CartStore`.
5. Agregar, incrementar, eliminar y vaciar productos.
6. Verificar las acciones `cart/addItem`, `cart/updateQty`, `cart/removeItem` y `cart/clear`.

La captura de pantalla es una evidencia manual porque la extensión no se ejecuta en el navegador headless de las pruebas. Los pasos están en `docs/evidencias/captura-redux-devtools.md`.

## Verificación

Resultados de la última ejecución:

- `npm run lint`: sin errores.
- `npm run build`: compilación exitosa.
- `npm run test:e2e`: 22 comprobaciones exitosas, incluyendo catálogo, carrito, persistencia, favoritos, tema y filtros.
- Navegador headless: la aplicación renderizó los 20 productos reales de Fake Store API sin errores de ejecución.

Las capturas están en `docs/evidencias/`:

- `captura-catalogo.png`
- `captura-carrito.png`
- `captura-favoritos.png`
- `captura-favoritos-dark.png`

## Documentación del taller

- `docs/PLAN_TALLER_ZUSTAND.md`: matriz de cumplimiento y lista de chequeo.
- `docs/evidencias/reflexion-inicial.md`
- `docs/evidencias/diagnostico.md`
- `docs/evidencias/analisis-proyecto.md`
- `docs/evidencias/preguntas-comprobacion.md`
- `docs/ANALISIS_ESTADO_GLOBAL.md`: auditoría del proyecto formativo y bloqueo de la transferencia.
- `docs/INFORME_FINAL_TALLER.md`: informe final, pruebas y pendientes.

## Estado de la Parte B

La transferencia al proyecto formativo quedó documentada como **bloqueada**. En el equipo no hay un frontend React de ProyecTwin con autenticación y backend reales: la aplicación Angular usa usuarios simulados y el backend Laravel no tiene rutas de login ni de dominio. No se inventaron endpoints ni una autenticación paralela. Los requisitos para desbloquearla están en `docs/ANALISIS_ESTADO_GLOBAL.md`.

## Autor

Juan Pablo Chamizo — Aprendiz ADSO, SENA.
