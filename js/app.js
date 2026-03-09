/**
 * App Module - Main application logic
 */

window.allProducts = [];
let displayedProducts = [];
let currentCategory = 'all';
let currentSearchQuery = '';
let currentSort = 'default';
let productsToShow = 12;
let totalProducts = 0;

const searchInput = document.getElementById('search-input');
const searchInputMobile = document.getElementById('search-input-mobile');
const sortSelect = document.getElementById('sort-select');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const sliderPrev = document.getElementById('slider-prev');
const sliderNext = document.getElementById('slider-next');
const navbar = document.getElementById('navbar');
const loadMoreBtn = document.getElementById('load-more-btn');
const loadMoreContainer = document.getElementById('load-more-container');

async function initApp() {
    showLoading();
    try {
        const data = await fetchProducts(100);
        window.allProducts = data.products;
        totalProducts = data.products.length;
        displayedProducts = [...window.allProducts];
        
        renderProducts(displayedProducts.slice(0, productsToShow));
        renderSlider(window.allProducts);
        
        setupEventListeners();
        initDarkMode();
        updateCartCount();
        updateWishlistCount();
        
        hideLoading();
    } catch (error) {
        console.error('Failed to initialize:', error);
        hideLoading();
        showError();
    }
}

function setupEventListeners() {
    let searchTimeout;
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => handleSearch(e.target.value), 300);
        });
    }
    
    if (searchInputMobile) {
        searchInputMobile.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                handleSearch(e.target.value);
                if (searchInput) searchInput.value = e.target.value;
            }, 300);
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            handleFilterAndSort();
        });
    }
    
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            handleCategoryFilter(category);
            updateCategoryButtons(category);
        });
    });
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    }
    
    if (sliderPrev && productSlider) {
        sliderPrev.addEventListener('click', () => productSlider.scrollBy({ left: -300, behavior: 'smooth' }));
    }
    
    if (sliderNext && productSlider) {
        sliderNext.addEventListener('click', () => productSlider.scrollBy({ left: 300, behavior: 'smooth' }));
    }
    
    // Load More button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreProducts);
    }
    
    window.addEventListener('scroll', () => {
        if (navbar) {
            navbar.classList.toggle('shadow-md', window.scrollY > 50);
        }
    });
    
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
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') mobileMenu?.classList.add('hidden');
    });
}

function handleSearch(query) {
    currentSearchQuery = query.trim().toLowerCase();
    handleFilterAndSort();
}

function handleCategoryFilter(category) {
    currentCategory = category;
    handleFilterAndSort();
}

function handleFilterAndSort() {
    let filtered = [...window.allProducts];
    
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category.toLowerCase() === currentCategory.toLowerCase());
    }
    
    if (currentSearchQuery) {
        filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(currentSearchQuery) ||
            p.category.toLowerCase().includes(currentSearchQuery) ||
            p.description?.toLowerCase().includes(currentSearchQuery)
        );
    }
    
    // Apply sorting
    switch (currentSort) {
        case 'price-low':
            filtered.sort((a, b) => (a.price - a.price * a.discountPercentage / 100) - (b.price - b.price * b.discountPercentage / 100));
            break;
        case 'price-high':
            filtered.sort((a, b) => (b.price - b.price * b.discountPercentage / 100) - (a.price - a.price * a.discountPercentage / 100));
            break;
        case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
    }
    
    displayedProducts = filtered;
    productsToShow = 12;
    renderProducts(displayedProducts.slice(0, productsToShow));
    updateLoadMoreButton();
}

function updateCategoryButtons(category) {
    currentCategory = category;
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
        if (btn.dataset.category !== category) {
            btn.classList.remove('bg-white', 'dark:bg-dark-card', 'text-gray-700', 'dark:text-gray-200');
        }
    });
}

function loadMoreProducts() {
    productsToShow += 12;
    renderProducts(displayedProducts.slice(0, productsToShow));
    updateLoadMoreButton();
}

function updateLoadMoreButton() {
    if (loadMoreContainer && loadMoreBtn) {
        if (productsToShow >= displayedProducts.length) {
            loadMoreContainer.classList.add('hidden');
        } else {
            loadMoreContainer.classList.remove('hidden');
        }
    }
}

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

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
}

document.addEventListener('DOMContentLoaded', initApp);

