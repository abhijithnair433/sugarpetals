/**
 * SugarPetals - Premium Bakery Frontend
 * Interactive JavaScript Functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initMobileMenu();
    initCart();
    initAccount();
    initNotifications();
    initSearch();
    initFilters();
    initCheckout();
    initLanguageCurrency();
    initWishlist();
    initScrollEffects();
    initAnimations();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Smooth scroll on nav link click
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu if open
            closeMobileMenu();
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            body.classList.toggle('menu-open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
}

function closeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.classList.remove('menu-open');
    }
}

/**
 * Shopping Cart functionality
 */
function initCart() {
    const cartBtn = document.querySelector('.cart-btn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.querySelector('.close-cart');
    const overlay = document.getElementById('overlay');
    const continueShopping = document.querySelector('.continue-shopping');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');

    let cart = [];
    let cartCount = 0;

    // Open cart
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            openSidebar(cartSidebar);
        });
    }

    // Close cart
    if (closeCart) {
        closeCart.addEventListener('click', function() {
            closeSidebar(cartSidebar);
        });
    }

    // Continue shopping
    if (continueShopping) {
        continueShopping.addEventListener('click', function() {
            closeSidebar(cartSidebar);
        });
    }

    // Checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            closeSidebar(cartSidebar);
            openCheckoutModal();
        });
    }

    // Add to cart buttons
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            const productIcon = productCard.querySelector('.product-image i').className;

            addToCart({
                name: productName,
                price: productPrice,
                icon: productIcon,
                quantity: 1
            });

            // Show feedback
            this.textContent = 'Added!';
            this.style.background = '#4caf50';
            
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.background = '';
            }, 1500);
        });
    });

    function addToCart(product) {
        cart.push(product);
        cartCount++;
        updateCartCount();
        updateCartDisplay();
    }

    function updateCartCount() {
        const cartCountEl = document.querySelector('.cart-count');
        if (cartCountEl) {
            cartCountEl.textContent = cartCount;
            cartCountEl.style.animation = 'pulse 0.3s ease';
            setTimeout(() => {
                cartCountEl.style.animation = '';
            }, 300);
        }
    }

    function updateCartDisplay() {
        const cartItems = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.total-amount');

        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            if (cartTotal) cartTotal.textContent = '$0.00';
            return;
        }

        let itemsHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const price = parseFloat(item.price.replace('$', ''));
            total += price;
            
            itemsHTML += `
                <div class="cart-item">
                    <div class="cart-item-icon">
                        <i class="${item.icon}"></i>
                    </div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.price}</p>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });

        cartItems.innerHTML = itemsHTML;
        if (cartTotal) cartTotal.textContent = '$' + total.toFixed(2);
    }

    // Make removeFromCart available globally
    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        cartCount--;
        updateCartCount();
        updateCartDisplay();
    };

    // Close cart on overlay click
    if (overlay) {
        overlay.addEventListener('click', function() {
            closeSidebar(cartSidebar);
            closeSidebar(document.getElementById('accountSidebar'));
            closeNotificationsPanel();
            closeCheckoutModal();
        });
    }
}

/**
 * Account sidebar functionality
 */
function initAccount() {
    const userBtn = document.querySelector('.user-btn');
    const accountSidebar = document.getElementById('accountSidebar');
    const closeAccount = document.querySelector('.close-account');
    const accountTabs = document.querySelectorAll('.account-tab');
    const accountPanels = document.querySelectorAll('.account-panel');

    // Open account sidebar
    if (userBtn) {
        userBtn.addEventListener('click', function() {
            openSidebar(accountSidebar);
        });
    }

    // Close account sidebar
    if (closeAccount) {
        closeAccount.addEventListener('click', function() {
            closeSidebar(accountSidebar);
        });
    }

    // Account tab switching
    accountTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            // Remove active class from all tabs and panels
            accountTabs.forEach(t => t.classList.remove('active'));
            accountPanels.forEach(p => p.classList.remove('active'));

            // Add active class to clicked tab and corresponding panel
            this.classList.add('active');
            const panel = document.getElementById(tabId);
            if (panel) {
                panel.classList.add('active');
            }
        });
    });
}

/**
 * Notifications panel functionality
 */
function initNotifications() {
    const notificationBtn = document.querySelector('.notification-btn');
    const notificationsPanel = document.getElementById('notificationsPanel');
    const markRead = document.querySelector('.mark-read');
    const notificationItems = document.querySelectorAll('.notification-item');

    // Toggle notifications panel
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleNotificationsPanel();
        });
    }

    // Mark all as read
    if (markRead) {
        markRead.addEventListener('click', function() {
            notificationItems.forEach(item => {
                item.classList.remove('unread');
            });
            updateNotificationCount(0);
        });
    }

    // Mark individual notification as read
    notificationItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.remove('unread');
            updateUnreadCount();
        });
    });

    function toggleNotificationsPanel() {
        const accountSidebar = document.getElementById('accountSidebar');
        
        // Close account sidebar if open
        if (accountSidebar && accountSidebar.classList.contains('active')) {
            closeSidebar(accountSidebar);
        }
        
        notificationsPanel.classList.toggle('active');
        document.getElementById('overlay').classList.toggle('active');
    }

    function closeNotificationsPanel() {
        if (notificationsPanel) {
            notificationsPanel.classList.remove('active');
        }
    }

    function updateUnreadCount() {
        const unreadItems = document.querySelectorAll('.notification-item.unread');
        updateNotificationCount(unreadItems.length);
    }

    function updateNotificationCount(count) {
        const notificationCount = document.querySelector('.notification-count');
        if (notificationCount) {
            notificationCount.textContent = count;
            if (count === 0) {
                notificationCount.style.display = 'none';
            } else {
                notificationCount.style.display = 'flex';
            }
        }
    }
}

/**
 * Search functionality
 */
function initSearch() {
    const searchInput = document.querySelector('.search-container input');
    const searchBtn = document.querySelector('.search-container button');

    if (searchInput && searchBtn) {
        // Search on button click
        searchBtn.addEventListener('click', function() {
            performSearch(searchInput.value);
        });

        // Search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }

    function performSearch(query) {
        if (query.trim() === '') {
            alert('Please enter a search term');
            return;
        }
        
        console.log('Searching for:', query);
        // In a real app, this would filter products or navigate to search results
        alert(`Searching for: ${query}\n\nThis would filter products in a real application.`);
    }
}

/**
 * Product filter functionality
 */
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');

            const filter = this.textContent.trim().toLowerCase();
            filterProducts(filter);
        });
    });

    function filterProducts(filter) {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            
            if (filter === 'all' || productName.includes(filter)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

/**
 * Checkout modal functionality
 */
function initCheckout() {
    const checkoutModal = document.getElementById('checkoutModal');
    const closeModal = document.querySelector('.close-modal');
    const checkoutForm = document.querySelector('.checkout-form');

    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            closeCheckoutModal();
        });
    }

    // Form submission
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const address = document.getElementById('address').value;

            if (name && email && address) {
                alert(`Thank you for your order, ${name}!\n\nOrder details:\n- Email: ${email}\n- Address: ${address}\n\nThis is a demo. In a real app, this would process payment and create an order.`);
                closeCheckoutModal();
                
                // Clear cart
                const cartItems = document.querySelector('.cart-items');
                if (cartItems) {
                    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
                }
                const cartTotal = document.querySelector('.total-amount');
                if (cartTotal) {
                    cartTotal.textContent = '$0.00';
                }
                const cartCount = document.querySelector('.cart-count');
                if (cartCount) {
                    cartCount.textContent = '0';
                }
            }
        });
    }
}

function openCheckoutModal() {
    const checkoutModal = document.getElementById('checkoutModal');
    const overlay = document.getElementById('overlay');
    
    if (checkoutModal && overlay) {
        checkoutModal.classList.add('active');
        overlay.classList.add('active');
    }
}

function closeCheckoutModal() {
    const checkoutModal = document.getElementById('checkoutModal');
    const overlay = document.getElementById('overlay');
    
    if (checkoutModal && overlay) {
        checkoutModal.classList.remove('active');
        overlay.classList.remove('active');
    }
}

/**
 * Language and currency selection
 */
function initLanguageCurrency() {
    const languageSelect = document.getElementById('language-select');
    const currencySelect = document.getElementById('currency-select');

    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const language = this.value;
            console.log('Language changed to:', language);
            // In a real app, this would change the website language
            alert(`Language changed to: ${getLanguageName(language)}\n\nThis is a demo.`);
        });
    }

    if (currencySelect) {
        currencySelect.addEventListener('change', function() {
            const currency = this.value;
            console.log('Currency changed to:', currency);
            // In a real app, this would update all prices
            alert(`Currency changed to: ${currency}\n\nThis is a demo.`);
        });
    }

    function getLanguageName(code) {
        const languages = {
            'en': 'English',
            'es': 'Español',
            'fr': 'Français',
            'de': 'Deutsch'
        };
        return languages[code] || code;
    }
}

/**
 * Wishlist functionality
 */
function initWishlist() {
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');

    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Toggle heart icon
            const icon = this.querySelector('i');
            const isActive = icon.classList.contains('fas');
            
            if (isActive) {
                icon.classList.remove('fas');
                icon.classList.add('far');
                // Removed from wishlist
            } else {
                icon.classList.remove('far');
                icon.classList.add('fas');
                // Added to wishlist
                
                // Show feedback
                this.style.animation = 'pulse 0.3s ease';
                setTimeout(() => {
                    this.style.animation = '';
                }, 300);
            }
            
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            console.log(isActive ? 'Removed from wishlist:' : 'Added to wishlist:', productName);
        });
    });
}

/**
 * Scroll effects
 */
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add shadow on scroll
        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 4px 20px rgba(233, 30, 99, 0.1)';
        }
        
        lastScroll = currentScroll;
    });
}

/**
 * Animations on scroll
 */
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe cards
    const featureCards = document.querySelectorAll('.feature-card, .special-card, .support-card, .store-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.transitionDelay = (index * 0.1) + 's';
        observer.observe(card);
    });

    // Add animation class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Sidebar helper functions
 */
function openSidebar(sidebar) {
    if (sidebar) {
        sidebar.classList.add('active');
        document.getElementById('overlay').classList.add('active');
    }
}

function closeSidebar(sidebar) {
    if (sidebar) {
        sidebar.classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
    }
}

// Make functions available globally
window.openSidebar = openSidebar;
window.closeSidebar = closeSidebar;
window.openCheckoutModal = openCheckoutModal;
window.closeCheckoutModal = closeCheckoutModal;
