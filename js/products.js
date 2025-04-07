import { getProducts, getFilteredProducts } from "./app.js";
import { showNotification } from "./notifications.js";

// Variables para paginación
let currentPage = 1;
const itemsPerPage = 12;
let totalPages = 1;
let filteredProducts = [];
let allProducts = [];

const renderProducts = (products, container) => {
  if (!products || products.length === 0) {
    container.innerHTML =
      '<p class="no-products">No hay productos disponibles</p>';
    return;
  }

  container.innerHTML = products
    .map((product) => {
      return `
        <article class="product-card" 
          data-id="${product.id}" 
          data-category="${product.category || ""}" 
          data-wood-type="${product.wood_type || ""}"
          data-finish="${product.finish || ""}"
          data-price="${product.discount_price}" 
          data-created-at="${product.created_at || ""}">
          <img src="${product.image_path}" alt="${
        product.name
      }" class="product-card__image" />
          <div class="product-card__content">
            <h3 class="product-card__title">${product.name}</h3>
            <div class="product-card__price-container">
              <span class="product-card__price">
                ${product.discount_price}€
              </span>
            </div>
            <div class="product-card__actions">
              <a href="./detail.html?sku=${
                product.sku
              }" class="button button--primary detail">Ver Detalles</a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
};

const renderPagination = (container) => {
  // No paginación si solo 1 página
  if (totalPages <= 1) {
    container.innerHTML = "";
    return;
  }

  // Controles de paginación
  let paginationHTML = `
    <div class="pagination-container">
      <button class="pagination__button" id="prev-page" ${
        currentPage === 1 ? "disabled" : ""
      }>
        &laquo;
      </button>
      <div class="pagination__pages">
  `;

  // Números de página (hasta 5)
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <button class="pagination__page ${
        i === currentPage ? "pagination__page--active" : ""
      }" data-page="${i}">
        ${i}
      </button>
    `;
  }

  paginationHTML += `
      </div>
      <button class="pagination__button" id="next-page" ${
        currentPage === totalPages ? "disabled" : ""
      }>
        &raquo; 
      </button>
    </div>
  `;

  container.innerHTML = paginationHTML;

  // Listeners para botones de paginación
  container.querySelector("#prev-page").addEventListener("click", () => {
    if (currentPage > 1) {
      changePage(currentPage - 1);
    }
  });

  container.querySelector("#next-page").addEventListener("click", () => {
    if (currentPage < totalPages) {
      changePage(currentPage + 1);
    }
  });

  container.querySelectorAll(".pagination__page").forEach((button) => {
    button.addEventListener("click", () => {
      changePage(parseInt(button.dataset.page));
    });
  });
};

const changePage = (newPage) => {
  currentPage = newPage;

  // Calcular productos para esta página
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const productsToShow = filteredProducts.slice(startIndex, endIndex);

  // Actualizar UI
  const productsGrid = document.querySelector(".products__grid");
  renderProducts(productsToShow, productsGrid);

  // Actualizar controles de paginación
  renderPagination(document.querySelector(".pagination-container"));

  // Scroll hacia la sección de productos
  document
    .querySelector(".products__grid")
    .scrollIntoView({ behavior: "smooth" });
};

const initializeFilters = (products, container) => {
  const filterButton = document.querySelector(".button.button--primary");
  const resetButton = document.getElementById("reset-filters");

  if (!filterButton || !resetButton) return;

  const applyFilters = async () => {
    try {
      const selectedCategories = getSelectedCheckboxValues("category[]");
      const selectedWoodTypes = getSelectedCheckboxValues("wood_type[]");
      const selectedFinishes = getSelectedCheckboxValues("finish[]");
      const maxPrice = parseInt(
        document.getElementById("price-range")?.value || "2000"
      );
      const sortOption = document.getElementById("sort")?.value || "";

      const filters = {
        category:selectedCategories.length > 0 ? selectedCategories.join(",") : null,
        wood_type: selectedWoodTypes.length > 0 ? selectedWoodTypes.join(",") : null,
        finish: selectedFinishes.length > 0 ? selectedFinishes.join(",") : null,
        price: maxPrice,
        sort: sortOption,
      };

      filteredProducts = await getFilteredProducts(filters);

      // Restablecer pág1 al filtrar resultados
      currentPage = 1;
      totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

      // Mostrar solo productos de pág actual
      const startIndex = 0;
      const endIndex = Math.min(itemsPerPage, filteredProducts.length);
      const productsToShow = filteredProducts.slice(startIndex, endIndex);

      renderProducts(productsToShow, container);
      renderPagination(document.querySelector(".pagination-container"));

      showNotification(
        `Se encontraron ${filteredProducts.length} productos`,
        "info"
      );
    } catch (error) {
      console.error("Error al aplicar filtros:", error);
      showNotification("Error al aplicar los filtros", "error");
    }
  };

  const resetFilters = () => {
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.checked = false;
    });

    const priceRange = document.getElementById("price-range");
    if (priceRange) {
      priceRange.value = "2000";
      document.getElementById("price-value").textContent = "2000";
    }

    const sortSelect = document.getElementById("sort");
    if (sortSelect) sortSelect.value = "";

    // Restablecer productos y paginación
    filteredProducts = [...allProducts];
    currentPage = 1;
    totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const startIndex = 0;
    const endIndex = Math.min(itemsPerPage, filteredProducts.length);
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    renderProducts(productsToShow, container);
    renderPagination(document.querySelector(".pagination-container"));

    showNotification("Filtros restablecidos", "success");
  };

  filterButton.addEventListener("click", applyFilters);
  resetButton.addEventListener("click", resetFilters);

  container.addEventListener("click", (e) => {
    if (e.target.closest(".add-to-cart")) {
      const productId = e.target.closest(".add-to-cart").dataset.id;
      addToCart(productId);
    }
  });
};

