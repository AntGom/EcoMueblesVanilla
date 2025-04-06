import { getProductBySku } from "./app.js";
import { addToWishlist, isInWishlist, removeFromWishlist } from "./wishlist.js";
import { showNotification } from "./notifications.js";

const getProductSkuFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("sku");
};

// Pinta detalles de producto
const renderProductDetails = (product) => {
  if (!product) return;

  // Nombres de madera
  const woodTypeMap = {
    walnut: "nogal",
    maple: "arce",
    oak: "roble",
    pine: "pino",
    eucalyptus: "eucalipto",
    bamboo: "bambú",
    teak: "teca",
    cedar: "cedro",
  };

  // Acabados
  const finishMap = {
    dark: "oscuro",
    medium: "medio",
    light: "claro",
    natural: "natural",
  };

  document.querySelector(".product-detail__title").textContent = product.name;
  document.querySelector(".product-detail__text").textContent =
    product.description;

  const priceElement = document.querySelector(".product-detail__price");
  const price =
    product.discount_price < product.price
      ? product.discount_price
      : product.price;
  priceElement.innerHTML =
    product.discount_price < product.price
      ? `<span class="discount-price">${price}€</span>`
      : `${price}€`;

  const woodType = product.wood_type
    ? woodTypeMap[product.wood_type] || product.wood_type
    : null;
  const finish = product.finish
    ? finishMap[product.finish] || product.finish
    : null;

  const features = [
    woodType && `<li><strong>Tipo de madera:</strong> ${woodType}</li>`,
    finish && `<li><strong>Acabado:</strong> ${finish}</li>`,
    product.dimensions &&
      `<li><strong>Dimensiones:</strong> ${product.dimensions.height}cm × ${product.dimensions.width}cm × ${product.dimensions.depth}cm</li>`,
    product.weight && `<li><strong>Peso:</strong> ${product.weight}kg</li>`,
    product.stock && `<li><strong>Stock:</strong> ${product.stock}</li>`,
  ]
    .filter(Boolean)
    .join("");

  document.querySelector(".product-detail__features-list").innerHTML = features;

  const imgElement = document.querySelector(".product-detail__image--main");
  imgElement.src = product.image_path;
  imgElement.alt = product.name;
};

// Eventos de los botones de la página
const setupEventListeners = (product) => {
  if (!product) return;

  // Lista de deseos
  const wishlistButton = document.querySelector(
    ".product-detail__wishlist-button"
  );
  if (!wishlistButton) return;

  const [grayHeart, redHeart] =
    wishlistButton.querySelectorAll(".wishlist-icon");
  const textSpan = wishlistButton.querySelector("span");

  updateWishlistButton(isInWishlist(product.id), grayHeart, redHeart, textSpan);

  wishlistButton.addEventListener("click", (e) => {
    e.preventDefault();
    const isInList = isInWishlist(product.id);

    if (isInList) {
      removeFromWishlist(product.id);
      showNotification("Producto eliminado de tu lista de deseos", "info");
    } else {
      addToWishlist(
        product.id,
        product.name,
        product.discount_price < product.price
          ? product.discount_price
          : product.price,
        product.image_path,
        product.sku
      );
      showNotification("Producto añadido a tu lista de deseos", "success");
    }

    updateWishlistButton(!isInList, grayHeart, redHeart, textSpan);
  });
};

// Actualiza botón wishList
const updateWishlistButton = (isActive, grayHeart, redHeart, textSpan) => {
  if (!grayHeart || !redHeart || !textSpan) return;

  grayHeart.classList.toggle("hidden", isActive);
  redHeart.classList.toggle("hidden", !isActive);
  textSpan.textContent = isActive ? "En mi lista" : "Lista de Deseos";
};

// Inicializa página de detalles
const initProductDetail = async () => {
  if (!document.querySelector(".product-detail")) return;

  const productSku = getProductSkuFromUrl();

  if (!productSku) {
    showNotification("Producto no encontrado", "error");
    document.querySelector(".product-detail__title").textContent =
      "Producto no encontrado";
    return;
  }

  try {
    const product = await getProductBySku(productSku);
    if (!product) throw new Error("Producto no encontrado");

    renderProductDetails(product);
    setupEventListeners(product);
    document.title = `${product.name} - EcoMuebles`;
  } catch (error) {
    console.error("Error:", error);
    showNotification("Error al cargar el producto", "error");
    document.querySelector(".product-detail__title").textContent =
      "Error al cargar el producto";
  }
};

initProductDetail();
