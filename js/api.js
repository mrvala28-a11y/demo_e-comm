/**
 * API Module - Handles all API calls to DummyJSON
 */

const API_BASE_URL = 'https://dummyjson.com';

/**
 * Fetch all products
 * @param {number} limit - Number of products
 * @param {number} skip - Skip count
 * @returns {Promise<Object>}
 */
async function fetchProducts(limit = 30, skip = 0) {
    try {
        const response = await fetch(`${API_BASE_URL}/products?limit=${limit}&skip=${skip}&select=title,price,discountPercentage,rating,thumbnail,category,description,images,stock`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

/**
 * Fetch single product
 * @param {number} id - Product ID
 * @returns {Promise<Object>}
 */
async function fetchSingleProduct(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${id}?select=title,price,discountPercentage,rating,thumbnail,category,description,images,stock`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
}

/**
 * Search products
 * @param {string} query - Search query
 * @param {number} limit - Limit results
 * @returns {Promise<Object>}
 */
async function searchProducts(query, limit = 30) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&select=title,price,discountPercentage,rating,thumbnail,category,description,images,stock`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
}

/**
 * Fetch products by category
 * @param {string} category - Category name
 * @param {number} limit - Limit results
 * @returns {Promise<Object>}
 */
async function fetchProductsByCategory(category, limit = 30) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/category/${category}?limit=${limit}&select=title,price,discountPercentage,rating,thumbnail,category,description,images,stock`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching category products:', error);
        throw error;
    }
}

