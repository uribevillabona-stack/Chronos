const state = {
  mode: "register",
};

const registerView = document.getElementById("register-view");
const loginView = document.getElementById("login-view");
const welcomeTitle = document.getElementById("welcome-title");
const welcomeText = document.getElementById("welcome-text");
const panelSwitch = document.getElementById("panel-switch");
const feedback = document.getElementById("feedback");
const loginForm = document.getElementById("login-form");
const loginUsername = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const togglePasswordButton = document.getElementById("toggle-password");
const postLoginView = document.getElementById("post-login-view");
const postLoginUser = document.getElementById("post-login-user");
const postLoginLogout = document.getElementById("post-login-logout");
const authSession = window.ChronosAuthSession;

const modeConfig = {
  register: {
    title: "¡Bienvenido!",
    text: "Únete a nuestra comunidad y descubre todas las posibilidades que tenemos para ti.",
    action: "Iniciar sesión",
  },
  login: {
    title: "¡Hola de nuevo!",
    text: "Nos alegra verte otra vez. Ingresa tus credenciales para continuar.",
    action: "Crear cuenta",
  },
};

function renderMode() {
  const session = authSession?.readSession() ?? null;
  const isAuthenticated = Boolean(session);

  const isLogin = state.mode === "login";
  registerView.classList.toggle("is-hidden", isLogin || isAuthenticated);
  loginView.classList.toggle("is-hidden", !isLogin || isAuthenticated);
  postLoginView.classList.toggle("is-hidden", !isAuthenticated);
  feedback.hidden = isAuthenticated;

  if (isAuthenticated) {
    welcomeTitle.textContent = "Sesión activa";
    welcomeText.textContent = `Ya ingresaste como ${session.username}. Puedes continuar con tu experiencia premium o cerrar sesión.`;
    panelSwitch.hidden = true;
    postLoginUser.textContent = `Sesión activa como ${session.username}.`;
    clearLoginFeedback();
    return;
  }

  panelSwitch.hidden = false;
  const config = modeConfig[state.mode];
  welcomeTitle.textContent = config.title;
  welcomeText.textContent = config.text;
  panelSwitch.textContent = config.action;
  clearLoginFeedback();
}

function setMode(mode) {
  state.mode = mode;
  renderMode();
}

function clearInputError(input) {
  input.closest(".input-wrap")?.classList.remove("is-error");
}

function markInputError(input) {
  input.closest(".input-wrap")?.classList.add("is-error");
}

function clearLoginFeedback() {
  feedback.textContent = "";
  feedback.classList.remove("is-error");
  clearInputError(loginUsername);
  clearInputError(loginPassword);
}

function setLoginError(message, fields = []) {
  feedback.textContent = message;
  feedback.classList.add("is-error");

  fields.forEach((field) => {
    markInputError(field);
  });
}

function togglePasswordVisibility() {
  const isPassword = loginPassword.type === "password";
  loginPassword.type = isPassword ? "text" : "password";
  togglePasswordButton.textContent = isPassword ? "Ocultar" : "Ver";
  togglePasswordButton.setAttribute(
    "aria-label",
    isPassword ? "Ocultar contraseña" : "Mostrar contraseña"
  );
  togglePasswordButton.setAttribute("aria-pressed", String(isPassword));
}

panelSwitch.addEventListener("click", () => {
  setMode(state.mode === "login" ? "register" : "login");
});

document.querySelectorAll("[data-switch]").forEach((button) => {
  button.addEventListener("click", () => {
    setMode(button.dataset.switch);
  });
});

document.getElementById("register-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  feedback.textContent = `Registro listo para enviar: ${formData.get("name")} (${formData.get("email")}).`;
});

function loguear() {
  const user = loginUsername.value.trim();
  const pass = loginPassword.value;

  clearLoginFeedback();

  if (!user && !pass) {
    setLoginError("Ingresa tu usuario y tu contraseña.", [loginUsername, loginPassword]);
    return;
  }

  if (!user) {
    setLoginError("Ingresa tu usuario.", [loginUsername]);
    return;
  }

  if (!pass) {
    setLoginError("Ingresa tu contraseña.", [loginPassword]);
    return;
  }

  if (user === "Juan" && pass === "1234") {
    authSession?.saveSession(user);
    renderMode();
    return;
  }

  setLoginError("Datos incorrectos. Verifica el usuario y la contraseña.", [loginUsername, loginPassword]);
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loguear();
});

document.getElementById("forgot-password").addEventListener("click", () => {
  feedback.textContent = "Aquí podrías conectar el flujo de recuperación de contraseña.";
});

document.querySelectorAll("[data-provider]").forEach((button) => {
  button.addEventListener("click", () => {
    feedback.textContent = `Aquí podrías iniciar autenticación con ${button.dataset.provider}.`;
    feedback.classList.remove("is-error");
  });
});

[loginUsername, loginPassword].forEach((input) => {
  input.addEventListener("input", () => {
    clearInputError(input);

    if (feedback.classList.contains("is-error")) {
      feedback.textContent = "";
      feedback.classList.remove("is-error");
    }
  });
});

togglePasswordButton.addEventListener("click", togglePasswordVisibility);

postLoginLogout.addEventListener("click", () => {
  authSession?.clearSession();
  setMode("login");
});

renderMode();
