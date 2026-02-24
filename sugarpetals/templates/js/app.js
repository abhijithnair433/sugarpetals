/**
 * SugarPetals Premium - Luxury Bakery eCommerce
 * JavaScript Application
 */

// =====================================================
// Product Data - Real Bakery Images
// =====================================================
const products = [
    {
        id: 1,
        name: "Chocolate Layer Cake",
        category: "cakes",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop",
        badge: "best-seller",
        rating: 5,
        reviews: 128,
        description: "Rich layers of moist chocolate cake filled with creamy chocolate ganache and topped with chocolate shavings."
    },
    {
        id: 2,
        name: "Strawberry Dream Cake",
        category: "cakes",
        price: 28.99,
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=400&fit=crop",
        badge: "new",
        rating: 5,
        reviews: 86,
        description: "Light vanilla sponge layered with fresh strawberries and vanilla cream, finished with strawberry glaze."
    },
    {
        id: 3,
        name: "Vanilla Bean Cake",
        category: "cakes",
        price: 22.99,
        image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600&h=400&fit=crop",
        badge: null,
        rating: 4,
        reviews: 64,
        description: "Classic vanilla bean cake with smooth buttercream frosting and edible flowers."
    },
    {
        id: 4,
        name: "Red Velvet Elegance",
        category: "cakes",
        price: 26.99,
        image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=600&h=400&fit=crop",
        badge: "popular",
        rating: 5,
        reviews: 156,
        description: "Traditional red velvet cake with cream cheese frosting and decorative patterns."
    },
    {
        id: 5,
        name: "Butter Croissant",
        category: "pastries",
        price: 4.99,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=400&fit=crop",
        badge: null,
        rating: 5,
        reviews: 234,
        description: "Flaky, buttery croissant baked to golden perfection."
    },
    {
        id: 6,
        name: "Fruit Danish",
        category: "pastries",
        price: 5.99,
        image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600&h=400&fit=crop",
        badge: null,
        rating: 4,
        reviews: 89,
        description: "Crisp pastry filled with seasonal fruits and vanilla custard."
    },
    {
        id: 7,
        name: "Almond Pastry",
        category: "pastries",
        price: 6.99,
        image: "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=600&h=400&fit=crop",
        badge: "popular",
        rating: 5,
        reviews: 112,
        description: "French almond pastry with rich almond cream filling."
    },
    {
        id: 8,
        name: "Chocolate Chip Cookies",
        category: "cookies",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&h=400&fit=crop",
        badge: "best-seller",
        rating: 5,
        reviews: 267,
        description: "Chewy chocolate chip cookies loaded with dark chocolate chips."
    },
    {
        id: 9,
        name: "Macarons Assortment",
        category: "cookies",
        price: 18.99,
        image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600&h=400&fit=crop",
        badge: "popular",
        rating: 5,
        reviews: 198,
        description: "Assorted French macarons in various flavors."
    },
    {
        id: 10,
        name: "Oatmeal Cookies",
        category: "cookies",
        price: 10.99,
        image: "https://images.unsplash.com/photo-1490567674924-0e9567e5e3a3?w=600&h=400&fit=crop",
        badge: null,
        rating: 4,
        reviews: 76,
        description: "Chewy oatmeal cookies with plump raisins."
    },
    {
        id: 11,
        name: "Cupcake Tower",
        category: "cupcakes",
        price: 18.99,
        image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&h=400&fit=crop",
        badge: "new",
        rating: 5,
        reviews: 145,
        description: "Assorted cupcakes with various flavors and beautiful designs."
    },
    {
        id: 12,
        name: "Special Cupcakes",
        category: "cupcakes",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&h=400&fit=crop",
        badge: "popular",
        rating: 5,
        reviews: 203,
        description: "Perfect for celebrations with custom designs and sprinkles."
    }
];

