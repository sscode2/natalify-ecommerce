// Cart and Checkout functionality
import { db, auth, collection, addDoc } from './firebase.js';

// Display cart items
export function displayCartItems() {
    const container = document.getElementById('cartItems');
    const summary = document.getElementById('orderSummary');
    
    if (!container) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="text-center">Your cart is empty.</p>';
        if (summary) summary.innerHTML = '';
        return;
    }
    
    container.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image || 'https://via.placeholder.com/80x80'}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">৳${item.price}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="setQuantity(${index}, this.value)">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <div class="cart-item-actions">
                <p class="cart-item-total">৳${itemTotal}</p>
                <button class="btn btn-outline btn-small" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
        container.appendChild(cartItem);
    });
    
    // Update order summary
    if (summary) {
        const shipping = total > 1000 ? 0 : 60; // Free shipping over ৳1000
        const grandTotal = total + shipping;
        
        summary.innerHTML = `
            <h3>Order Summary</h3>
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>৳${total}</span>
            </div>
            <div class="summary-row">
                <span>Shipping:</span>
                <span>৳${shipping}</span>
            </div>
            <div class="summary-row">
                <span>Total:</span>
                <span>৳${grandTotal}</span>
            </div>
        `;
    }
}

// Update item quantity
window.updateQuantity = function(index, change) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        displayCartItems();
    }
};

// Set item quantity
window.setQuantity = function(index, quantity) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const qty = parseInt(quantity);
    if (cart[index] && qty > 0) {
        cart[index].quantity = qty;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        displayCartItems();
    }
};

// Remove item from cart
window.removeFromCart = function(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    displayCartItems();
    showAlert('Item removed from cart', 'info');
};

// Setup checkout form
export function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
}

// Handle checkout
async function handleCheckout(e) {
    e.preventDefault();
    
    const currentUser = auth.currentUser;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (!currentUser) {
        showAlert('Please login to place an order', 'error');
        window.location.href = 'login.html';
        return;
    }
    
    if (cart.length === 0) {
        showAlert('Your cart is empty', 'error');
        return;
    }
    
    const formData = new FormData(e.target);
    const orderData = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        customerName: formData.get('name'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        email: formData.get('email') || currentUser.email,
        paymentMethod: formData.get('payment'),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending',
        createdAt: new Date(),
        orderNumber: generateOrderNumber()
    };
    
    try {
        await addDoc(collection(db, 'orders'), orderData);
        
        // Clear cart
        localStorage.removeItem('cart');
        updateCartUI();
        
        // Show success message
        showOrderConfirmation(orderData.orderNumber);
        
    } catch (error) {
        console.error('Error placing order:', error);
        showAlert('Error placing order. Please try again.', 'error');
    }
}

// Generate order number
function generateOrderNumber() {
    return 'ORD' + Date.now().toString().slice(-8);
}

// Show order confirmation
function showOrderConfirmation(orderNumber) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <div class="text-center">
                <h2 style="color: var(--primary-green); margin-bottom: 1rem;">Order Confirmed!</h2>
                <p>Your order #${orderNumber} has been placed successfully.</p>
                <p>We will contact you soon to confirm your order.</p>
                <button class="btn btn-primary mt-2" onclick="window.location.href='index.html'">Continue Shopping</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Update cart UI (imported from main.js)
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Show alert (imported from main.js)
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '100px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}