const sortProducts = (products, sortOption) => {
  switch (sortOption) {
    case "price_asc":
      return [...products].sort((a, b) => a.price - b.price);
    case "price_desc":
      return [...products].sort((a, b) => b.price - a.price);
    case "name_asc":
      return [...products].sort((a, b) => a.name.localeCompare(b.name));
    case "name_desc":
      return [...products].sort((a, b) => b.name.localeCompare(a.name));
    case "newest":
      return [...products].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    case "oldest":
      return [...products].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
    default:
      return products;
  }
};

const getSelectedCheckboxValues = (name) => {
  return Array.from(
    document.querySelectorAll(`input[name="${name}"]:checked`)
  ).map((checkbox) => checkbox.value);
};

const addToCart = (productId) => {
  console.log(`Añadir producto ${productId} al carrito`);
  showNotification("Producto añadido al carrito", "success");
};

// Inicializar página de productos
const initProductsPage = async () => {
  const productsGrid = document.querySelector(".products__grid");

  if (!productsGrid) {
    console.error("No se encontró el contenedor de productos");
    return;
  }

  try {
    // Indicador de carga
    productsGrid.innerHTML = '<div class="loading">Cargando productos...</div>';

    // Obtener todos los productos
    const response = await getProducts();
    allProducts = Array.isArray(response) ? response : [];
    filteredProducts = [...allProducts];

    // Calcular páginas totales
    totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // Obtener productos para la primera página
    const productsToShow = filteredProducts.slice(0, itemsPerPage);

    // Renderizar productos y controles de paginación
    renderProducts(productsToShow, productsGrid);
    initializeFilters(allProducts, productsGrid);
    renderPagination(document.querySelector(".pagination-container"));
  } catch (error) {
    console.error("Error al inicializar la página de productos:", error);
    showNotification(
      "No se pudieron cargar los productos. Inténtalo más tarde.",
      "error"
    );
    productsGrid.innerHTML =
      '<p class="error">Error al cargar los productos</p>';
  }
};

initProductsPage();
