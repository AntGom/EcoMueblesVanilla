import { showNotification } from "./notifications.js";

const API_URL = "https://furniture-api.fly.dev/v1/";

const getProducts = async (page = 1, limit = 100) => {
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

/*/ A futuro:
const getProductsByCategory = async (category) => {
  try {
    const products = await getProducts();
    return products.filter((product) => product.category === category);
  } catch (error) {
    console.error(
      `Error al obtener productos de categoría ${category}:`,
      error
    );
    return [];
  }
};*/

export {
  API_URL,
  getProducts,
  getProductBySku,
  //getProductsByCategory,
  showNotification,
};