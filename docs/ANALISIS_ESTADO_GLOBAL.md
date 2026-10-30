# Análisis de estado global del proyecto formativo

## 1. Repositorios revisados

| Ruta | Tecnología | Hallazgo principal |
|---|---|---|
| `Angular-ProyecTwin-master` | Angular 22 | Es la aplicación ProyecTwin más completa del equipo. Usa servicios con `signal`, `sessionStorage` y datos de prueba locales. No usa un backend real. |
| `ProyecTwin Laravel` | Laravel 10 + Sanctum | Backend con la instalación base de Laravel. Solo expone `GET /api/user`; no tiene rutas de login, registro, proyectos ni fichas. |
| `ProyecTowin riact/PROYECTO/Poyectowin` | React 19 + Vite | Contiene una sola vista, `AlertasInstructor`. No tiene rutas, autenticación, servicios de API ni estado compartido. |
| `ProyecTwin Daniel` | HTML/CSS | Maqueta estática, sin lógica de aplicación. |

La carpeta `Actividad Zustand` estaba vacía al iniciar; por eso allí se desarrolló la práctica independiente Tienda SENA.

## 2. Auditoría del proyecto Angular (aplicación ProyecTwin disponible)

### 2.1 `package.json`

- Angular `^22.1.0`, Angular Router `^22.1.0`, RxJS `~7.8.0`, TypeScript `~6.0.2`.
- No hay dependencia de Zustand, Axios ni un cliente HTTP configurado para un backend.
- El proyecto se ejecuta con `ng serve` y se construye con `ng build`.

### 2.2 Estructura de `src/app`

- `app.routes.ts`: rutas públicas `/`, `/login`, `/register` y rutas del aprendiz bajo `/aprendiz/...`.
- `pages/`: Home, Login, Register y las pantallas del aprendiz (dashboard, proyectos, alertas, fichas, perfil, etc.).
- `components/`: barras de gobierno, header, sidebar, paginación, campos de formulario y layout.
- `services/`: `AuthService`, `FichasService`, `TransferenciaService`.
- `data/`: arreglos locales `fichas.ts` y `proyectos.ts`.

### 2.3 Autenticación actual

`src/app/services/auth.service.ts`:

- Tiene un arreglo `USUARIOS` con tres usuarios escritos en el código.
- `login(correo, password)` compara contra ese arreglo y devuelve `{ exito, ruta }`.
- Guarda el usuario en `sessionStorage` con la clave `auth_user`.
- Expone `user` como `signal` y `isAuthenticated` como `computed`.
- `logout()` elimina `auth_user` y pone el usuario en `null`.

Esto es una autenticación simulada de frontend. No hay petición HTTP, token, cookie ni validación de sesión contra el backend.

### 2.4 Rutas protegidas

`app.routes.ts` no tiene `canActivate`, guards ni validación de sesión. Cualquier persona puede navegar a `/aprendiz/dashboard` escribiendo la URL. El `AuthService` no se consulta en las rutas.

### 2.5 Servicios de comunicación con el backend

No hay un servicio HTTP que consuma el backend Laravel. `FichasService` busca en el arreglo local `FICHAS` y guarda la ficha en `sessionStorage` con la clave `ficha_aprendiz`. `TransferenciaService` mantiene `proyecto` y `companero` en señales en memoria.

### 2.6 Datos compartidos y forma actual de compartirlos

| Dato | Componentes consumidores | Forma actual | Problema |
|---|---|---|---|
| Usuario y rol | Header, login, dashboard | `AuthService` + `sessionStorage` `auth_user`; el header también recibe `@Input() usuario` | Hay dos fuentes: el servicio y el input del padre. El rol no se usa para proteger rutas |
| Ficha del aprendiz | Dashboard, DetalleFicha, UnirseFicha | `FichasService` + `sessionStorage` `ficha_aprendiz` | Estado de sesión disperso y sin sincronización con un backend |
| Proyecto y compañero en transferencia | NuevoProyecto, AnalizandoProyecto, ResultadoAnalisis | `TransferenciaService` con señales | Vive solo en memoria; se pierde al recargar |
| Notificaciones | Header, Alertas | `@Input() notificaciones` y datos escritos en la vista | El contador y la lista pueden desincronizarse |
| Alertas | AlertasInstructor (React) | Datos escritos directamente en el JSX | No hay store ni servicio; no se pueden reutilizar en otra pantalla |

