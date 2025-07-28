// JavaScript interaktif dengan GSAP, WebGL (opsional), dan validasi tingkat lanjut

/**
 * @file Ultra-Premium E-commerce Script
 * @author Yilzi Digital Store
 * @version 1.0
 * @description Core script for toko online, handling animations, cart, and interactivity.
 */

document.addEventListener('DOMContentLoaded', () => {

    // Product data (Normally from an API)
    const products = [
        { id: 1, name: "CYBER-NEXUS Hoodie", price: 1250000, image: "https://i.ibb.co/hRr6q1F/product1.jpg" },
        { id: 2, name: "TECH-VANGUARD Jacket", price: 2800000, image: "https://i.ibb.co/9vMhV5Y/product2.jpg" },
        { id: 3, name: "GHOST-WEAVE Tee", price: 850000, image: "https://i.ibb.co/1n5b00B/product3.jpg" },
        { id: 4, name: "QUANTUM-LEAP Trousers", price: 1750000, image: "https://i.ibb.co/YDCB76b/product4.jpg" },
        { id: 5, name: "NEO-TOKYO Sneakers", price: 3200000, image: "https://i.ibb.co/rpx6dG7/product5.jpg" },
        { id: 6, name: "AEGIS Face Shield", price: 950000, image: "https://i.ibb.co/10R98x8/product6.jpg" },
        { id: 7, name: "STEALTH-MODE Cap", price: 650000, image: "https://i.ibb.co/Gcyb58t/product7.jpg" },
        { id: 8, name: "ORION Utility Vest", price: 2100000, image: "https://i.ibb.co/xL80RzF/product8.jpg" },
    ];
    
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    /**
     * Initializes all core functionalities of the website.
     */
    function init() {
        initTheme();
        initNavigation();
        initHeroAnimations();
        initScrollAnimations();
        initProductGrid();
        initCart();
        initContactForm();
        updateFooterYear();
        smoothScroll();
    }
    
    // --- THEME TOGGLE (DARK/LIGHT MODE) ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    /**
     * Initializes the theme based on localStorage or system preference.
     */
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        htmlEl.className = savedTheme;
        updateThemeIcon(savedTheme === 'dark');
        
        themeToggle.addEventListener('click', () => {
            const isDark = htmlEl.classList.toggle('dark');
            htmlEl.classList.toggle('light', !isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcon(isDark);
        });
    }

    /**
     * Updates the theme toggle icon (sun/moon).
     * @param {boolean} isDark - True if dark mode is active.
     */
    function updateThemeIcon(isDark) {
        gsap.to(themeToggle.querySelector('i'), { 
            rotate: isDark ? 90 : 0, 
            opacity: 0, 
            duration: 0.2, 
            onComplete: () => {
                themeToggle.innerHTML = `<i class="fas fa-${isDark ? 'sun' : 'moon'}"></i>`;
                gsap.to(themeToggle.querySelector('i'), { rotate: 0, opacity: 1, duration: 0.2 });
            }
        });
    }


    // --- NAVIGATION ---
    /**
     * Initializes header scroll effect and mobile menu functionality.
     */
    function initNavigation() {
        const header = document.getElementById('header');
        const hamburger = document.getElementById('hamburger-menu');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');

        // Header scroll effect
        ScrollTrigger.create({
            start: "top top",
            end: 99999,
            onUpdate: self => {
                header.classList.toggle('header-scrolled', self.scroll() > 50);
            }
        });

        // Mobile menu toggle
        hamburger.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('hidden');
            hamburger.innerHTML = `<i class="fas fa-${isOpen ? 'bars' : 'times'}"></i>`;
            gsap.to(document.body, { overflow: isOpen ? 'auto' : 'hidden', duration: 0 });
            gsap.fromTo(mobileMenu, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.inOut' });
        });
        
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                 mobileMenu.classList.add('hidden');
                 hamburger.innerHTML = '<i class="fas fa-bars"></i>';
                 gsap.to(document.body, { overflow: 'auto', duration: 0 });
            });
        });
    }

    // --- ANIMATIONS ---
    /**
     * Initializes GSAP animations for the hero section.
     */
    function initHeroAnimations() {
        gsap.from('.hero-title .animate-reveal', {
            y: 100,
            opacity: 0,
            stagger: 0.15,
            duration: 1,
            ease: 'power3.out',
            delay: 0.5
        });
        gsap.from('.hero-subtitle', { y: 20, opacity: 0, duration: 1, ease: 'power3.out', delay: 1 });
        gsap.from('.btn-primary', { scale: 0.8, opacity: 0, duration: 1, ease: 'elastic.out(1, 0.5)', delay: 1.2 });
    }

    /**
     * Initializes scroll-triggered animations for sections and elements.
     */
    function initScrollAnimations() {
        document.querySelectorAll('section').forEach((section) => {
            gsap.from(section.querySelectorAll('.section-title, p, .btn, .form-input, .form-textarea, .about-image-container'), {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out'
            });
        });
    }

    // --- PRODUCT & CART LOGIC ---
    let cart = [];
    const cartToggle = document.getElementById('cart-toggle');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartOverlay = document.getElementById('cart-overlay');
    
    /**
     * Renders products into the grid.
     */
    function initProductGrid() {
        const productGrid = document.getElementById('product-grid');
        if (!productGrid) return;
        productGrid.innerHTML = ''; // Clear example
        
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.dataset.id = product.id;
            card.dataset.name = product.name;
            card.dataset.price = product.price;
            card.dataset.image = product.image;
            
            card.innerHTML = `
                <div class="product-card-inner">
                    <img data-src="${product.image}" class="lazyload product-image" alt="${product.name}">
                    <div class="product-overlay">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-price">${formatCurrency(product.price)}</p>
                        <button class="btn btn-secondary add-to-cart-btn">Tambah ke Keranjang</button>
                    </div>
                </div>
            `;
            productGrid.appendChild(card);
        });
        
        // Product card entrance animation
        gsap.from(".product-card", {
            scrollTrigger: {
                trigger: "#product-grid",
                start: "top 80%",
            },
            opacity: 0,
            y: 50,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
        });
    }
    
    /**
     * Formats a number as Indonesian Rupiah.
     * @param {number} amount - The number to format.
     * @returns {string} - The formatted currency string.
     */
    function formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    }
    
    /**
     * Initializes cart functionality including event listeners and loading from localStorage.
     */
    function initCart() {
        loadCartFromStorage();
        updateCartUI();

        document.getElementById('product-grid').addEventListener('click', e => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const card = e.target.closest('.product-card');
                addToCart(card.dataset.id);
            }
        });

        cartToggle.addEventListener('click', toggleCartModal);
        closeCartBtn.addEventListener('click', toggleCartModal);
        cartOverlay.addEventListener('click', toggleCartModal);

        document.getElementById('cart-items-container').addEventListener('click', e => {
            if(e.target.classList.contains('remove-from-cart-btn')) {
                removeFromCart(e.target.dataset.id);
            }
        });
    }
    
    /**
     * Adds a product to the cart.
     * @param {string} productId - The ID of the product to add.
     */
    function addToCart(productId) {
        const productData = products.find(p => p.id == productId);
        const existingItem = cart.find(item => item.id == productId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...productData, quantity: 1 });
        }
        
        saveCartToStorage();
        updateCartUI();
        animateCartIcon();
        showNotification(`${productData.name} ditambahkan ke keranjang.`);
    }

    /**
     * Removes an item from the cart.
     * @param {string} productId - The ID of the product to remove.
     */
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id != productId);
        saveCartToStorage();
        updateCartUI();
    }
    
    /**
     * Updates the entire cart UI (count, items, total).
     */
    function updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const cartItemsContainer = document.getElementById('cart-items-container');
        const cartTotalEl = document.getElementById('cart-total');
        const emptyCartMsg = document.getElementById('empty-cart-msg');

        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '';
            emptyCartMsg.style.display = 'block';
            cartItemsContainer.appendChild(emptyCartMsg);
        } else {
            emptyCartMsg.style.display = 'none';
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="flex items-center justify-between p-2 rounded-lg cart-item-glassmorphism">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-md">
                    <div class="flex-grow mx-4">
                        <p class="font-bold">${item.name}</p>
                        <p class="text-sm text-gray-400">${item.quantity} x ${formatCurrency(item.price)}</p>
                    </div>
                    <button class="remove-from-cart-btn text-accent-pink hover:text-red-500 font-bold" data-id="${item.id}">&times;</button>
                </div>
            `).join('');
        }
        
        const totalCost = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalEl.textContent = formatCurrency(totalCost);
    }
    
    /**
     * Toggles the visibility of the shopping cart modal with GSAP animations.
     */
    function toggleCartModal() {
        const isHidden = cartModal.classList.toggle('hidden');
        if (!isHidden) {
            gsap.fromTo("#cart-container", 
                { opacity: 0, y: 50, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }
            );
        }
    }
    
    /**
     * Animates the cart icon when an item is added.
     */
    function animateCartIcon() {
        gsap.to('#cart-toggle', { 
            scale: 1.3, 
            duration: 0.2, 
            yoyo: true, 
            repeat: 1,
            ease: 'power2.inOut' 
        });
    }

    /**
     * Saves the cart to localStorage.
     */
    function saveCartToStorage() {
        localStorage.setItem('toko_online_cart', JSON.stringify(cart));
    }

    /**
     * Loads the cart from localStorage.
     */
    function loadCartFromStorage() {
        const storedCart = localStorage.getItem('toko_online_cart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
        }
    }
    
    // --- CONTACT FORM ---
    /**
     * Initializes contact form validation.
     */
    function initContactForm() {
        const form = document.getElementById('contact-form');
        form.addEventListener('submit', e => {
            e.preventDefault();
            if (validateForm(form)) {
                showFormFeedback('Terima kasih! Pesan Anda telah terkirim.', 'success');
                form.reset();
            }
        });
    }

    /**
     * Validates the contact form fields.
     * @param {HTMLFormElement} form - The form element to validate.
     * @returns {boolean} - True if the form is valid.
     */
    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('[required]');
        
        inputs.forEach(input => {
            if (input.value.trim() === '' || (input.type === 'email' && !/^\S+@\S+\.\S+$/.test(input.value))) {
                isValid = false;
                showInputError(input, `${input.placeholder} tidak valid.`);
            } else {
                clearInputError(input);
            }
        });
        
        if (!isValid) {
            showFormFeedback('Silakan periksa kembali isian Anda.', 'error');
        }
        return isValid;
    }

    /**
     * Displays an error message for a specific input field.
     * @param {HTMLElement} input - The input element.
     * @param {string} message - The error message to display.
     */
    function showInputError(input, message) {
        input.classList.add('border-accent-pink');
        gsap.fromTo(input, {x:0}, {x: -10, duration: 0.05, repeat: 5, yoyo:true, ease: 'power1.inOut' });
    }

    /**
     * Clears error styling from an input.
     * @param {HTMLElement} input - The input element.
     */
    function clearInputError(input) {
        input.classList.remove('border-accent-pink');
    }

    /**
     * Shows a global feedback message for the form.
     * @param {string} message - The message to show.
     * @param {'success'|'error'} type - The type of message.
     */
    function showFormFeedback(message, type) {
        const feedbackEl = document.getElementById('form-feedback');
        feedbackEl.textContent = message;
        feedbackEl.className = `p-4 mb-4 text-lg rounded-md ${type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`;
        gsap.fromTo(feedbackEl, {opacity: 0, y: -20}, {opacity: 1, y: 0, duration: 0.5});
    }
    
    // --- UTILITIES ---
    /**
     * Updates the copyright year in the footer.
     */
    function updateFooterYear() {
        document.getElementById('current-year').textContent = new Date().getFullYear();
    }
    
    /**
     * A simple notification system.
     * @param {string} message - The message to display.
     */
    function showNotification(message) {
        const notif = document.createElement('div');
        notif.className = 'fixed bottom-5 right-5 bg-secondary text-white p-4 rounded-lg shadow-lg z-50 notification';
        notif.textContent = message;
        document.body.appendChild(notif);
        gsap.fromTo(notif, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
        gsap.to(notif, { opacity: 0, y: 20, duration: 0.5, ease: 'power2.in', delay: 3, onComplete: () => notif.remove() });
    }

    /**
     * Initializes smooth scrolling for internal links.
     */
    function smoothScroll() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener("click", function(e) {
                e.preventDefault();
                const targetId = this.getAttribute("href");
                const targetElement = document.querySelector(targetId);
                if(targetElement) {
                    gsap.to(window, {
                        duration: 1.5,
                        scrollTo: { y: targetElement, offsetY: 70 }, // Adjust offsetY for fixed header
                        ease: "power3.inOut"
                    });
                }
            });
        });
    }

    // Run the initialization
    init();

});