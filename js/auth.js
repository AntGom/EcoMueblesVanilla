import { showNotification } from "./app.js";

let currentUser = null;

const initAuth = () => {
  loadCurrentUser();

  updateAuthUI();

  initLoginForm();

  initRegisterForm();
};
initAuth();

// Formulario login
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

// Formulario registro
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

// Iniciar sesión
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

// Registra un nuevo usuario
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

// Cerrar sesión
const logout = () => {
  localStorage.removeItem("ecomuebles_current_user");
  currentUser = null;

  // Redirigir a login
  window.location.href = "login.html";
};

// Carga el usuario actual del localStorage
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

// Actualiza UI según estado de autenticación
function updateAuthUI() {
  const isUserLoggedIn = isLoggedIn();

  // Mostrar/ocultar elementos según si hay un usuario logueado
  document.querySelectorAll(".nav__item").forEach((item) => {
    // Si usuario logueado
    if (
      item.querySelector(".profile-icon") ||
      item.querySelector(".log-out-icon")
    ) {
      item.style.display = isUserLoggedIn ? "block" : "none";
    }

    // Si usuario NO logueado
    if (
      item.querySelector(".log-in-icon") ||
      item.querySelector(".register-icon")
    ) {
      item.style.display = isUserLoggedIn ? "none" : "block";
    }
  });

  // Si estamos en profile y nadie logueado, redirigir a login
  if (window.location.href.includes("profile.html") && !isUserLoggedIn) {
    window.location.href = "login.html";
  }

  // Botón logout
  document.querySelectorAll(".log-out-icon").forEach((icon) => {
    icon.parentElement.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  });
}

export { login, register, logout, isLoggedIn, currentUser };