// =====================================================
// State Management
// =====================================================
let cart = JSON.parse(localStorage.getItem('sugarpetals_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('sugarpetals_wishlist')) || [];
let cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

// =====================================================
// DOM Elements
// =====================================================
const loadingScreen = document.getElementById('loadingScreen');
const darkModeToggle = document.getElementById('darkModeToggle');
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const searchToggle = document.getElementById('searchToggle');
const searchBar = document.getElementById('searchBar');
const searchInput = document.getElementById('searchInput');
const cartBtn = document.getElementById('cartBtn');
const wishlistBtn = document.getElementById('wishlistBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCountEl = document.getElementById('cartCount');
const wishlistSidebar = document.getElementById('wishlistSidebar');
const wishlistOverlay = document.getElementById('wishlistOverlay');
const wishlistClose = document.getElementById('wishlistClose');
const wishlistItems = document.getElementById('wishlistItems');
const wishlistCountEl = document.getElementById('wishlistCount');
const continueShopping = document.getElementById('continueShopping');
const checkoutBtn = document.getElementById('checkoutBtn');
const productsGrid = document.getElementById('productsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const newsletterForm = document.getElementById('newsletterForm');
const quickViewModal = document.getElementById('quickViewModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalContent = document.getElementById('modalContent');

// =====================================================
// Initialize Application
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    initLoadingScreen();
    initDarkMode();
    initNavigation();
    initMobileMenu();
    initSearch();
    initCart();
    initWishlist();
    initProducts();
    initNewsletter();
    initQuickView();
    initScrollAnimations();
});

// =====================================================
// Loading Screen
// =====================================================
function initLoadingScreen() {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 2500);
}

// =====================================================
// Dark Mode
// =====================================================
function initDarkMode() {
    const savedTheme = localStorage.getItem('sugarpetals_theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    darkModeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('sugarpetals_theme', newTheme);
        
        const icon = darkModeToggle.querySelector('i');
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    });
}

// =====================================================
// Navigation
// =====================================================
function initNavigation() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
    
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// =====================================================
// Mobile Menu
// =====================================================
function initMobileMenu() {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
}

// =====================================================
// Search
// =====================================================
function initSearch() {
    searchToggle.addEventListener('click', () => {
        searchBar.classList.toggle('active');
        if (searchBar.classList.contains('active')) {
            searchInput.focus();
        }
    });
    
    document.getElementById('searchSubmit').addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (query) {
            filterProductsBySearch(query);
            searchBar.classList.remove('active');
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        }
    }
}

function filterProductsBySearch(query) {
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query)
    );
    renderProducts(filtered);
}

// =====================================================
// Cart Functions
// =====================================================
function initCart() {
    cartBtn.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    continueShopping.addEventListener('click', closeCart);
    checkoutBtn.addEventListener('click', handleCheckout);
    
    updateCartUI();
}

function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.classList.add('no-scroll');
}

function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

function addToCart(product, quantity = 1) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }
    
    cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    saveCart();
    updateCartUI();
    openCart();
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        cart.splice(index, 1);
        cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        saveCart();
        updateCartUI();
    }
}

function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
            saveCart();
            updateCartUI();
        }
    }
}

function saveCart() {
    localStorage.setItem('sugarpetals_cart', JSON.stringify(cart));
}

function updateCartUI() {
    cartCountEl.textContent = cartCount;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-basket"></i>
                <p>Your cart is empty</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

function handleCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty! Add some delicious items first.');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Thank you for your order!\n\nTotal: $${total.toFixed(2)}\n\nThis is a demo.`);
    
    cart = [];
    cartCount = 0;
    saveCart();
    updateCartUI();
    closeCart();
}

// Global functions for cart
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;

// =====================================================
// Wishlist Functions
// =====================================================
function initWishlist() {
    wishlistBtn.addEventListener('click', openWishlist);
    wishlistClose.addEventListener('click', closeWishlist);
    wishlistOverlay.addEventListener('click', closeWishlist);
    
    updateWishlistUI();
}

function openWishlist() {
    wishlistSidebar.classList.add('active');
    wishlistOverlay.classList.add('active');
    document.body.classList.add('no-scroll');
}

function closeWishlist() {
    wishlistSidebar.classList.remove('active');
    wishlistOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

function toggleWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
    } else {
        wishlist.push(product);
    }
    
    saveWishlist();
    updateWishlistUI();
    
    // Trigger animation on the button
    const btn = document.querySelector(`[data-wishlist-btn="${productId}"]`);
    if (btn) {
        btn.classList.add('wishlist-pop');
        setTimeout(() => btn.classList.remove('wishlist-pop'), 300);
    }
}

function removeFromWishlist(productId) {
    const index = wishlist.findIndex(item => item.id === productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        saveWishlist();
        updateWishlistUI();
    }
}

function saveWishlist() {
    localStorage.setItem('sugarpetals_wishlist', JSON.stringify(wishlist));
}

