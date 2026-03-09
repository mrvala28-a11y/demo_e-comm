/**
 * App Module - Main application logic and initialization
 */

// Global products array
window.allProducts = [];
let displayedProducts = [];
let currentCategory = 'all';
let currentSearchQuery = '';

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchInputMobile = document.getElementById('search-input-mobile');
const sortSelect = document.getElementById('sort-select');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const sliderPrev = document.getElementById('slider-prev');
const sliderNext = document.getElementById('slider-next');
const navbar = document.getElementById('navbar');

/**
 * Initialize the application
 */
async function initApp() {
    showLoading();
    
    try {
        // Fetch products
        const data = await fetchProducts(100);
        window.allProducts = data.products;
        displayedProducts = [...window.allProducts];
        
        // Render products and slider
        renderProducts(displayedProducts);
        renderSlider(window.allProducts);
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize dark mode
        initDarkMode();
        
        // Update cart count
        updateCartCount();
        updateWishlistCount();
        
        hideLoading();
    } catch (error) {
        console.error('Failed to initialize app:', error);
        hideLoading();
        showError();
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Search (desktop)
    let searchTimeout;
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => handleSearch(e.target.value), 300);
        });
    }
    
    // Search (mobile)
    if (searchInputMobile) {
        searchInputMobile.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                handleSearch(e.target.value);
                if (searchInput) searchInput.value = e.target.value;
            }, 300);
        });
    }
    
    // Sort
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            handleFilterAndSort();
        });
    }
    
    // Category filters
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            handleCategoryFilter(category);
            updateCategoryButtons(category);
        });
    });
    
    // Mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Slider navigation
    if (sliderPrev && productSlider) {
        sliderPrev.addEventListener('click', () => {
            productSlider.scrollBy({ left: -300, behavior: 'smooth' });
        });
    }
    
    if (sliderNext && productSlider) {
        sliderNext.addEventListener('click', () => {
            productSlider.scrollBy({ left: 300, behavior: 'smooth' });
        });
    }
    
    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('shadow-md');
            } else {
                navbar.classList.remove('shadow-md');
            }
        }
    });
    
    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                mobileMenu?.classList.add('hidden');
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            mobileMenu?.classList.add('hidden');
        }
    });
}

/**
 * Handle search
 */
function handleSearch(query) {
    currentSearchQuery = query.trim().toLowerCase();
    handleFilterAndSort();
}

/**
 * Handle category filter
 */
function handleCategoryFilter(category) {
    currentCategory = category;
    handleFilterAndSort();
}

/**
 * Handle filter and sort
 */
function handleFilterAndSort() {
    let filtered = [...window.allProducts];
    
    // Apply category filter
    if (currentCategory !== 'all') {
        filtered = filtered.filter(product =>
            product.category.toLowerCase() === currentCategory.toLowerCase()
        );
    }
    
    // Apply search filter
    if (currentSearchQuery) {
        filtered = filtered.filter(product =>
            product.title.toLowerCase().includes(currentSearchQuery) ||
            product.category.toLowerCase().includes(currentSearchQuery) ||
            product.description?.toLowerCase().includes(currentSearchQuery)
        );
    }
    
    displayedProducts = filtered;
    renderProducts(displayedProducts);
}

/**
 * Update category buttons
 */
function updateCategoryButtons(category) {
    currentCategory = category;
    
    document.querySelectorAll('.category-btn').forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.add('active');
            btn.classList.remove('bg-white', 'dark:bg-dark-card', 'text-gray-700', 'dark:text-gray-200');
        } else {
            btn.classList.remove('active');
            btn.classList.add('bg-white', 'dark:bg-dark-card', 'text-gray-700', 'dark:text-gray-200');
        }
    });
}

/**
 * Dark Mode
 */
function initDarkMode() {
    const savedTheme = localStorage.getItem('modernShopTheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
        updateDarkModeIcon(true);
    }
}

function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('modernShopTheme', isDark ? 'dark' : 'light');
    updateDarkModeIcon(isDark);
}

function updateDarkModeIcon(isDark) {
    if (darkModeToggle) {
        const icon = darkModeToggle.querySelector('i');
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun', 'text-yellow-400');
        } else {
            icon.classList.remove('fa-sun', 'text-yellow-400');
            icon.classList.add('fa-moon', 'text-gray-700');
        }
    }
}

// Dark mode toggle event
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
}

// Global functions for cart and wishlist buttons
window.addToCart = function(productId) {
    const product = window.allProducts.find(p => p.id === productId);
    if (product) {
        addToCart(productId);
        showToast(`${product.title} added to cart!`, 'success');
    }
};

window.toggleWishlist = function(productId) {
    const product = window.allProducts.find(p => p.id === productId);
    const isAdded = toggleWishlist(productId);
    if (product) {
        if (isAdded) {
            showToast(`${product.title} added to wishlist!`, 'success');
        } else {
            showToast(`${product.title} removed from wishlist`, 'info');
        }
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initApp);

