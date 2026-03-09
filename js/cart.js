/**
 * Cart Module - Handles shopping cart functionality
 */

// Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('modernShopCart')) || [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('modernShopCart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(productId) {
    const cart = getCart();
    const product = window.allProducts?.find(p => p.id === productId);
    
    if (!product) {
        console.error('Product not found');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            discountPercentage: product.discountPercentage,
            thumbnail: product.thumbnail,
            quantity: 1
        });
    }
    
    saveCart(cart);
    updateCartCount();
    
    return cart;
}

// Remove item from cart
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartCount();
    
    // Re-render if on checkout page
    if (typeof renderCheckout === 'function') {
        renderCheckout();
    }
    
    return cart;
}

// Update item quantity
function updateQuantity(productId, change) {
    let cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (!item) return cart;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        return removeFromCart(productId);
    }
    
    saveCart(cart);
    updateCartCount();
    
    // Re-render if on checkout page
    if (typeof renderCheckout === 'function') {
        renderCheckout();
    }
    
    return cart;
}

// Get cart total
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((sum, item) => {
        const price = item.price - (item.price * item.discountPercentage / 100);
        return sum + (price * item.quantity);
    }, 0);
}

// Get cart item count
function getCartCount() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Update cart count display
function updateCartCount() {
    const count = getCartCount();
    const cartCountEl = document.getElementById('cart-count');
    
    if (cartCountEl) {
        cartCountEl.textContent = count;
        
        if (count > 0) {
            cartCountEl.classList.remove('hidden');
        } else {
            cartCountEl.classList.add('hidden');
        }
    }
}

// Clear cart
function clearCart() {
    saveCart([]);
    updateCartCount();
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

