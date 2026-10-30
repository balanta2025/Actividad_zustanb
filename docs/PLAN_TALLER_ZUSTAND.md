# Plan y matriz de cumplimiento — Taller Zustand

**Programa:** Tecnólogo en Análisis y Desarrollo de Software (ADSO)  
**Aprendiz:** Juan Pablo Chamizo  
**Actividad:** Zustand en React con Vite  
**Fecha de trabajo:** 30 de octubre de 2026

## 0. Fuente y alcance

El archivo `Guia_SENA_Zustand_React_Vite guia dos.pdf` no estaba presente en el equipo. Se trabajó con el documento oficial equivalente `Guia_SENA_Zustand_React_Vite guia dos.docx`, ubicado en la carpeta de descargas, que contiene las mismas 17 páginas, actividades y criterios de evaluación.

Al iniciar, la carpeta `D:\taqlleres Juanpablochamizo\Actividad Zustand` estaba vacía. Por eso la Tienda SENA se construyó como proyecto independiente en esa misma carpeta. La Parte B (transferencia al proyecto formativo) quedó bloqueada porque no hay un proyecto React del grupo con backend y autenticación reales en el equipo; el detalle está en `docs/ANALISIS_ESTADO_GLOBAL.md`.

## 1. Matriz de actividades de la guía

| Actividad | Requisito | Implementación | Estado | Evidencia |
|---|---|---|---|---|
| Reflexión inicial | Responder las cuatro preguntas del edificio y el prop drilling | Respuestas y tres ejemplos del proyecto formativo | COMPLETADO | `docs/evidencias/reflexion-inicial.md` |
| Diagnóstico | Responder las seis preguntas de conocimientos previos | Respuestas técnicas en lenguaje de aprendiz | COMPLETADO | `docs/evidencias/diagnostico.md` |
| Análisis del proyecto | Árbol de componentes y tabla de datos compartidos | Árbol de Tienda SENA y árbol real de ProyecTwin; tabla y prop drilling | COMPLETADO | `docs/evidencias/analisis-proyecto.md` |
| Ejercicio 1 | Tienda SENA con contador, catálogo desde API, carrito, totales y persistencia | Counter con dos componentes, `useProductStore` con API y respaldo local, carrito con totales y `persist` | COMPLETADO | Código en `src/`; prueba `npm run test:e2e` |
| Ejercicio 2 | `CartPanel` con cantidades, eliminar, vaciar y totales | Panel lateral con todos los controles y regla de eliminación al llegar a cero | COMPLETADO | `src/components/CartPanel.jsx`; captura `docs/evidencias/captura-carrito.png` |
| Ejercicio 3 | Favoritos con `toggleFavorite` e `isFavorite`, corazón y página `/favoritos` | Store persistente, botón de corazón y página independiente con React Router | COMPLETADO | `src/store/useFavoritesStore.js`, `src/pages/Favorites.jsx`; captura `captura-favoritos.png` |
| Ejercicio 4 | Tema claro/oscuro persistente desde la Navbar | `useUiStore` con `persist` y `partialize`, aplicación al `body` y botón en Navbar | COMPLETADO | `src/store/useUiStore.js`, `src/App.jsx`; captura `captura-favoritos-dark.png` |
| Ejercicio 5 | Filtros compartidos por texto y categoría, en componentes separados | `FilterBar` escribe en el store y `Catalog` lee `filteredProducts`; los filtros se combinan | COMPLETADO | `src/components/FilterBar.jsx`, `src/store/useProductStore.js`; prueba e2e |
| Ejercicio 6 | Redux DevTools en el carrito y captura del historial | `devtools` integrado, acciones `cart/addItem`, `cart/removeItem`, `cart/updateQty`, `cart/clear` | PARCIAL | Código listo; la captura requiere instalar la extensión y hacerla manualmente. Ver `docs/evidencias/captura-redux-devtools.md` |
| Persistencia | Carrito y preferencias sobreviven a la recarga | Claves `tienda-sena-cart`, `tienda-sena-favorites`, `tienda-sena-ui`, con `partialize` | COMPLETADO | Comprobado en navegador automatizado; ver informe final |
| Transferencia | Integrar Zustand al proyecto formativo, eliminar prop drilling y documentar | No hay proyecto React con backend real disponible | BLOQUEADO | `docs/ANALISIS_ESTADO_GLOBAL.md` |
| README | Sección "Manejo de estado" con todos los stores | Documentación de propósito, estado, acciones, consumidores y persistencia | COMPLETADO | `README.md` |
| Evidencias escritas | Documentos de reflexión, diagnóstico, análisis y preguntas de comprobación | Cuatro documentos en `docs/evidencias/` | COMPLETADO | Ver enlaces anteriores |
| Git | Commits descriptivos en la práctica | Repositorio local con commits agrupados por avance; no se hizo push ni PR | COMPLETADO (práctica) | Historial local |
| Sustentación | Explicar los stores y demostrar la aplicación | Guion de sustentación preparado; la exposición es presencial | PENDIENTE | `docs/INFORME_FINAL_TALLER.md` |

