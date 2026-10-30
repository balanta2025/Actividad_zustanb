# Preguntas de comprobación (sección 3.3.13)

## 1. ¿Qué diferencia hay entre `set({ count: 0 })` y `set((state) => ({ count: state.count + 1 }))`? ¿Cuándo se usa cada uno?

`set({ count: 0 })` asigna un valor fijo y no necesita leer el estado anterior. Se usa cuando el nuevo valor ya se conoce, por ejemplo al reiniciar el contador o al vaciar el carrito. `set((state) => ({ count: state.count + 1 }))` recibe una función que recibe el estado actual y calcula el siguiente valor. Se usa cuando la actualización depende del valor anterior, como incrementar una cantidad o agregar un elemento a un arreglo. La forma con función evita trabajar con una copia vieja del estado cuando hay varias actualizaciones seguidas. En Zustand, `set` combina el objeto retornado con el estado actual en el primer nivel, así que no hay que volver a escribir las demás propiedades.

## 2. ¿Por qué no se debe escribir `state.items.push(producto)` dentro de una acción?

Porque `push` modifica el arreglo original en el mismo lugar y mantiene la misma referencia. Zustand y React comparan referencias para decidir si el estado cambió; si el arreglo es el mismo objeto, pueden no detectar el cambio y los componentes suscritos no se actualizan. Además se rompe el principio de inmutabilidad y el historial de Redux DevTools pierde sentido, porque no hay versiones distintas del estado. Lo correcto es crear un arreglo nuevo:

```js
addItem: (producto) =>
  set((state) => ({ items: [...state.items, producto] }))
```

Para modificar o eliminar se usan `map` y `filter`, que también devuelven arreglos nuevos.

## 3. Explique por qué `const store = useCartStore()` puede causar renderizados innecesarios.

Porque sin selector el hook se suscribe a todo el store. Cualquier cambio en cualquier parte del estado del carrito hace que el componente vuelva a renderizarse, aunque solo use una parte o aunque solo use una acción. Por ejemplo, si cambia el tema o se agrega un producto, un componente que solo quería leer `totalPrice` se renderiza igual. En Zustand 5 se recomienda seleccionar cada dato:

```js
const items = useCartStore((state) => state.items)
const addItem = useCartStore((state) => state.addItem)
```

Así el componente solo se vuelve a renderizar cuando cambia el valor seleccionado. Si se necesitan varios valores, se puede usar `useShallow`.

## 4. ¿Para qué sirve `useShallow`?

`useShallow` sirve para comparar de forma superficial el resultado de un selector que devuelve un objeto o un arreglo. Sin él, un selector como `(state) => ({ items: state.items, addItem: state.addItem })` crea un objeto nuevo en cada lectura; Zustand compara con `Object.is` y puede interpretar que siempre cambió, provocando renderizados continuos o incluso un ciclo infinito en Zustand 5. `useShallow` compara las propiedades del objeto y evita el renderizado si son iguales:

```js
const { items, addItem } = useCartStore(
  useShallow((state) => ({ items: state.items, addItem: state.addItem })),
)
```

Se usa para agrupar varias selecciones sin perder el control de los renderizados.

## 5. ¿Qué hace el middleware `persist` y dónde guarda la información por defecto?

`persist` envuelve el store y guarda automáticamente el estado en un almacenamiento del navegador para recuperarlo cuando la aplicación vuelve a iniciar. Por defecto usa `localStorage` y el nombre indicado en la opción `name`. En esta práctica el carrito usa la clave `tienda-sena-cart`:

```js
persist(
  (set, get) => ({ items: [], /* acciones */ }),
  {
    name: 'tienda-sena-cart',
    partialize: (state) => ({ items: state.items }),
  },
)
```

`partialize` permite guardar solo las propiedades necesarias; en el carrito se guardan los items, no las funciones. También se puede configurar `sessionStorage` u otro almacenamiento con `createJSONStorage`. No se deben guardar contraseñas ni información sensible.

## 6. Mencione dos datos que deberían ser estado local y dos que deberían ser estado global.

**Locales:**

- El texto que se escribe en un campo de búsqueda si solo lo usa ese componente. En esta práctica la búsqueda se hizo global porque el input y la lista están separados y el ejercicio pedía demostrar estado compartido, pero en un buscador aislado podría quedarse local.
- El error de carga de la imagen de una tarjeta (`imageError` en `ProductCard`) o si un modal pequeño está abierto.

**Globales:**

- El carrito de compras, porque lo leen la Navbar, las tarjetas y el panel del carrito, y debe persistir.
- El usuario autenticado o el tema de la aplicación, porque muchas pantallas necesitan el mismo valor y debe mantenerse entre recargas.
