const services = [
  {
    id: "reparacion-mantenimiento",
    title: "Reparación y mantenimiento",
    description:
      "Realizamos diagnóstico técnico, limpieza profunda y calibración precisa para mantener el rendimiento y la vida útil de tu reloj.",
    neonColor: "#d4af37",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="8"></circle>
        <path d="M12 8v4l2.5 2.5"></path>
        <path d="M8 3.8 6.8 2.6"></path>
        <path d="M16 3.8 17.2 2.6"></path>
      </svg>
    `,
  },
  {
    id: "restauracion-clasicos",
    title: "Restauración de clásicos",
    description:
      "Recuperamos relojes vintage respetando su valor histórico: pulido controlado, reemplazo de piezas y ajuste fino del movimiento.",
    neonColor: "#b8892d",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="7"></circle>
        <path d="M12 9v3"></path>
        <path d="M12 12h3"></path>
        <path d="M5 19l2.5-2.5"></path>
      </svg>
    `,
  },
  {
    id: "bateria-ajuste",
    title: "Batería y ajuste de precisión",
    description:
      "Cambiamos batería, ajustamos hora y fechador, y verificamos consumo energético para asegurar un funcionamiento estable.",
    neonColor: "#f1d27a",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="6" y="7" width="10" height="10" rx="2"></rect>
        <path d="M16 10h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2"></path>
        <path d="M9.5 10.5v3"></path>
        <path d="M12.5 10.5v3"></path>
      </svg>
    `,
  },
  {
    id: "correas-accesorios",
    title: "Correas y accesorios premium",
    description:
      "Personalizamos tu reloj con correas de cuero, acero o caucho y accesorios seleccionados para estilo y comodidad.",
    neonColor: "#e0bc73",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="7" y="2" width="10" height="7" rx="2"></rect>
        <rect x="7" y="15" width="10" height="7" rx="2"></rect>
        <rect x="9.5" y="9" width="5" height="6" rx="1"></rect>
      </svg>
    `,
  },
]

const authSession = window.ChronosAuthSession
const servicesGrid = document.querySelector("#services-grid")
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
    accountMenu.hidden = true
    closeAccountPanel()
    accountPanel.hidden = true
    return
  }

  accountMenu.hidden = false
  accountPanel.hidden = false
  authStatus.textContent = `Hola, ${session.username}`
  closeAccountPanel()
}

function createCard(service) {
  const item = document.createElement("li")
  item.className = "service-item"

  item.innerHTML = `
    <article
      class="service-card"
      style="--accent-color: ${service.neonColor}"
      aria-labelledby="${service.id}-title"
      aria-describedby="${service.id}-description"
    >
      <span class="accent-left" aria-hidden="true"></span>
      <span class="accent-right" aria-hidden="true"></span>
      <div class="card-shell">
        <div class="icon-frame" aria-hidden="true">
          ${service.icon}
        </div>
        <h2 id="${service.id}-title">${service.title}</h2>
        <p id="${service.id}-description">${service.description}</p>
        <span class="service-badge" aria-hidden="true">Servicio disponible</span>
      </div>
    </article>
  `

  return item
}

services.forEach((service) => {
  servicesGrid.appendChild(createCard(service))
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
