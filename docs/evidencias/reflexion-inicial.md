# Actividad de reflexión inicial

## Situación: "El mensaje que pasa de mano en mano"

### 1. ¿Qué tiene en común la situación del edificio con la forma en que pasamos props entre componentes de React?

En el edificio, la administradora entrega el mensaje al vigilante, el vigilante al residente del segundo piso, este al del tercero y así hasta el quinto. Ninguno de los intermediarios es el destinatario, pero todos tienen que recibir el mensaje y volver a entregarlo. En React ocurre algo parecido con el prop drilling: un componente que tiene un dato lo pasa como prop a un hijo, ese hijo lo pasa a otro y así sucesivamente hasta llegar al componente que realmente lo necesita. Los componentes intermedios no usan el dato, pero su firma cambia y quedan acoplados a información que no les corresponde.

### 2. ¿Qué pasaría en el edificio si se agregan más pisos o si un intermediario olvida pasar el mensaje? ¿Qué equivale a eso en una aplicación React?

Si se agregan pisos, la cadena se hace más larga y el mensaje tarda más en llegar. Si un intermediario olvida pasarlo, el destinatario nunca se entera y la comunicación se rompe. En React, agregar niveles significa agregar más props en más componentes, con más posibilidades de escribir mal un nombre, olvidar una prop o cambiar la estructura sin actualizar todos los niveles. El resultado puede ser un valor `undefined`, una pantalla que no se actualiza o un error que es difícil de rastrear porque el problema está lejos del componente que lo muestra. También aumenta el trabajo de mantenimiento: renombrar una prop obliga a revisar toda la cadena.

### 3. ¿Qué solución propondría para el edificio? ¿Cómo se traduciría esa solución en una aplicación?

Para el edificio propondría un citófono, un tablero de anuncios o un canal directo entre la administradora y el residente, sin depender de los intermediarios. En React la traducción es un almacén de estado global: el dato vive en un lugar central y cada componente lo lee o lo modifica directamente cuando lo necesita. Con Zustand, el carrito, el tema o los filtros viven en un store; `ProductCard` puede agregar un producto y `Navbar` puede mostrar el total sin recibir props uno del otro. Context API también resuelve el problema, aunque Zustand evita el Provider y permite seleccionar solo la parte del estado que usa cada componente.

### 4. Información que varias pantallas o componentes del proyecto formativo necesitan al mismo tiempo

En la revisión del proyecto formativo disponible se identificaron estos casos reales:

1. **Usuario autenticado y rol.** En `Angular-ProyecTwin-master/src/app/services/auth.service.ts` la sesión se guarda en una señal y en `sessionStorage` con la clave `auth_user`. El header, el login y las rutas del panel necesitan saber quién entró y qué rol tiene. Hoy el servicio centraliza parte del dato, pero no hay una ruta protegida que lo valide.
2. **Ficha a la que pertenece el aprendiz.** En `Angular-ProyecTwin-master/src/app/services/fichas.service.ts` la ficha se guarda en `sessionStorage` con la clave `ficha_aprendiz`. La usan el dashboard, el detalle de ficha y la pantalla para unirse a una ficha.
3. **Proyecto y compañero seleccionados para la transferencia.** En `Angular-ProyecTwin-master/src/app/services/transferencia.service.ts` se comparten `proyecto` y `companero` mediante señales entre `nuevo-proyecto`, `analizando-proyecto` y `resultado-analisis`.
4. **Alertas y notificaciones.** En la vista React `ProyecTowin riact/PROYECTO/Poyectowin/src/Vistas/Admin/Aprendiz/Instructor/AlertasInstructor.jsx` las alertas están escritas directamente en el componente. Si el dashboard y la campana de notificaciones deben mostrar el mismo contador, ese dato tendría que compartirse.

Estos ejemplos muestran por qué conviene separar el estado global del local: la sesión, la ficha, el proyecto en curso y las alertas son datos que cruzan pantallas; en cambio, el texto de un formulario o un modal abierto pueden quedarse en el componente.