## 2. Requisitos de la actividad de transferencia 3.4

| N.° | Requisito | Tienda SENA (práctica) | Proyecto formativo |
|---|---|---|---|
| 1 | Instalar Zustand y crear `src/store/` | COMPLETADO | BLOQUEADO: no hay proyecto React con backend real disponible |
| 2 | Mínimo dos stores, incluido `useAuthStore` o alternativa aprobada | COMPLETADO: cinco stores; no se creó auth porque la práctica no tiene login | BLOQUEADO: no hay autenticación real en el React disponible |
| 3 | Al menos una acción asíncrona con backend, loading y error | COMPLETADO con Fake Store API y respaldo local | BLOQUEADO: no se inventaron endpoints |
| 4 | Al menos un store con `persist` justificado | COMPLETADO: carrito, favoritos y preferencias | BLOQUEADO |
| 5 | Eliminar el prop drilling identificado | COMPLETADO en la práctica | BLOQUEADO |
| 6 | Rutas protegidas leyendo la sesión desde `useAuthStore` | No aplica: la práctica no tiene login | BLOQUEADO: no hay rutas protegidas ni auth real en el React disponible |
| 7 | Rama `feature/zustand`, commits y Pull Request revisado | Repositorio local en `main`; no se hizo push | BLOQUEADO/PENDIENTE: requiere repositorio del grupo y autorización |
| 8 | README con sección "Manejo de estado" | COMPLETADO | BLOQUEADO hasta integrar el proyecto |

## 3. Lista de chequeo de evaluación (12 criterios)

La lista de chequeo del PDF evalúa el producto de transferencia (el proyecto del grupo). Se registra también lo que ya está cubierto por la práctica.

| N.° | Criterio | Estado | Observación |
|---|---|---|---|
| 1 | Zustand instalado y stores en `src/store/` | COMPLETADO en práctica / BLOQUEADO en producto | `zustand@5.x` instalado; cinco stores en `src/store/` |
| 2 | Mínimo dos stores con nombres tipo hook | COMPLETADO en práctica / BLOQUEADO en producto | `useCounterStore`, `useCartStore`, `useProductStore`, `useFavoritesStore`, `useUiStore` |
| 3 | Store de autenticación con estado y acciones completas | BLOQUEADO | El proyecto disponible no tiene login React ni backend con ruta de login |
| 4 | Acción asíncrona real con loading y error | COMPLETADO en práctica / BLOQUEADO en producto | `fetchProducts` consume la API; muestra carga, error y reintento |
| 5 | `persist` justificado y sin información sensible | COMPLETADO en práctica / BLOQUEADO en producto | Solo items, favoritos y tema; no se guardan contraseñas ni tokens |
| 6 | Componentes leen con selectores | COMPLETADO en práctica / BLOQUEADO en producto | No se usa `useStore()` sin selector; `useShallow` en `FilterBar` |
| 7 | Actualizaciones inmutables | COMPLETADO en práctica / BLOQUEADO en producto | `map`, `filter` y spread en los stores |
| 8 | Prop drilling eliminado | COMPLETADO en práctica / BLOQUEADO en producto | Navbar, ProductCard y FilterBar se comunican por stores |
| 9 | Funcionalidades existentes siguen funcionando | COMPLETADO en práctica | 26 comprobaciones automatizadas y build exitoso |
| 10 | Rama `feature/zustand`, commits y PR revisado | PENDIENTE | Requiere el repositorio del grupo y revisión de otro integrante |
| 11 | README con "Manejo de estado" completo | COMPLETADO en práctica / BLOQUEADO en producto | Documentado en el README de la práctica |
| 12 | Sustentación clara de cada store | PENDIENTE | Se preparó el guion; falta la exposición ante el instructor |

## 4. Decisiones técnicas

- Se usó JavaScript y JSX, como indica la guía.
- Las versiones instaladas son React 19.3.1, Vite 8.3.5 y Zustand 5.0.16.
- La API principal es `https://fakestoreapi.com` y se configuró en `.env` con `VITE_API_URL`.
- Si la API falla, se carga `public/products.json` como respaldo y la interfaz lo informa; no se presenta como si fuera la API.
- No se agregó autenticación ficticia a la práctica ni a un proyecto que no la tiene.
- Las pruebas de interfaz usan `puppeteer-core` con el Chrome instalado; no descargan un navegador adicional.
