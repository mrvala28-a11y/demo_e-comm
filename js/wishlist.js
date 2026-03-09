/**
 * Wishlist Module - Handles wishlist functionality
 */

// Get wishlist from localStorage
function getWishlist() {
    return JSON.parse(localStorage.getItem('modernShopWishlist')) || [];
}

// Save wishlist to localStorage
function saveWishlist(wishlist) {
    localStorage.setItem('modernShopWishlist', JSON.stringify(wishlist));
}

// Add item to wishlist
function addToWishlist(productId) {
    const wishlist = getWishlist();
    const product = window.allProducts?.find(p => p.id === productId);
    
    if (!product) {
        console.error('Product not found');
        return wishlist;
    }
    
    // Check if already in wishlist
    if (wishlist.some(item => item.id === productId)) {
        return wishlist;
    }
    
    wishlist.push({
        id: product.id,
        title: product.title,
        price: product.price,
        discountPercentage: product.discountPercentage,
        thumbnail: product.thumbnail,
        category: product.category
    });
    
    saveWishlist(wishlist);
    updateWishlistCount();
    updateWishlistButton(productId);
    
    return wishlist;
}

// Remove item from wishlist
function removeWishlistItem(productId) {
    let wishlist = getWishlist();
    wishlist = wishlist.filter(item => item.id !== productId);
    saveWishlist(wishlist);
    updateWishlistCount();
    updateWishlistButton(productId);
    
    return wishlist;
}

// Toggle wishlist
function toggleWishlist(productId) {
    const wishlist = getWishlist();
    const isInWishlist = wishlist.some(item => item.id === productId);
    
    if (isInWishlist) {
        removeWishlistItem(productId);
        return false;
    } else {
        addToWishlist(productId);
        return true;
    }
}

// Check if product is in wishlist
function isInWishlist(productId) {
    const wishlist = getWishlist();
    return wishlist.some(item => item.id === productId);
}

// Update wishlist button state
function updateWishlistButton(productId) {
    const btn = document.getElementById(`wishlist-btn-${productId}`);
    if (btn) {
        const isWishlisted = isInWishlist(productId);
        if (isWishlisted) {
            btn.innerHTML = '<i class="fas fa-heart text-xl"></i>';
            btn.classList.add('active');
        } else {
            btn.innerHTML = '<i class="far fa-heart text-xl"></i>';
            btn.classList.remove('active');
        }
    }
}

// Update wishlist count
function updateWishlistCount() {
    const wishlist = getWishlist();
    const countEl = document.getElementById('wishlist-count');
    const countTextEl = document.getElementById('wishlist-count-text');
    
    if (countEl) {
        countEl.textContent = wishlist.length;
        if (wishlist.length > 0) {
            countEl.classList.remove('hidden');
        } else {
            countEl.classList.add('hidden');
        }
    }
    
    if (countTextEl) {
        countTextEl.textContent = `${wishlist.length} item${wishlist.length !== 1 ? 's' : ''}`;
    }
}

// Initialize wishlist on page load
document.addEventListener('DOMContentLoaded', () => {
    updateWishlistCount();
});

