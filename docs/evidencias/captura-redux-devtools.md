# Captura de Redux DevTools — evidencia manual

**Estado:** PENDIENTE. El código está implementado, pero la captura requiere instalar la extensión en el navegador y hacerla manualmente.

## Requisitos

- Chrome o Firefox con la extensión **Redux DevTools** instalada.
- Ejecutar la aplicación con `npm run dev`.

## Pasos

1. Abrir la aplicación en `http://localhost:5173`.
2. Presionar `F12` y entrar a la pestaña **Redux**.
3. En el selector de instancias, escoger **CartStore**.
4. Agregar un producto al carrito y pulsarlo dos veces para que la cantidad sea 2.
5. Abrir el carrito, incrementar una unidad, disminuir dos y vaciar el carrito.
6. En Redux DevTools revisar el historial de acciones:
   - `cart/addItem`
   - `cart/updateQty`
   - `cart/removeItem`
   - `cart/clear`
7. Verificar en la pestaña **State** que `items` cambia y que los totales se derivan de los items.
8. Tomar una captura donde se vean el nombre `CartStore`, el historial y el estado del carrito.
9. Guardarla como `docs/evidencias/captura-redux-devtools.png`.

## Qué debe mostrar la captura

- La pestaña Redux DevTools abierta.
- El store `CartStore` seleccionado.
- Al menos una acción `cart/addItem` y una `cart/updateQty` o `cart/removeItem`.
- El estado `items` con los productos y sus cantidades.
- El panel del carrito de la aplicación visible, para relacionar la acción con la interfaz.

No se incluye una captura inventada ni se afirma que la extensión fue comprobada en el navegador headless. La verificación automatizada cubre el comportamiento del store, pero no la integración visual con la extensión.
