import { isLoggedIn, currentUser } from "./auth.js";
import { showNotification } from "./notifications.js";

// Inicializar la página de perfil

  // Comprobar si estamos en la página de perfil
  function initProfile() {
    const isProfilePage = document.querySelector(".profile-main");
    if (!isProfilePage) return;
  
    // Aquí puedes poner tu lógica
    loadProfileData();
    initializeProfileEditing();
    loadOrderHistory();
  }
  
  initProfile(); // Llama a la función
  


// Carga los datos del perfil del usuario
function loadProfileData () {
  // Para mockup, usamos datos del localStorage

  if (!currentUser) return;

  // Actualizar nombre en el encabezado
  const profileName = document.querySelector(".profile-details h1");
  if (profileName) {
    profileName.textContent = currentUser.name;
  }

  // Actualizar campos del formulario
  const nameInput = document.querySelector("#nombre-apellidos");
  const emailInput = document.querySelector("#email");
  const phoneInput = document.querySelector("#telefono");
  const birthDateInput = document.querySelector("#fecha-nacimiento");

  if (nameInput) nameInput.value = currentUser.name;
  if (emailInput) emailInput.value = currentUser.email;
  if (phoneInput) phoneInput.value = currentUser.phone || "123456789";
  if (birthDateInput) birthDateInput.value = currentUser.birthDate || "";
};

// Inicia funcionalidad edición campos perfil
function initializeProfileEditing () {
  const editButton = document.querySelector(".edit-pencil");
  if (!editButton) return;

  editButton.addEventListener("click", function () {
    // Obtener inputs del formulario
    const inputs = document.querySelectorAll(".profile-form input");

    // Comprobar si están deshabilitados
    const areDisabled = inputs[0].disabled;

    // Cambiar estado
    inputs.forEach((input) => {
      input.disabled = !areDisabled;
    });

    // Cambiar imagen de lápiz
    const pencilImg = this.querySelector("img");
    if (areDisabled) {
      // Mostrar botón de guardar
      pencilImg.src = "../img/save-disk.png";

      // Enfocar primer campo
      inputs[0].focus();
    } else {
      saveProfileChanges();

      // Volver a mostrar lápiz
      pencilImg.src = "../img/icono-lapiz-editar.svg";
    }
  });
};

// Guarda cambios
const saveProfileChanges = () => {
  const nameInput = document.querySelector("#nombre-apellidos");
  const phoneInput = document.querySelector("#telefono");
  const birthDateInput = document.querySelector("#fecha-nacimiento");

  if (!nameInput) return;

  // Actualizar datos del usuario
  const updatedUser = {
    ...currentUser,
    name: nameInput.value,
    phone: phoneInput ? phoneInput.value : undefined,
    birthDate: birthDateInput ? birthDateInput.value : undefined,
  };

  // Guardar en localStorage
  localStorage.setItem("ecomuebles_current_user", JSON.stringify(updatedUser));

  // Actualizar variable global
  Object.assign(currentUser, updatedUser);

  // Actualizar nombre (H1)
  const profileName = document.querySelector(".profile-details h1");
  if (profileName) {
    profileName.textContent = updatedUser.name;
  }

  showNotification("Datos actualizados con éxito!", "success");
};

// Carga el historial de pedidos del usuario
function loadOrderHistory () {
  const ordersList = document.querySelector(".orders-list");
  if (!ordersList) return;

  const orders = JSON.parse(localStorage.getItem("ecomuebles_orders") || "[]");

  if (orders.length === 0) {
    ordersList.innerHTML = `
      <div class="no-orders">
          <p>Aún no has realizado ningún pedido.</p>
          <a href="products.html" class="button button--primary">Ver productos</a>
      </div>
    `;
    return;
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "Entregado":
        return "success";
      case "Pendiente":
        return "pending";
      case "Cancelado":
        return "canceled";
      default:
        return "";
    }
  };

  ordersList.innerHTML = orders
    .map((order) => {
      const firstItem =
        order.items && order.items.length > 0 ? order.items[0] : null;
      if (!firstItem) return ""; 

      return `
        <div class="order-card">
            <div class="order-header">
                <div class="order-num">
                    <p class="order-number">Pedido:</p>
                    <p>${order.orderId}</p>
                </div>
                <div class="status">
                    <p>Estado:</p>
                    <span class="order-status ${getStatusClass(
                      order.status
                    )}">${order.status}</span>
                </div>
                <button class="button button--primary order" data-id="${
                  order.orderId
                }">Detalles</button>
            </div>
            <div class="order-content">
                <h3>${firstItem.name}${
        order.items.length > 1 ? ` y ${order.items.length - 1} más` : ""
      }</h3>
                <img src="${firstItem.image}" alt="${firstItem.name}" />
                <div class="order-details">
                    <div class="order-date">
                        <p class="date-header">Fecha:</p>
                        <p class="date">${new Date(
                          order.date
                        ).toLocaleDateString()}</p>
                    </div>
                    <div class="order-prize">
                        <p class="prize-header">Total:</p>
                        <p class="prize-number">${order.totalAmount}€</p>
                    </div>
                </div>
            </div>
        </div>
      `;
    })
    .join("");

  document.querySelectorAll(".order-card .order").forEach((button) => {
    button.addEventListener("click", function () {
      const orderId = this.getAttribute("data-id");
      const order = JSON.parse(
        localStorage.getItem("ecomuebles_orders") || "[]"
      ).find((o) => o.orderId === orderId);

      if (!order) {
        alert("Pedido no encontrado.");
        return;
      }

      const orderDetails = `
          Pedido ID: ${order.orderId}
          Fecha: ${new Date(order.date).toLocaleDateString()}
          Estado: ${order.status}
          Productos:${order.items.map((item) => `\n -${item.name} (x${item.quantity}): ${item.price}€`)}
          Total: ${order.totalAmount}€   
        `;
      alert(orderDetails);
    });
  });
};
