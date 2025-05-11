import { showNotification } from "./notifications.js";
import { updateCartCounter } from "./cart.js";

// Observación: Sería mejor tener las URLs de la API en un archivo de configuración separado
const API_URL = "https://furniture-api.fly.dev/v1/";

// Observación: La función podría beneficiarse de un mejor manejo de errores y logging
const getProducts = async (page = 1, limit = 50) => {
  try {
    const response = await fetch(
      `${API_URL}products?limit=${limit}&sort=name_asc`
    );
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
};

// Observación: Esta función podría reutilizar lógica de getProducts para evitar duplicación
const getProductBySku = async (sku) => {
  try {
    const response = await fetch(`${API_URL}products/${sku}`);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error al obtener el producto con SKU ${sku}:`, error);
    return null;
  }
};

// Observación: La función podría beneficiarse de un sistema de caché para mejorar el rendimiento
const getFilteredProducts = async (filters) => {
  const { category, wood_type, finish, price } = filters;

  try {
    let url = `${API_URL}products?limit=40&sort=name_asc`;

    if (category) url += `&category=${category}`;
    if (wood_type) url += `&wood_type=${wood_type}`;
    if (finish) url += `&finish=${finish}`;
    if (price) url += `&max_price=${price}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error al obtener productos filtrados:", error);
    return [];
  }
};

// Observación: Esta lógica podría moverse a un módulo separado de gestión del carrito
const cartCounter = document.getElementById("cart-counter");
if (cartCounter) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartCounter.textContent = totalItems;
}

export {
  API_URL,
  getProducts,
  getProductBySku,
  getFilteredProducts,
  showNotification,
};