function updateWishlistUI() {
    wishlistCountEl.textContent = wishlist.length;
    
    if (wishlist.length === 0) {
        wishlistItems.innerHTML = `
            <div class="wishlist-empty">
                <i class="fas fa-heart-broken"></i>
                <p>Your wishlist is empty</p>
                <span>Save your favorites!</span>
            </div>
        `;
    } else {
        wishlistItems.innerHTML = wishlist.map(item => `
            <div class="wishlist-item">
                <div class="wishlist-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="wishlist-item-details">
                    <h4 class="wishlist-item-title">${item.name}</h4>
                    <p class="wishlist-item-price">$${item.price.toFixed(2)}</p>
                </div>
                <button class="wishlist-item-remove" onclick="removeFromWishlist(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
}

// Global function for wishlist
window.removeFromWishlist = removeFromWishlist;

// =====================================================
// Products
// =====================================================
function initProducts() {
    renderProducts(products);
    initFilters();
}

function renderProducts(productsToRender) {
    productsGrid.innerHTML = productsToRender.map((product, index) => {
        const isInWishlist = wishlist.some(item => item.id === product.id);
        
        return `
        <div class="product-card" data-category="${product.category}" style="animation-delay: ${index * 0.1}s">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.badge ? `<span class="product-badge ${product.badge}">${product.badge}</span>` : ''}
                <div class="product-actions">
                    <button class="product-action-btn wishlist ${isInWishlist ? 'active' : ''}" 
                            data-wishlist-btn="${product.id}"
                            onclick="handleWishlistClick(${product.id})" 
                            aria-label="Add to wishlist">
                        <i class="far fa-heart"></i>
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <button class="quick-view-btn" onclick="openQuickView(${product.id})">Quick View</button>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    ${renderStars(product.rating)}
                    <span>(${product.reviews})</span>
                </div>
                <div class="product-bottom">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" onclick="addToCartFromButton(this, ${product.id})">
                        <i class="fas fa-shopping-bag"></i>
                        <span>Add</span>
                    </button>
                </div>
            </div>
        </div>
    `}).join('');
}

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

function initFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            if (category === 'all') {
                renderProducts(products);
            } else {
                const filtered = products.filter(p => p.category === category);
                renderProducts(filtered);
            }
        });
    });
}

window.handleWishlistClick = function(productId) {
    toggleWishlist(productId);
    
    // Re-render products to update wishlist icon
    const activeFilter = document.querySelector('.filter-btn.active');
    const category = activeFilter ? activeFilter.dataset.category : 'all';
    
    if (category === 'all') {
        renderProducts(products);
    } else {
        renderProducts(products.filter(p => p.category === category));
    }
};

window.addToCartFromButton = function(btn, productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        addToCart(product);
        
        const originalContent = btn.innerHTML;
        btn.classList.add('added');
        btn.innerHTML = '<i class="fas fa-check"></i><span>Added</span>';
        
        setTimeout(() => {
            btn.classList.remove('added');
            btn.innerHTML = originalContent;
        }, 1500);
    }
};

// =====================================================
// Quick View Modal
// =====================================================
function initQuickView() {
    modalClose.addEventListener('click', closeQuickView);
    modalOverlay.addEventListener('click', closeQuickView);
}

window.openQuickView = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    modalContent.innerHTML = `
        <div class="modal-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="modal-details">
            <span class="modal-category">${product.category}</span>
            <h2 class="modal-title">${product.name}</h2>
            <div class="modal-rating">
                ${renderStars(product.rating)}
                <span>(${product.reviews} reviews)</span>
            </div>
            <div class="modal-price">$${product.price.toFixed(2)}</div>
            <p class="modal-description">${product.description}</p>
            <div class="modal-quantity">
                <label>Quantity:</label>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateModalQuantity(-1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity-value" id="modalQuantity">1</span>
                    <button class="quantity-btn" onclick="updateModalQuantity(1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="addModalToCart(${product.id})">
                    <i class="fas fa-shopping-bag"></i>
                    <span>Add to Cart</span>
                </button>
                <button class="btn btn-secondary" onclick="handleWishlistClick(${product.id})">
                    <i class="fas fa-heart"></i>
                    <span>Wishlist</span>
                </button>
            </div>
        </div>
    `;
    
    quickViewModal.classList.add('active');
    modalOverlay.classList.add('active');
    document.body.classList.add('no-scroll');
};

function closeQuickView() {
    quickViewModal.classList.remove('active');
    modalOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

let modalQuantity = 1;

window.updateModalQuantity = function(change) {
    modalQuantity += change;
    if (modalQuantity < 1) modalQuantity = 1;
    document.getElementById('modalQuantity').textContent = modalQuantity;
};

window.addModalToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        addToCart(product, modalQuantity);
        closeQuickView();
        modalQuantity = 1;
    }
};

// =====================================================
// Newsletter
// =====================================================
function initNewsletter() {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('newsletterEmail').value;
        
        if (email) {
            alert(`Thank you for subscribing!\n\nYou'll receive exclusive offers at: ${email}`);
            newsletterForm.reset();
        }
    });
}

// =====================================================
// Scroll Animations
// =====================================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.section-header, .product-card, .contact-card, .about-grid').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}
