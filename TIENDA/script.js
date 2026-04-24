const scriptElement =
  document.currentScript || document.querySelector('script[src*="TIENDA/script.js"], script[src$="/script.js"], script[src="./script.js"]')
const scriptUrl = new URL(scriptElement ? scriptElement.src : window.location.href, window.location.href)
const resolveAsset = (relativePath) => new URL(relativePath, scriptUrl).href

const products = [
  {
    id: 1,
    name: "Seiko Premier Bicolor Chronograph",
    price: 780000,
    image: resolveAsset("./public/images/catalog-watch-1.jpg"),
  },
  {
    id: 2,
    name: "Hamilton Viewmatic Open Heart",
    price: 1250000,
    image: resolveAsset("./public/images/catalog-watch-2.jpg"),
  },
  {
    id: 3,
    name: "Tissot Classic Silver Chronograph",
    price: 690000,
    image: resolveAsset("./public/images/catalog-watch-3.jpg"),
  },
  {
    id: 4,
    name: "Fossil Gold Dial Chronograph",
    price: 540000,
    image: resolveAsset("./public/images/catalog-watch-4.jpg"),
  },
  {
    id: 5,
    name: "Classic Roman Silver Dress Watch",
    price: 610000,
    image: resolveAsset("./public/images/catalog-watch-5.jpg"),
  },
  {
    id: 6,
    name: "Heritage Brown Leather Driver",
    price: 470000,
    image: resolveAsset("./public/images/catalog-watch-6.jpg"),
  },
]

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
})

const authSession = window.ChronosAuthSession
const storageKey = "chronos-cart"
const productMap = new Map(products.map((product) => [product.id, product]))
const productIds = new Set(products.map((product) => product.id))

const state = {
  cart: loadCart(),
}

const productGrid = document.querySelector("#productGrid")
const productCount = document.querySelector("#productCount")
const cartItems = document.querySelector("#cartItems")
const cartCount = document.querySelector("#cartCount")
const cartBadge = document.querySelector("#cartBadge")
const cartSubtotal = document.querySelector("#cartSubtotal")
const cartToggle = document.querySelector("#cartToggle")
const checkoutButton = document.querySelector("#checkoutButton")
const productTemplate = document.querySelector("#productCardTemplate")
const cartItemTemplate = document.querySelector("#cartItemTemplate")
const cartPanel = document.querySelector(".cart-panel")
const authLink = document.querySelector("#authLink")
const accountMenu = document.querySelector("#accountMenu")
const accountToggle = document.querySelector("#accountToggle")
const accountPanel = document.querySelector("#accountPanel")
const authStatus = document.querySelector("#authStatus")
const logoutButton = document.querySelector("#logoutButton")
const accountPanelAutoCloseMs = 4000

let accountPanelTimer = null

function clearAccountPanelTimer() {
  if (accountPanelTimer) {
    window.clearTimeout(accountPanelTimer)
    accountPanelTimer = null
  }
}

function scheduleAccountPanelClose() {
  clearAccountPanelTimer()
  accountPanelTimer = window.setTimeout(() => {
    closeAccountPanel()
  }, accountPanelAutoCloseMs)
}

function closeAccountPanel() {
  clearAccountPanelTimer()
  accountPanel.classList.remove("is-open")
  accountToggle.setAttribute("aria-expanded", "false")
}

function toggleAccountPanel() {
  const isOpening = !accountPanel.classList.contains("is-open")

  if (!isOpening) {
    closeAccountPanel()
    return
  }

  accountPanel.hidden = false
  requestAnimationFrame(() => {
    accountPanel.classList.add("is-open")
    accountToggle.setAttribute("aria-expanded", "true")
  })

  scheduleAccountPanelClose()
}

function renderAuthUI() {
  const session = authSession?.readSession() ?? null

  if (!session) {
    authLink.textContent = "Iniciar sesión / Registro"
    authLink.href = "../INICIO/index.html"
    accountMenu.hidden = true
    closeAccountPanel()
    accountPanel.hidden = true
    return
  }

  authLink.textContent = "Mi acceso"
  authLink.href = "../INICIO/index.html"
  accountMenu.hidden = false
  accountPanel.hidden = false
  authStatus.textContent = `Hola, ${session.username}`
  closeAccountPanel()
}

function loadCart() {
  try {
    const raw = localStorage.getItem(storageKey)
    const parsed = raw ? JSON.parse(raw) : []

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .filter((item) => {
        return productIds.has(item.id) && Number.isInteger(item.quantity) && item.quantity > 0
      })
      .map((item) => {
        const product = productMap.get(item.id)

        return {
          ...product,
          quantity: item.quantity,
        }
      })
  } catch {
    return []
  }
}

