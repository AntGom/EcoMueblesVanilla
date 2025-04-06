import { showNotification } from "./app.js";

// Añadir producto al carrito
const addToCart = (id, name, price, image, sku, quantity = 1) => {
  let cart = getCart();

  // Comprobar si el producto ya está en el carrito
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    // Incrementar cantidad si ya existe
    existingItem.quantity += quantity;
  } else {
    // Añadir nuevo item si no existe
    cart.push({ id, name, price, image, sku, quantity });
  }

  // Guardar carrito
  saveCart(cart);

  showNotification(`${name} añadido al carrito`, "success");

  updateCartCounter();
};

// Eliminar producto
const removeFromCart = (id) => {
  let cart = getCart();

  // Encontrar producto
  const index = cart.findIndex((item) => item.id === id);

  if (index !== -1) {
    const productName = cart[index].name;
    cart.splice(index, 1);
    saveCart(cart);

    showNotification(`${productName} eliminado del carrito`, "info");

    updateCartCounter();

    // Si estamos en carrito, actualizar vista
    if (document.querySelector(".cart__items")) {
      displayCart();
    }
  }
};

// Actualizar cantidad de producto en carrito
const updateCartItemQuantity = (id, quantity) => {
  let cart = getCart();

  const item = cart.find((item) => item.id === id);

  if (item) {
    // Si cantidad <= 0, eliminar producto y actualizar
    if (quantity <= 0) {
      removeFromCart(id);
      displayCart();
      return;
    }

    item.quantity = quantity;
    saveCart(cart);

    // Si estamos en carrito, actualizar UI
    if (document.querySelector(".cart__items")) {
      displayCart();
    }

    updateCartCounter();
  }
};

// Obtener productos de localStorage
const getCart = () => {
  return JSON.parse(localStorage.getItem("ecomuebles_cart") || "[]");
};

// Guardar carrito en localStorage
const saveCart = (cart) => {
  console.log("Guardando carrito:", cart);
  localStorage.setItem("ecomuebles_cart", JSON.stringify(cart));
};

// Vaciar carrito
const clearCart = () => {
  localStorage.removeItem("ecomuebles_cart");

  updateCartCounter();

  // Si estamos en carrito, actualizar vista
  if (document.querySelector(".cart__items")) {
    displayCart();
  }

  showNotification("Carrito vaciado correctamente", "info");
};

// Actualizar contador del carrito en navbar
const updateCartCounter = () => {
  const cart = getCart();
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Buscar el elemento del contador
  const cartCounter = document.querySelector(".cart-counter");

  if (cartCounter) {
    cartCounter.textContent = totalItems;
    cartCounter.style.display = totalItems > 0 ? "block" : "none";
  }
};

// Mostrar productos del carrito en la página
const displayCart = () => {
  const cartItemsContainer = document.querySelector(".cart__items");
  if (!cartItemsContainer) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <p>Tu carrito está vacío</p>
        <a href="products.html" class="button button--primary">Ver productos</a>
      </div>
    `;
    updateCartSummary();
    return;
  }

  cartItemsContainer.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item" data-id="${item.id}">
          <a href="detail.html?sku=${item.sku}">
            <img src="${item.image}" alt="${item.name}" class="cart-item__image" />
          </a>
          <div class="cart-item__details">
            <h3 class="cart-item__title">${item.name}</h3>
            <div class="cart-price__container">
              <p>Precio:</p>
              <p class="cart-item__price">${item.price} €</p>
            </div>
            <div class="cart-item__quantity">
              <label for="quantity-${item.id}" class="product-detail__quantity-label">Cant.</label>
              <input type="number" id="quantity-${item.id}" class="cart-item__quantity-input" name="quantity" min="1" value="${item.quantity}" data-id="${item.id}" />
              <button class="cart-item__remove" data-id="${item.id}">
                <img src="../img/basurojo.svg" alt="Eliminar" class="cart-item__remove-icon" />
              </button>
            </div>
          </div>
        </div>
      `
    )
    .join("");

  // Añadir event listeners
  document.querySelectorAll(".cart-item__remove").forEach((button) => {
    button.addEventListener("click", function () {
      const id = this.dataset.id;
      removeFromCart(id);
    });
  });

  document.querySelectorAll(".cart-item__quantity-input").forEach((input) => {
    input.addEventListener("change", function () {
      const id = this.dataset.id;
      const quantity = parseInt(this.value);
      updateCartItemQuantity(id, quantity);
    });
  });

  updateCartSummary();
};