### 2.7 Prop drilling o paso indirecto identificado

En Angular no se pasan props de componente en componente como en React, pero se encontró un caso equivalente: `HeaderPrincipalComponent` recibe `usuario`, `notificaciones` y `titulo` mediante `@Input()`. El componente que lo contiene decide esos valores y el header solo los muestra; si varias pantallas necesitan el mismo usuario o contador, se repite el paso por el layout. `AuthService` tiene el usuario, pero el header no lo lee directamente para mostrarlo. Esa duplicación es la que un store de autenticación eliminaría.

En la vista React estática no hay prop drilling porque solo existe un componente. No hay nada que refactorizar allí sin inventar una aplicación.

### 2.8 Información que debería persistir y cuál no

**Debería persistir (con justificación):**

- La sesión del usuario, si el backend usa cookies httpOnly o si el equipo decide guardar un token. En este caso no hay token real, así que no se debe inventar.
- La ficha seleccionada, porque el aprendiz la consulta en varias pantallas durante la sesión.
- El borrador del proyecto de transferencia, para no perderlo al recargar.

**No debería persistir:**

- Contraseñas.
- El estado de carga o los mensajes de error.
- Datos temporales de formularios que se descartan al salir.
- Tokens de sesión en `localStorage` si el backend puede usar cookies httpOnly.

## 3. Auditoría del backend Laravel

`routes/api.php` contiene únicamente:

```php
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
```

No existen rutas para:

- Iniciar sesión o registrar usuarios.
- Listar o crear proyectos.
- Consultar fichas.
- Gestionar alertas.

`composer.json` confirma Laravel 10 y Sanctum, pero la instalación es la base del framework. `routes/web.php` solo devuelve la vista `welcome`. La base de datos está configurada para MySQL, pero no se revisaron tablas ni migraciones de dominio.

## 4. Por qué la transferencia quedó bloqueada

La guía exige:

1. Un `useAuthStore` adaptado al mecanismo real de autenticación, sin asumir `/auth/login`.
2. Un segundo store de dominio con una acción asíncrona que consuma un endpoint real.
3. Rutas protegidas que lean la sesión del store.
4. Persistencia justificada y sin datos sensibles.

Con los repositorios disponibles no se puede cumplir eso sin inventar una API o una segunda autenticación paralela, lo cual está prohibido por el propio taller. La aplicación React disponible no tiene login ni rutas; la aplicación Angular no puede consumir Zustand porque Zustand es una librería de React; el backend no tiene endpoints de autenticación ni de dominio.

### Información necesaria para desbloquear la Parte B

- Ruta o repositorio del **frontend React** del proyecto formativo (no la maqueta ni la versión Angular).
- URL del backend que consume ese frontend.
- Documentación o código de la ruta real de login: método, parámetros, respuesta y manejo de sesión (token, cookie httpOnly, Sanctum, etc.).
- Al menos un endpoint real de dominio (proyectos, fichas, propuestas o alertas) con su método y forma de respuesta.
- Confirmación de si existen rutas protegidas y cómo se validan hoy.
- Autorización para crear la rama `feature/zustand` y abrir el Pull Request en el repositorio del grupo.

Con esos datos se implementarían `useAuthStore`, `useProjectStore` (o `useFichaStore`) y `ProtectedRoute` leyendo el store, sin duplicar la autenticación existente.

## 5. Justificación de estados globales y locales para una futura integración React

**Globales:**

- `useAuthStore`: usuario, token o sesión, loading, error, login y logout. Debe ser la única fuente de verdad de la sesión.
- `useProjectStore` o `useFichaStore`: lista, selección, loading y error; incluye la acción asíncrona contra el backend.
- `useUiStore`: tema, sidebar o notificaciones visuales que se comparten entre layout y páginas.

**Locales:**

- El texto de un campo mientras se escribe, si no se comparte con otra pantalla.
- El estado abierto/cerrado de un modal que solo pertenece a un componente.
- La página actual de una tabla si no se sincroniza con la URL.
- Los errores de validación de un formulario concreto.

La regla es no convertir todo el estado de React en global: solo los datos que cruzan pantallas o deben sobrevivir a una recarga.
