# Análisis del proyecto

## 1. Árbol de componentes de Tienda SENA (práctica implementada)

```text
App
├── Navbar
│   ├── enlaces a Catálogo y Favoritos
│   ├── botón de tema (useUiStore)
│   └── botón del carrito con contador (useCartStore)
├── Routes
│   ├── / (Catalog)
│   │   ├── FilterBar (useProductStore)
│   │   ├── ProductCard (useCartStore y useFavoritesStore)
│   │   └── Counter
│   │       ├── CounterDisplay (useCounterStore)
│   │       └── CounterButtons (useCounterStore)
│   └── /favoritos (Favorites)
│       └── ProductCard
├── footer
└── CartPanel (portal visual del carrito, useCartStore y useUiStore)
```

Los stores viven en `src/store/` y no dependen de un componente padre. `Navbar` y `ProductCard` están en ramas distintas del árbol y comparten el carrito sin pasarse props. `FilterBar` y `Catalog` están separados y comparten la búsqueda mediante `useProductStore`.

## 2. Árbol del proyecto formativo disponible

### ProyecTwin Angular (`Angular-ProyecTwin-master`)

```text
AppComponent
├── GovernmentBar
├── HeaderPrincipal
├── páginas
│   ├── Home
│   ├── Login
│   ├── Register
│   └── Aprendiz
│       ├── Dashboard
│       ├── MisProyectos
│       ├── NuevoProyecto
│       ├── DetalleProyecto
│       ├── DetalleSimilitud
│       ├── Alertas
│       ├── AnalizandoProyecto
│       ├── ResultadoAnalisis
│       ├── DetalleFicha
│       ├── UnirseFicha
│       ├── ReportarFalla
│       ├── MiPerfil
│       └── DetalleCompanero
└── servicios
    ├── AuthService
    ├── FichasService
    └── TransferenciaService
```

### ProyecTwin React (`ProyecTowin riact`)

```text
App
└── AlertasInstructor
```

Es una sola vista estática. No tiene rutas, autenticación, servicios de API ni componentes que compartan estado. No es suficiente para cumplir la transferencia.

### Backend Laravel (`ProyecTwin Laravel`)

El archivo `routes/api.php` solo define la ruta protegida `GET /api/user` con Sanctum. No hay ruta de login, registro ni endpoints de proyectos o fichas. No se puede construir un `useAuthStore` real sin inventar esas rutas.

## 3. Tabla de datos compartidos

| Dato o información | Componentes que la usan | ¿Cómo se comparte hoy? | ¿Debería ser global? |
|---|---|---|---|
| Usuario autenticado y rol | Login, header, dashboard, futuras rutas protegidas | `AuthService` con `signal` y `sessionStorage` (`auth_user`) en Angular; en la práctica no hay login | Sí. Lo necesitan varias pantallas y define permisos. Debe ser global, preferiblemente con cookie httpOnly si el backend lo permite |
| Ficha del aprendiz | Dashboard, DetalleFicha, UnirseFicha | `FichasService` con `sessionStorage` (`ficha_aprendiz`) | Sí. Es una selección que acompaña al aprendiz durante la sesión |
| Proyecto y compañero de transferencia | NuevoProyecto, AnalizandoProyecto, ResultadoAnalisis | `TransferenciaService` con señales | Sí. Es un flujo de varios pasos que comparte el mismo borrador |
| Alertas y notificaciones | Dashboard, Alertas, campana del header | Datos escritos directamente en `AlertasInstructor.jsx`; no hay store | Sí, si varias pantallas muestran el mismo contador. Los datos deberían venir del backend |
| Carrito de compras y totales | Navbar, ProductCard, CartPanel, Catalog | En la práctica: `useCartStore` con selectores | Sí. Componentes de ramas distintas necesitan el mismo dato |
| Favoritos | ProductCard y página `/favoritos` | En la práctica: `useFavoritesStore` con `persist` | Sí. La página y las tarjetas comparten la misma lista |
| Tema claro/oscuro | Navbar y `body` | En la práctica: `useUiStore` con `persist` | Sí. Es una preferencia de toda la aplicación |
| Filtros de búsqueda | FilterBar y Catalog | En la práctica: `useProductStore` | Sí, porque el input y la lista están separados y deben coordinarse |
| Contador de práctica | CounterDisplay y CounterButtons | `useCounterStore` | Sí dentro del ejercicio, para demostrar que dos componentes comparten estado |
| Error de imagen de una tarjeta | ProductCard | `useState` local | No. Solo le interesa a esa tarjeta |
| Texto que se escribe en un formulario | Componente del formulario | `useState` local | No, salvo que el formulario sea un flujo compartido entre pasos |
| Modal o panel abierto | Navbar y CartPanel | En la práctica: `useUiStore` porque el botón y el panel son componentes separados | Sí en este caso; si el botón y el panel fueran el mismo componente, podría ser local |
| Animación de carga de una tarjeta | ProductCard | `useState` local | No |

## 4. Prop drilling identificado

En la práctica, antes de usar Zustand, el total del carrito tendría que viajar así:

```text
App (items)
└── Catalog (items)
    └── ProductList (items)
        └── ProductCard (addItem)
```

Y el contador de la Navbar necesitaría otra cadena desde `App`. También `FilterBar` y `Catalog` tendrían que compartir `query` y `category` mediante props o elevando el estado al padre común. Esas cadenas son prop drilling: los componentes intermedios no usan los datos, solo los transmiten.

La solución aplicada fue mover carrito, favoritos, filtros, tema y contador a stores de Zustand. Los consumidores usan selectores:

```jsx
const totalItems = useCartStore((state) =>
  state.items.reduce((acc, item) => acc + item.qty, 0),
)
const isFavorite = useFavoritesStore((state) =>
  state.favorites.some((item) => item.id === product.id),
)
```

En el proyecto formativo Angular el prop drilling no se da por props de plantilla, pero sí existe duplicación de fuentes de verdad: el usuario se guarda en `sessionStorage`, la ficha en otra clave y el proyecto en memoria. Esos son los datos que un store global debería centralizar cuando exista una versión React conectada al backend real.

## 5. Justificación de estados globales y locales

**Globales en Tienda SENA:**

- `useCartStore`: lo usan Navbar, ProductCard y CartPanel; además debe persistir.
- `useFavoritesStore`: lo usan todas las tarjetas y una página independiente; debe persistir.
- `useProductStore`: contiene el catálogo, la carga, el error y los filtros compartidos.
- `useUiStore`: el tema se aplica a toda la aplicación y el panel del carrito se abre desde la Navbar; solo se persiste el tema.
- `useCounterStore`: el ejercicio exige que dos componentes separados compartan el mismo contador.

**Locales:**

- `imageError` en `ProductCard`: solo controla si esa tarjeta muestra la imagen o el respaldo.
- El estado de un formulario que no se comparte entre pasos.
- Un modal que solo se abre y se cierra dentro de un mismo componente.
- La selección temporal de una fila en una tabla que no se usa en otra pantalla.

La regla aplicada fue: si un dato lo necesita más de un componente que no es padre-hijo directo, o debe sobrevivir a una recarga, se evalúa como global; si solo le interesa a un componente, se queda en `useState`.
