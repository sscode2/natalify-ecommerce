// Import Firebase functions
import { 
    db, 
    auth, 
    storage,
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
    ADMIN_EMAIL,
    initializeAdmin,
    isAdmin
} from './firebase.js';

// Global variables
let currentUser = null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];
let orders = [];

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await initializeAdmin();
    setupAuthListener();
    updateCartUI();
    loadProducts();
    setupEventListeners();
    
    // Initialize page-specific functionality
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    initializePage(currentPage);
});

// Authentication state listener
function setupAuthListener() {
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        updateAuthUI();
        
        // Redirect admin users to dashboard if they're on login page
        if (user && window.location.pathname.includes('login.html')) {
            checkAdminAndRedirect(user.email);
        }
    });
}

async function checkAdminAndRedirect(email) {
    if (await isAdmin(email)) {
        window.location.href = 'dashboard.html';
    } else {
        window.location.href = 'index.html';
    }
}

// Update authentication UI
function updateAuthUI() {
    const userIcon = document.getElementById('userIcon');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userEmail = document.getElementById('userEmail');
    
    if (currentUser) {
        if (userIcon) userIcon.innerHTML = '👤';
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (userEmail) userEmail.textContent = currentUser.email;
    } else {
        if (userIcon) userIcon.innerHTML = '👤';
        if (loginBtn) loginBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (userEmail) userEmail.textContent = '';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Initialize page-specific functionality
function initializePage(page) {
    switch (page) {
        case 'index.html':
        case '':
            initializeHomepage();
            break;
        case 'shop.html':
            initializeShopPage();
            break;
        case 'product.html':
            initializeProductPage();
            break;
        case 'cart.html':
            initializeCartPage();
            break;
        case 'login.html':
            initializeLoginPage();
            break;
        case 'dashboard.html':
            initializeDashboard();
            break;
        case 'about.html':
            initializeAboutPage();
            break;
        case 'contact.html':
            initializeContactPage();
            break;
    }
}

// Page initialization functions
function initializeHomepage() {
    loadFeaturedProducts();
    loadCategories();
}

function initializeShopPage() {
    loadAllProducts();
    setupFilters();
}

function initializeProductPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (productId) {
        loadProductDetails(productId);
    }
}

function initializeCartPage() {
    displayCartItems();
    setupCheckoutForm();
}

function initializeLoginPage() {
    setupAuthForms();
}

async function initializeDashboard() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    if (!(await isAdmin(currentUser.email))) {
        window.location.href = 'index.html';
        return;
    }
    
    loadDashboardData();
    setupAdminForms();
}

function initializeAboutPage() {
    // Add any specific about page functionality here
}

function initializeContactPage() {
    setupContactForm();
}

// Load products from Firestore
async function loadProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        products = [];
        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Load featured products for homepage
async function loadFeaturedProducts() {
    await loadProducts();
    const featuredProducts = products.slice(0, 8); // Show first 8 products
    displayProducts(featuredProducts, 'featuredProducts');
}

// Load all products for shop page
async function loadAllProducts() {
    await loadProducts();
    displayProducts(products, 'allProducts');
}

// Display products in a container
function displayProducts(productsToShow, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (productsToShow.length === 0) {
        container.innerHTML = '<p class="text-center">No products found.</p>';
        return;
    }
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image || 'https://via.placeholder.com/300x250'}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-price">৳${product.price}</p>
            <div class="product-rating">
                <span class="stars">${generateStars(product.rating || 4)}</span>
                <span>(${product.reviews || 0} reviews)</span>
            </div>
            <div class="product-actions">
                <button class="btn btn-primary btn-small" onclick="addToCart('${product.id}')">Add to Cart</button>
                <button class="btn btn-outline btn-small" onclick="viewProduct('${product.id}')">View Details</button>
            </div>
        </div>
    `;
    return card;
}

// Generate star rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    
    if (halfStar) {
        stars += '☆';
    }
    
    return stars;
}

// Add product to cart
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    showAlert('Product added to cart!', 'success');
};

// View product details
window.viewProduct = function(productId) {
    window.location.href = `product.html?id=${productId}`;
};

// Update cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Show alert message
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

// Handle search
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) return;
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        (product.category && product.category.toLowerCase().includes(query))
    );
    
    // If on shop page, display filtered results
    if (window.location.pathname.includes('shop.html')) {
        displayProducts(filteredProducts, 'allProducts');
    } else {
        // Redirect to shop page with search results
        sessionStorage.setItem('searchResults', JSON.stringify(filteredProducts));
        window.location.href = 'shop.html';
    }
}

// Handle logout
async function handleLogout() {
    try {
        await signOut(auth);
        showAlert('Logged out successfully', 'success');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        showAlert('Logout failed', 'error');
    }
}