function saveCart() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state.cart))
  } catch {
    // Ignore storage failures so the UI keeps working in restricted browsers.
  }
}

function renderProducts() {
  productGrid.innerHTML = ""
  productCount.textContent = String(products.length)

  products.forEach((product) => {
    const fragment = productTemplate.content.cloneNode(true)
    const card = fragment.querySelector(".product-card")
    const image = fragment.querySelector(".product-image")
    const name = fragment.querySelector(".product-name")
    const price = fragment.querySelector(".product-price")
    const addButton = fragment.querySelector(".add-button")

    image.src = product.image
    image.alt = product.name
    image.loading = "lazy"
    image.decoding = "async"
    name.textContent = product.name
    price.textContent = currency.format(product.price)
    addButton.setAttribute("aria-label", `Agregar ${product.name} al carrito`)

    addButton.addEventListener("click", () => addToCart(product.id))
    card.dataset.productId = String(product.id)

    productGrid.appendChild(fragment)
  })
}

function renderCart() {
  cartItems.innerHTML = ""

  if (state.cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <div>
          <strong>Tu carrito está vacío</strong>
          <span>Agrega un reloj para empezar tu pedido.</span>
        </div>
      </div>
    `
  } else {
    state.cart.forEach((item) => {
      const fragment = cartItemTemplate.content.cloneNode(true)
      const image = fragment.querySelector(".cart-item-image")
      const name = fragment.querySelector(".cart-item-name")
      const price = fragment.querySelector(".cart-item-price")
      const quantity = fragment.querySelector(".qty-value")
      const decrease = fragment.querySelector('[data-action="decrease"]')
      const increase = fragment.querySelector('[data-action="increase"]')
      const remove = fragment.querySelector(".remove-button")

      image.src = item.image
      image.alt = item.name
      image.loading = "lazy"
      image.decoding = "async"
      name.textContent = item.name
      price.textContent = currency.format(item.price * item.quantity)
      quantity.textContent = String(item.quantity)
      quantity.setAttribute("aria-label", `Cantidad: ${item.quantity}`)
      decrease.setAttribute("aria-label", `Reducir cantidad de ${item.name}`)
      increase.setAttribute("aria-label", `Aumentar cantidad de ${item.name}`)
      remove.setAttribute("aria-label", `Eliminar ${item.name} del carrito`)

      decrease.addEventListener("click", () => updateQuantity(item.id, item.quantity - 1))
      increase.addEventListener("click", () => updateQuantity(item.id, item.quantity + 1))
      remove.addEventListener("click", () => removeFromCart(item.id))

      cartItems.appendChild(fragment)
    })
  }

  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  cartCount.textContent = String(totalItems)
  cartBadge.textContent = `${totalItems} ${totalItems === 1 ? "artículo" : "artículos"}`
  cartSubtotal.textContent = currency.format(subtotal)
  checkoutButton.disabled = state.cart.length === 0
  cartPanel.hidden = state.cart.length === 0
  cartToggle.disabled = state.cart.length === 0
  cartToggle.setAttribute(
    "aria-label",
    state.cart.length === 0 ? "Carrito vacío" : "Abrir carrito"
  )
}

function addToCart(productId) {
  const product = products.find((entry) => entry.id === productId)
  if (!product) return

  const existing = state.cart.find((item) => item.id === productId)

  if (existing) {
    existing.quantity += 1
  } else {
    state.cart.push({ ...product, quantity: 1 })
  }

  saveCart()
  renderCart()
}

function updateQuantity(productId, nextQuantity) {
  if (nextQuantity < 1) {
    removeFromCart(productId)
    return
  }

  state.cart = state.cart.map((item) =>
    item.id === productId ? { ...item, quantity: nextQuantity } : item
  )

  saveCart()
  renderCart()
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.id !== productId)
  saveCart()
  renderCart()
}

cartToggle.addEventListener("click", () => {
  if (cartPanel.hidden) {
    return
  }

  cartPanel.scrollIntoView({ behavior: "smooth", block: "start" })
  cartPanel.focus({ preventScroll: true })
})

checkoutButton.addEventListener("click", () => {
  if (state.cart.length === 0) {
    window.alert("Tu carrito está vacío.")
    return
  }

  window.alert("Pedido listo. Esta demo no procesa pagos reales.")
})

logoutButton.addEventListener("click", () => {
  authSession?.clearSession()
  renderAuthUI()
})

accountToggle.addEventListener("click", () => {
  toggleAccountPanel()
})

document.addEventListener("click", (event) => {
  if (accountMenu.hidden) {
    return
  }

  if (!accountMenu.contains(event.target)) {
    closeAccountPanel()
  }
})

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && accountMenu.hidden === false) {
    closeAccountPanel()
  }
})

renderAuthUI()
renderProducts()
renderCart()
