import { showNotification } from "./app.js";

// Observación: El manejo del estado del usuario podría beneficiarse de un patrón más robusto
let currentUser = null;

const initAuth = () => {
  loadCurrentUser();

  updateAuthUI();

  initLoginForm();

  initRegisterForm();
};
initAuth();

// Observación: La validación de formularios podría ser más robusta y reutilizable
function initLoginForm() {
  const loginForm = document.querySelector(".auth-form");

  // Si no estamos en login, salir
  if (
    !loginForm ||
    !document
      .querySelector(".auth-title")
      ?.textContent.includes("Iniciar Sesión")
  )
    return;

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = this.querySelector("#email").value;
    const password = this.querySelector("#password").value;

    if (login(email, password)) {
      // Redirigir a index
      window.location.href = "../index.html";
    } else {
      showNotification(
        "Credenciales incorrectas. Por favor, inténtalo de nuevo.",
        "error"
      );
    }
  });
}

// Observación: La lógica de validación podría extraerse a funciones separadas
function initRegisterForm() {
  const registerForm = document.querySelector(".auth-form");

  // Si no estoy en registro, salir
  if (
    !registerForm ||
    !document.querySelector(".auth-title")?.textContent.includes("Crear Cuenta")
  )
    return;

  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = this.querySelector("#nombre").value;
    const email = this.querySelector("#email").value;
    const password = this.querySelector("#password").value;
    const confirmPassword = this.querySelector("#confirm-password").value;
    const termsAccepted = this.querySelector("#terms").checked;

    if (!name || !email || !password) {
      showNotification("Por favor, completa todos los campos.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showNotification("Las contraseñas no coinciden.", "error");
      return;
    }

    if (!termsAccepted) {
      showNotification("Debes aceptar los términos y condiciones.", "error");
      return;
    }

    // Crear usuario
    if (register(name, email, password)) {
      showNotification(
        "Cuenta creada correctamente. Redirigiendo...",
        "success"
      );

      // Redirigir a página principal después 1.5seg
      setTimeout(() => {
        window.location.href = "./login.html";
      }, 1500);
    }
  });
}

// Observación: La autenticación actual no es segura, debería implementarse con hash y tokens
const login = (email, password) => {
  const users = JSON.parse(localStorage.getItem("ecomuebles_users") || "[]");
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    // Guardar sesión
    localStorage.setItem(
      "ecomuebles_current_user",
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        isLoggedIn: true,
        loginTime: new Date().toISOString(),
      })
    );

    currentUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      isLoggedIn: true,
    };

    return true;
  }

  return false;
};

// Observación: El registro debería incluir validación de email y requisitos de contraseña
const register = (name, email, password) => {
  const users = JSON.parse(localStorage.getItem("ecomuebles_users") || "[]");

  // Verificar si email ya está registrado
  if (users.some((u) => u.email === email)) {
    showNotification("Este email ya está registrado.", "error");
    return false;
  }

  // Crear nuevo usuario
  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  // Guardarlo
  users.push(newUser);
  localStorage.setItem("ecomuebles_users", JSON.stringify(users));

  return true;
};

// Observación: El logout podría incluir limpieza de datos sensibles
const logout = () => {
  localStorage.removeItem("ecomuebles_current_user");
  currentUser = null;

  // Redirigir a login
  window.location.href = "../index.html";
};

// Observación: La carga del usuario podría incluir validación de sesión expirada
function loadCurrentUser() {
  const storedUser = localStorage.getItem("ecomuebles_current_user");
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
  }
}

// Comprueba si hay usuario logueado
function isLoggedIn() {
  return currentUser !== null && currentUser.isLoggedIn === true;
}

// Observación: La actualización de UI podría beneficiarse de un sistema de eventos
function updateAuthUI() {
  const isUserLoggedIn = isLoggedIn();

  const show = (selector) => {
    const el = document.querySelector(selector);
    if (el) el.style.display = "block";
  };

  const hide = (selector) => {
    const el = document.querySelector(selector);
    if (el) el.style.display = "none";
  };

  // Mostrar siempre
  show(".nav-home");
  show(".nav-products");
  show(".nav-blog");
  show(".nav-contact");

  // Mostrar SI logueado
  isUserLoggedIn ? show(".nav-wishlist") : hide(".nav-wishlist");
  isUserLoggedIn ? show(".nav-cart") : hide(".nav-cart");
  isUserLoggedIn ? show(".nav-profile") : hide(".nav-profile");
  isUserLoggedIn ? show(".nav-logout") : hide(".nav-logout");

  // Mostrar login si NO logueado
  isUserLoggedIn ? hide(".nav-login") : show(".nav-login");

  // Logout
  const logoutIcon = document.querySelector(".log-out-icon");
  if (logoutIcon) {
    logoutIcon.parentElement.addEventListener("click", function (e) {
      e.preventDefault();
      logout(); // tu función de logout
    });
  }

  // Redirigir desde páginas protegidas si NO logueado
  const protectedPages = ["profile.html", "wishList.html", "shooping-cart.html"];
  if (!isUserLoggedIn) {
    protectedPages.forEach(page => {
      if (window.location.pathname.includes(page)) {
        window.location.href = "login.html";
      }
    });
  }
}


export { login, register, logout, isLoggedIn, currentUser };
