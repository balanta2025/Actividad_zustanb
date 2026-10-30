import { useCounterStore } from '../store/useCounterStore'

export function CounterDisplay() {
  const count = useCounterStore((state) => state.count)

  return (
    <p className="counter-value" aria-live="polite">
      {count}
    </p>
  )
}

export function CounterButtons() {
  const increment = useCounterStore((state) => state.increment)
  const decrement = useCounterStore((state) => state.decrement)
  const reset = useCounterStore((state) => state.reset)

  return (
    <div className="counter-buttons">
      <button type="button" className="btn btn-secondary" onClick={decrement}>
        −1
      </button>
      <button type="button" className="btn btn-primary" onClick={increment}>
        +1
      </button>
      <button type="button" className="btn btn-secondary" onClick={reset}>
        Reiniciar
      </button>
    </div>
  )
}

export default function Counter() {
  return (
    <section className="counter-card" aria-labelledby="counter-title">
      <div>
        <span className="eyebrow">Ejercicio 1</span>
        <h2 id="counter-title">Contador compartido</h2>
        <p>
          <code>CounterDisplay</code> y <code>CounterButtons</code> usan el
          mismo store sin recibir props entre ellos.
        </p>
      </div>

      <div className="counter-controls">
        <CounterDisplay />
        <CounterButtons />
      </div>
    </section>
  )
}
