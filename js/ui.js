/**
 * UI Module - Handles UI rendering
 */

const productsGrid = document.getElementById('products-grid');
const productSlider = document.getElementById('product-slider');
const toastContainer = document.getElementById('toast-container');
const loadingOverlay = document.getElementById('loading-overlay');
const errorMessage = document.getElementById('error-message');
const noResults = document.getElementById('no-results');
const productCount = document.getElementById('product-count');

function showLoading() {
    if (loadingOverlay) loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
    if (loadingOverlay) loadingOverlay.classList.add('hidden');
}

function showError() {
    if (errorMessage) errorMessage.classList.remove('hidden');
    if (productsGrid) productsGrid.classList.add('hidden');
}

function hideError() {
    if (errorMessage) errorMessage.classList.add('hidden');
    if (productsGrid) productsGrid.classList.remove('hidden');
}

function showNoResults() {
    if (noResults) noResults.classList.remove('hidden');
    if (productsGrid) productsGrid.classList.add('hidden');
}

function hideNoResults() {
    if (noResults) noResults.classList.add('hidden');
    if (productsGrid) productsGrid.classList.remove('hidden');
}

function generateStars(rating) {
    let starsHtml = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            starsHtml += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && hasHalfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        } else {
            starsHtml += '<i class="far fa-star"></i>';
        }
    }
    return starsHtml;
}

function createProductCard(product) {
    const { id, title, price, discountPercentage, rating, thumbnail, category } = product;
    const discountedPrice = (price - (price * discountPercentage / 100)).toFixed(2);
    
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${Math.random() * 0.3}s`;
    
    const isWishlisted = isInWishlist(id);
    
    card.innerHTML = `
        <div class="image-container">
            <img src="${thumbnail}" alt="${title}" class="product-image" loading="lazy">
            ${discountPercentage > 0 ? `<span class="discount-badge">-${Math.round(discountPercentage)}%</span>` : ''}
            <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist(${id})">
                <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
            </button>
            <button class="quick-view" onclick="event.stopPropagation(); window.location.href='product.html?id=${id}'">
                <i class="fas fa-eye mr-1"></i> View
            </button>
        </div>
        <div class="card-content">
            <p class="category">${category}</p>
            <h3 class="title">${title}</h3>
            <div class="rating">
                <span class="stars">${generateStars(rating)}</span>
                <span class="count">(${rating})</span>
            </div>
            <div class="price">
                <span class="current">$${discountedPrice}</span>
                ${discountPercentage > 0 ? `<span class="original">$${price}</span>` : ''}
            </div>
            <button class="add-to-cart" onclick="addToCart(${id}); animateButton(this);">
                <i class="fas fa-shopping-cart mr-2"></i>Add to Cart
            </button>
        </div>
    `;
    
    return card;
}

function renderProducts(products) {
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    if (products.length === 0) {
        showNoResults();
        if (productCount) productCount.textContent = 'No products found';
        return;
    }
    
    hideNoResults();
    hideError();
    if (productCount) productCount.textContent = `Showing ${products.length} products`;
    
    products.forEach((product, index) => {
        const card = createProductCard(product);
        productsGrid.appendChild(card);
        setTimeout(() => card.classList.add('loaded'), index * 50);
    });
}

function renderSlider(products) {
    if (!productSlider) return;
    
    productSlider.innerHTML = '';
    const sliderProducts = products.slice(0, 8);
    
    sliderProducts.forEach(product => {
        const { id, title, price, discountPercentage, rating, thumbnail, category } = product;
        const discountedPrice = (price - (price * discountPercentage / 100)).toFixed(2);
        
        const card = document.createElement('div');
        card.className = 'slider-card';
        card.onclick = () => window.location.href = `product.html?id=${id}`;
        
        card.innerHTML = `
            <div class="image-container">
                <img src="${thumbnail}" alt="${title}">
            </div>
            <div class="p-4">
                <p class="text-xs text-gray-500 uppercase mb-1">${category}</p>
                <h3 class="font-semibold text-sm mb-2 line-clamp-1">${title}</h3>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="font-bold text-primary">$${discountedPrice}</span>
                        ${discountPercentage > 0 ? `<span class="text-xs text-gray-400 line-through">$${price}</span>` : ''}
                    </div>
                    <div class="flex items-center gap-1 text-accent text-xs">
                        <i class="fas fa-star"></i>
                        <span>${rating}</span>
                    </div>
                </div>
            </div>
        `;
        
        productSlider.appendChild(card);
    });
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    
    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    
    if (toastContainer) {
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

function animateButton(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check mr-2"></i>Added!';
    button.classList.add('added');
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.classList.remove('added');
    }, 1500);
}

window.generateStars = generateStars;
window.createProductCard = createProductCard;
window.showToast = showToast;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showError = showError;
window.hideError = hideError;
window.showNoResults = showNoResults;
window.hideNoResults = hideNoResults;
window.animateButton = animateButton;

