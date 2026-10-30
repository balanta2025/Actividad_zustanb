# Diagnóstico de conocimientos previos

## 1. ¿Qué es el estado de un componente en React y para qué sirve `useState`?

El estado es la información que un componente recuerda entre renderizados y que puede cambiar con la interacción del usuario o con una respuesta del servidor. `useState` es el hook que permite declarar una variable de estado y una función para actualizarla. Por ejemplo, en un componente se puede guardar si un modal está abierto:

```jsx
const [abierto, setAbierto] = useState(false)
```

Cambiar el estado con `setAbierto(true)` hace que React vuelva a ejecutar el componente y actualice la interfaz. El estado es privado del componente que lo declara; si otro componente lo necesita, hay que pasarlo por props o moverlo a un estado compartido.

## 2. ¿Cuál es la diferencia entre props y estado?

Las props son datos que un componente recibe desde el padre. Son de solo lectura para el componente que las recibe y sirven para reutilizarlo con valores distintos. El estado es información propia del componente, se declara con `useState` y el propio componente decide cuándo cambiarla. Una prop se cambia desde el padre; un estado se cambia desde el componente que lo posee, mediante su función actualizadora. En Tienda SENA, el producto que recibe `ProductCard` es una prop; la cantidad de unidades del carrito es estado global porque la comparten varios componentes.

## 3. ¿Qué sucede con un componente cuando su estado cambia?

Cuando se actualiza el estado, React programa un nuevo renderizado del componente y de sus hijos que correspondan. React no borra y vuelve a crear el DOM completo: compara el resultado anterior con el nuevo (reconciliación) y aplica solo los cambios necesarios. Los efectos que dependen de ese valor pueden volver a ejecutarse si están declarados con las dependencias correctas. En Zustand pasa algo similar: los componentes suscritos a la parte del store que cambió se vuelven a renderizar; los que no la usan no deberían hacerlo.

## 4. ¿Ha usado `useContext` o la Context API? Si es así, describa brevemente para qué.

En el código revisado del proyecto formativo no se utiliza `useContext` para compartir estado. La versión Angular usa servicios con `signal` y `sessionStorage` (`auth.service.ts`, `fichas.service.ts`, `transferencia.service.ts`) y la versión React disponible es una vista estática. En esta práctica se resolvió el estado compartido con Zustand.

Context API sirve para pasar un valor a un árbol de componentes sin ir pasándolo por cada nivel. Se crea un contexto con `createContext`, se envuelve el árbol con un `Provider` y los componentes que lo necesitan usan `useContext`. Es útil para datos que cambian poco, como el tema o el idioma; cuando hay muchos cambios frecuentes, todos los consumidores del contexto pueden renderizarse y por eso Zustand con selectores suele ser más eficiente.

## 5. ¿Qué es `localStorage` y qué tipo de datos puede guardar?

`localStorage` es un almacenamiento del navegador que guarda pares clave-valor como texto y conserva la información después de recargar o cerrar la pestaña. Está asociado al origen (protocolo, dominio y puerto), por lo que no se comparte entre sitios distintos. Se puede usar así:

```js
localStorage.setItem('tienda-sena-cart', JSON.stringify(items))
const items = JSON.parse(localStorage.getItem('tienda-sena-cart') ?? '[]')
```

Solo guarda cadenas, así que los objetos y arreglos se convierten con `JSON.stringify` y se recuperan con `JSON.parse`. Tiene un límite aproximado de 5 MB por origen y su acceso es síncrono. No se deben guardar contraseñas, tokens sensibles ni datos personales que no sean necesarios, porque cualquier script de la página puede leerlos. En esta práctica Zustand usa `localStorage` mediante `persist` para el carrito, los favoritos y el tema.

## 6. Escriba el comando para crear un proyecto React con Vite.

```bash
npm create vite@latest tienda-sena -- --template react
cd tienda-sena
npm install
npm run dev
```

El primer comando crea el proyecto con la plantilla de React en JavaScript. Luego se entra a la carpeta, se instalan las dependencias y se inicia el servidor de desarrollo. Para este taller además se instaló Zustand con `npm install zustand` y React Router con `npm install react-router-dom`.
