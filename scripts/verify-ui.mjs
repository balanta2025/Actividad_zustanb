import { spawn } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const port = 4180
const baseUrl = `http://localhost:${port}`
const chromePaths = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
]
const executablePath = chromePaths.find(
  (candidate) => candidate && existsSync(candidate),
)

if (!executablePath) {
  console.error('No se encontró Chrome ni Edge para ejecutar la verificación.')
  process.exit(1)
}

const evidenceDir = path.join(root, 'docs', 'evidencias')
mkdirSync(evidenceDir, { recursive: true })

const results = []
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function check(name, condition, detail = '') {
  const ok = Boolean(condition)
  results.push({ name, ok, detail })
  console.log(`${ok ? 'OK' : 'FALLO'}  ${name}${detail ? ` — ${detail}` : ''}`)
  if (!ok) throw new Error(`Falló la comprobación: ${name}`)
}

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(baseUrl)
      if (response.ok) return
    } catch {
      await sleep(400)
    }
  }
  throw new Error('El servidor de vista previa no inició a tiempo.')
}

const server = spawn(
  process.execPath,
  [
    path.join(root, 'node_modules', 'vite', 'bin', 'vite.js'),
    'preview',
    '--port',
    String(port),
    '--strictPort',
  ],
  { cwd: root, stdio: 'ignore' },
)

let browser

try {
  await waitForServer()
  browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 1000 })

  const pageErrors = []
  page.on('pageerror', (error) => pageErrors.push(error.message))

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.product-card', { timeout: 30000 })
  await page.waitForFunction(
    () => document.querySelector('.source-note')?.textContent.includes('Fake Store API'),
    { timeout: 30000 },
  )

  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.product-card', { timeout: 30000 })

  const productCount = await page.$$eval('.product-card', (cards) => cards.length)
  check('Catálogo con los 20 productos de la API', productCount === 20, `${productCount} tarjetas`)

  const themeInitial = await page.evaluate(() => document.body.dataset.theme)
  check('Tema inicial claro', themeInitial === 'light', themeInitial)

  await page.screenshot({
    path: path.join(evidenceDir, 'captura-catalogo.png'),
    fullPage: false,
  })

  await page.click('.product-card .btn-primary')
  await page.click('.product-card .btn-primary')
  await sleep(200)

  const badgeAfterAdd = await page.$eval('.cart-badge', (badge) => badge.textContent)
  check('El badge del carrito suma unidades', badgeAfterAdd === '2', `badge ${badgeAfterAdd}`)

  await page.click('.cart-button')
  await page.waitForSelector('.cart-panel')
  await sleep(500)

  const cartItems = await page.$$eval('.cart-item', (items) => items.length)
  const cartQty = await page.$eval('.qty-control span', (node) => node.textContent)
  check('CartPanel muestra el producto agregado', cartItems === 1, `${cartItems} producto`)
  check('CartPanel muestra la cantidad', cartQty === '2', `cantidad ${cartQty}`)

  const storedCart = await page.evaluate(() => localStorage.getItem('tienda-sena-cart'))
  check('El carrito se guarda en localStorage', storedCart?.includes('"qty":2'), 'clave tienda-sena-cart')

  await page.screenshot({
    path: path.join(evidenceDir, 'captura-carrito.png'),
    fullPage: false,
  })

  await page.click('.cart-header .icon-button')
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.product-card', { timeout: 30000 })

  const badgeAfterReload = await page.$eval('.cart-badge', (badge) => badge.textContent)
  check('El carrito sobrevive a la recarga', badgeAfterReload === '2', `badge ${badgeAfterReload}`)

  await page.click('.cart-button')
  await page.waitForSelector('.cart-panel')
  await page.click('.qty-control button:first-child')
  await sleep(150)
  await page.click('.qty-control button:first-child')
  await page.waitForSelector('.cart-empty')
  check('Al llegar a cero se elimina el producto', true, 'carrito vacío')

  const storedEmptyCart = await page.evaluate(() => localStorage.getItem('tienda-sena-cart'))
  check('El carrito vacío también se persiste', storedEmptyCart?.includes('"items":[]'), 'clave tienda-sena-cart')

  await page.click('.cart-header .icon-button')
  await page.click('.product-card .favorite-button')
  await sleep(200)

  const favoritePressed = await page.$eval('.favorite-button', (button) =>
    button.getAttribute('aria-pressed'),
  )
  const storedFavorites = await page.evaluate(() =>
    localStorage.getItem('tienda-sena-favorites'),
  )
  check('El corazón marca el producto como favorito', favoritePressed === 'true')
  check('Los favoritos se guardan en localStorage', Boolean(storedFavorites), 'clave tienda-sena-favorites')

  await page.goto(`${baseUrl}/favoritos`, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.product-card')
  await sleep(500)
  const favoriteCards = await page.$$eval('.product-card', (cards) => cards.length)
  check('La página /favoritos muestra el producto', favoriteCards === 1, `${favoriteCards} tarjeta`)

  await page.screenshot({
    path: path.join(evidenceDir, 'captura-favoritos.png'),
    fullPage: false,
  })

  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.product-card')
  const favoriteCardsAfterReload = await page.$$eval(
    '.product-card',
    (cards) => cards.length,
  )
  check('Los favoritos sobreviven a la recarga', favoriteCardsAfterReload === 1)

  await page.click('.nav-actions .icon-button')
  await page.waitForFunction(() => document.body.dataset.theme === 'dark')
  const storedUi = await page.evaluate(() => localStorage.getItem('tienda-sena-ui'))
  check('El botón cambia al tema oscuro', true, 'body[data-theme="dark"]')
  check('El tema se guarda en localStorage', storedUi?.includes('"theme":"dark"'), 'clave tienda-sena-ui')
  await sleep(600)

  await page.screenshot({
    path: path.join(evidenceDir, 'captura-favoritos-dark.png'),
    fullPage: false,
  })

  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.product-card')
  await page.waitForFunction(() => document.body.dataset.theme === 'dark')
  check('El tema oscuro sobrevive a la recarga', true)

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.product-card', { timeout: 30000 })
  await page.type('#search', 'jacket')
  await sleep(300)

  const filteredCount = await page.$$eval('.product-card', (cards) => cards.length)
  check('El filtro por texto reduce los resultados', filteredCount > 0 && filteredCount < 20, `${filteredCount} resultados`)

  await page.select('#category', "men's clothing")
  await sleep(200)
  const combinedCount = await page.$$eval('.product-card', (cards) => cards.length)
  check('Los filtros de texto y categoría funcionan juntos', combinedCount >= 1, `${combinedCount} resultados`)

  await page.$eval('#search', (input) => {
    input.value = ''
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
  await page.type('#search', 'backpack')
  await sleep(200)
  const backpackCount = await page.$$eval('.product-card', (cards) => cards.length)
  check('El filtro combinado encuentra la mochila', backpackCount === 1, `${backpackCount} resultado`)

  await page.select('#category', 'jewelery')
  await page.waitForSelector('.empty-state')
  check('La búsqueda sin coincidencias muestra el estado vacío', true)

  await page.click('.filter-clear')
  await page.waitForFunction(
    () => document.querySelectorAll('.product-card').length === 20,
  )
  check('Limpiar filtros restaura los 20 productos', true)

  check('Sin errores de ejecución en la página', pageErrors.length === 0, pageErrors.join(' | '))

  console.log('')
  console.log(`Comprobaciones exitosas: ${results.length}`)
  console.log('Evidencias en docs/evidencias/')
} finally {
  if (browser) await browser.close()
  server.kill()
}
