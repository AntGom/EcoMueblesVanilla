import { showNotification } from "./notifications.js";

const API_URL = "https://furniture-api.fly.dev/v1/";

const getProducts = async (page = 1, limit = 50) => {
  try {
    const response = await fetch(`${API_URL}products?limit=${limit}&sort=name_asc`);
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

export {
  API_URL,
  getProducts,
  getProductBySku,
  getFilteredProducts,
  showNotification,
};