// Actualizar el resumen del carrito
const updateCartSummary = () => {
  const summaryContainer = document.querySelector(".cart__summary");
  if (!summaryContainer) return;

  const cart = getCart();

  // Cálculo subtotal
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Cálculo coste de envío
  const shipping = subtotal > 100 ? 0 : 9.99;

  // Cálculo total
  const total = subtotal + shipping;

  // Obtener elementos subtotal, shipping y total
  const subtotalElement = summaryContainer.querySelector(".subtotal");
  const shippingElement = summaryContainer.querySelector(".shipping");
  const totalElement = summaryContainer.querySelector(
    ".cart__summary-row--total span:last-child"
  );

  // Asignar valores calculos elementos
  if (subtotalElement) subtotalElement.textContent = `${subtotal.toFixed(2)} €`;
  if (shippingElement)
    shippingElement.textContent =
      shipping === 0 ? "Gratis" : `${shipping.toFixed(2)} €`;
  if (totalElement) totalElement.textContent = `${total.toFixed(2)} €`;

  // Deshabilitar checkout si no productos en carrito
  const checkoutButton = summaryContainer.querySelector(".cart__checkout");
  if (checkoutButton) {
    checkoutButton.disabled = cart.length === 0;
  }
};

// Guardar pedido en localStorage
const saveOrder = (cart) => {
  const orderDate = new Date().toLocaleString();
  // Función para asignar un estado aleatorio
  const getRandomStatus = () => {
    const statuses = ["Pendiente", "Entregado", "Cancelado"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const order = {
    orderId: Math.random().toString(36).slice(2, 9),
    date: orderDate,
    status: getRandomStatus(),
    items: cart,
    totalAmount: cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ),
  };

  const previousOrders = JSON.parse(
    localStorage.getItem("ecomuebles_orders") || "[]"
  );
  previousOrders.push(order);

  localStorage.setItem("ecomuebles_orders", JSON.stringify(previousOrders));
};

// Inicializar la página del carrito
updateCartCounter();

if (document.querySelector(".cart__items")) {
  displayCart();
}

// Evento de checkout
const checkoutButton = document.querySelector(".cart__checkout");
if (checkoutButton) {
  checkoutButton.addEventListener("click", () => {
    const cart = getCart();

    if (cart.length > 0) {
      // Guardar pedido en localStorage
      saveOrder(cart);

      alert(
        "¡Gracias por tu compra! Esta función estaría conectada con un sistema de pagos en una aplicación real."
      );

      clearCart();
      window.location.href = "profile.html#order";
    }
  });
}

// Añadir producto desde página de detalle
const addToCartButtons = document.querySelectorAll(
  ".product-detail__add-to-cart"
);
addToCartButtons.forEach((button) => {
  button.addEventListener("click", function (e) {
    e.preventDefault();

    const productTitle = document.querySelector(
      ".product-detail__title"
    ).textContent;
    const productPrice = parseFloat(
      document.querySelector(".product-detail__price").textContent
    );
    const productImage = document.querySelector(
      ".product-detail__image--main"
    ).src;
    const quantity = parseInt(
      document.querySelector(".product-detail__quantity-input").value
    );
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("sku");
    const productSku = productId;

    addToCart(
      productId,
      productTitle,
      productPrice,
      productImage,
      productSku,
      quantity
    );
  });
});

export {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  getCart,
  clearCart,
};
