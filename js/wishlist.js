import { showNotification } from "./app.js";
import { addToCart } from "./cart.js";

// Añade un producto a la lista
// SUGERENCIA: La función addToWishlist podría implementar un sistema de eventos
const addToWishlist = (id, name, price, image, sku) => {
  // Si ya está en wishlist, no hacer nada
  if (isInWishlist(id)) {
    return false;
  }

  let wishlist = getWishlist();

  // Añadir nuevo item
  wishlist.push({
    id,
    name,
    price,
    image,
    sku,
    addedAt: new Date().toISOString(),
  });

  // Guardar wishlist actualizada
  saveWishlist(wishlist);

  return true;
};

//Elimina producto de la lista
// OBSERVACIÓN: La función removeFromWishlist podría incluir confirmación del usuario
const removeFromWishlist = (id) => {
  let wishlist = getWishlist();

  // Encontrar producto
  const index = wishlist.findIndex((item) => item.id === id);

  if (index !== -1) {
    wishlist.splice(index, 1);
    saveWishlist(wishlist);

    // Si estamos en wishlist, actualizar UI
    if (document.querySelector(".favorites__grid")) {
      displayWishlist();
    }

    return true;
  }

  return false;
};

// Comprueba si producto es en la lista
// SUGERENCIA: La función isInWishlist podría beneficiarse de un sistema de caché
const isInWishlist = (id) => {
  const wishlist = getWishlist();
  return wishlist.some((item) => item.id === id);
};

// Obtiene lista de localStorage
// OBSERVACIÓN: La función getWishlist podría implementar un sistema de versionado
const getWishlist = () => {
  return JSON.parse(localStorage.getItem("ecomuebles_wishlist") || "[]");
};

// Guarda lista en localStorage
// SUGERENCIA: La función saveWishlist podría implementar un sistema de backup
const saveWishlist = (wishlist) => {
  localStorage.setItem("ecomuebles_wishlist", JSON.stringify(wishlist));
};

// Muestra los productos de la lista
// OBSERVACIÓN: La función displayWishlist podría separar la lógica de renderizado
const displayWishlist = () => {
  const wishlistContainer = document.querySelector(".favorites__grid");
  if (!wishlistContainer) return;

  const wishlist = getWishlist();

  if (wishlist.length === 0) {
    wishlistContainer.innerHTML = `
            <div class="wishlist-empty">
                <p>Tu lista de deseos está vacía</p>
                <a href="products.html" class="button button--primary">Ver productos</a>
            </div>
        `;
    return;
  }

  wishlistContainer.innerHTML = wishlist
    .map(
      (item) => `
    <article class="favorite-card" data-id="${item.id}">
        <div class="favorite-card__image-container">
            <a href="detail.html?sku=${item.sku}"> 
                <img src="${item.image}" alt="${item.name}" class="favorite-card__image" />
            </a>
        </div>
        <div class="favorite-card__content">
            <h3 class="favorite-card__title">${item.name}</h3>
            <p class="favorite-card__price">${item.price}€</p>
            <div class="favorite-card__actions">
                <button class="button button--primary product-detail__add-to-cart add-to-cart-btn" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-sku="${item.sku}" data-image="${item.image}">
                    <img src="../img/logo-carrito-plus.png" alt="añadir carrito" />Añadir
                </button>
                <img src="../img/basurojo.svg" alt="Eliminar" class="button__icon remove-wishlist-btn" data-id="${item.id}" />
            </div>
        </div>
    </article>`
    )
    .join("");

  // Event listeners a botones eliminar
  // SUGERENCIA: Los event listeners podrían manejarse de forma más declarativa
  document.querySelectorAll(".remove-wishlist-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      removeFromWishlist(id);
      showNotification("Producto eliminado de tu lista de deseos", "info");
      displayWishlist();
    });
  });

  // Event listeners a botones de añadir al carrito
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      const name = this.getAttribute("data-name");
      const price = parseFloat(this.getAttribute("data-price"));
      const image = this.getAttribute("data-image");
      const sku = this.getAttribute("data-sku");

      addToCart(id, name, price, image, sku);
    });
  });
};

// Inicializar la página de wishlist
// OBSERVACIÓN: La función initWishList podría implementar un patrón Factory
const initWishList = () => {
  // Si estamos en la página de wishlist, mostrar productos
  if (document.querySelector(".favorites__grid")) {
    displayWishlist();
  }
};
initWishList();

export { addToWishlist, removeFromWishlist, isInWishlist, getWishlist };
