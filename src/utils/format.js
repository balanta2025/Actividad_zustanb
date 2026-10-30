const currency = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

const categoryNames = {
  "men's clothing": 'Ropa de hombre',
  "women's clothing": 'Ropa de mujer',
  jewelery: 'Joyería',
  electronics: 'Electrónica',
}

export function formatCurrency(value) {
  return currency.format(value)
}

export function formatCategory(category) {
  return categoryNames[category] ?? category
}

export function formatUnits(value) {
  return `${value} ${value === 1 ? 'unidad' : 'unidades'}`
}
