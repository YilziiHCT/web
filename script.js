// JavaScript interaktif dengan GSAP, Three.js (WebGL), dan validasi tingkat lanjut

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    
    // =====================================================================
    // INITIALIZATION & GLOBAL VARIABLES
    // =====================================================================
    gsap.registerPlugin(ScrollTrigger);

    const SELECTORS = {
        themeToggle: '#theme-toggle',
        header: '#main-header',
        cartButton: '#cart-button',
        cartSidebar: '#cart-sidebar',
        cartOverlay: '#cart-overlay',
        closeCartBtn: '#close-cart-btn',
        cartCount: '#cart-count',
        cartItemsContainer: '#cart-items',
        cartSubtotal: '#cart-subtotal',
        emptyCartMsg: '#empty-cart-message',
        addToCartBtns: '.add-to-cart-btn',
        mobileMenuBtn: '#mobile-menu-button',
        mobileMenu: '#mobile-menu',
        mobileLinks: '.mobile-nav-link',
        contactForm: '#contact-form',
        formSuccess: '#form-success',
        productCards: '.product-card',
        webglCanvas: '#webgl-canvas',
    };

    const ELS = Object.keys(SELECTORS).reduce((acc, key) => {
        // querySelectorAll for classes/multiple elements
        if (key.endsWith('s') || key.includes('Btn')) {
            acc[key] = document.querySelectorAll(SELECTORS[key]);
        } else {
            acc[key] = document.querySelector(SELECTORS[key]);
        }
        return acc;
    }, {});
    
    let cart = JSON.parse(localStorage.getItem('toko_online_cart')) || [];

    // =====================================================================
    // 3D WEBGL PARTICLE BACKGROUND (using Three.js)
    // =====================================================================
    const initWebGLBackground = () => {
        if (!ELS.webglCanvas) return;
        
        let scene, camera, renderer, particles, particleSystem;
        let mouseX = 0, mouseY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;
    
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 2, 2000);
        camera.position.z = 1000;
    
        renderer = new THREE.WebGLRenderer({ canvas: ELS.webglCanvas, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
        const material = new THREE.PointsMaterial({
            size: 1.5,
            color: 0x00f2fe, // Neon accent color
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.8
        });
    
        particles = new THREE.BufferGeometry();
        const particleCount = 5000;
        const positions = new Float32Array(particleCount * 3);
    
        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 2000;
        }
    
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleSystem = new THREE.Points(particles, material);
        scene.add(particleSystem);
    
        const onDocumentMouseMove = (event) => {
            mouseX = event.clientX - windowHalfX;
            mouseY = event.clientY - windowHalfY;
        };
    
        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
    
        const animate = () => {
            requestAnimationFrame(animate);
            const time = Date.now() * 0.00005;
            camera.position.x += (mouseX - camera.position.x) * 0.05;
            camera.position.y += (-mouseY - camera.position.y) * 0.05;
            camera.lookAt(scene.position);
            particleSystem.rotation.y = time * 0.5;
            renderer.render(scene, camera);
        };
    
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        window.addEventListener('resize', onWindowResize, false);
        animate();
    };

    // =====================================================================
    // THEME (DARK/LIGHT MODE)
    // =====================================================================
    const setupTheme = () => {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.className = currentTheme;
        ELS.themeToggle.innerHTML = `<i class="fa-solid fa-${currentTheme === 'dark' ? 'sun' : 'moon'}"></i>`;

        ELS.themeToggle.addEventListener('click', () => {
            let theme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
            document.documentElement.classList.toggle('dark');
            document.documentElement.classList.toggle('light');
            localStorage.setItem('theme', theme);
            ELS.themeToggle.innerHTML = `<i class="fa-solid fa-${theme === 'dark' ? 'sun' : 'moon'}"></i>`;
        });
    };

    // =====================================================================
    // UI & GSAP ANIMATIONS
    // =====================================================================
    const setupAnimations = () => {
        // --- Header Scroll Effect ---
        gsap.to(ELS.header, {
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: '+=100',
                scrub: 1,
                onEnter: () => ELS.header.classList.add('scrolled'),
                onLeaveBack: () => ELS.header.classList.remove('scrolled'),
            }
        });

        // --- Hero Section Animation ---
        gsap.from("#hero-title .word", { y: 50, opacity: 0, stagger: 0.2, duration: 1, ease: "power3.out" });
        gsap.to("#hero-subtitle", { y: 0, opacity: 1, duration: 1, delay: 0.8, ease: "power3.out" });
        gsap.to("#hero-cta", { y: 0, opacity: 1, duration: 1, delay: 1.2, ease: "power3.out" });
        
        // --- Section Titles and Content Fade-in ---
        document.querySelectorAll('.section-title, .product-card, #contact form > *, footer > *').forEach(el => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        // --- Smooth Scrolling for Nav Links ---
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: { y: this.getAttribute('href'), offsetY: 70 },
                    ease: "power2.inOut"
                });
                if (ELS.mobileMenu.classList.contains('open')) {
                    toggleMobileMenu();
                }
            });
        });
    };

    // =====================================================================
    // MOBILE NAVIGATION
    // =====================================================================
    const toggleMobileMenu = () => {
        const isOpen = ELS.mobileMenu.classList.toggle('open');
        ELS.mobileMenuBtn.innerHTML = `<i class="fa-solid fa-${isOpen ? 'times' : 'bars'}"></i>`;
        gsap.to(ELS.mobileMenu, {
            x: isOpen ? '0%' : '100%',
            duration: 0.5,
            ease: 'power3.inOut'
        });
    };

    // =====================================================================
    // SHOPPING CART LOGIC
    // =====================================================================
    const cartManager = {
        save() {
            localStorage.setItem('toko_online_cart', JSON.stringify(cart));
        },
        add(item) {
            const existingItem = cart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...item, quantity: 1 });
            }
            this.save();
            this.update();
            this.showCart();

            // Animate cart icon
            gsap.timeline()
                .to(ELS.cartButton, { scale: 1.2, duration: 0.2, ease: 'power2.out' })
                .to(ELS.cartButton, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.3)' });
        },
        remove(id) {
            cart = cart.filter(item => item.id !== id);
            this.save();
            this.update();
        },
        update() {
            this.renderItems();
            this.updateCount();
            this.updateSubtotal();
        },
        renderItems() {
            if (cart.length === 0) {
                ELS.cartItemsContainer.innerHTML = '';
                ELS.emptyCartMsg.style.display = 'block';
                return;
            }

            ELS.emptyCartMsg.style.display = 'none';
            ELS.cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item flex items-center justify-between py-4" data-id="${item.id}">
                    <div class="flex items-center gap-4">
                        <img src="${item.imageUrl}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                        <div>
                            <h4 class="font-bold">${item.name}</h4>
                            <p class="text-textSecondary text-sm">${formatCurrency(item.price)} x ${item.quantity}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <p class="font-bold">${formatCurrency(item.price * item.quantity)}</p>
                        <button class="text-red-500 hover:text-red-400 remove-from-cart-btn" data-id="${item.id}">&times;</button>
                    </div>
                </div>
            `).join('');

            // Add event listeners to new remove buttons
            document.querySelectorAll('.remove-from-cart-btn').forEach(btn => {
                btn.addEventListener('click', (e) => this.remove(e.target.dataset.id));
            });
        },
        updateCount() {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            ELS.cartCount.textContent = totalItems;
            gsap.to(ELS.cartCount, {
                scale: totalItems > 0 ? 1 : 0,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        },
        updateSubtotal() {
            const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            ELS.cartSubtotal.textContent = formatCurrency(subtotal);
        },
        showCart() {
            ELS.cartOverlay.style.display = 'block';
            gsap.to(ELS.cartOverlay, { opacity: 1, duration: 0.3 });
            gsap.to(ELS.cartSidebar, { x: '0%', duration: 0.5, ease: 'power3.inOut' });
        },
        hideCart() {
            gsap.to(ELS.cartOverlay, { opacity: 0, duration: 0.3, onComplete: () => ELS.cartOverlay.style.display = 'none' });
            gsap.to(ELS.cartSidebar, { x: '100%', duration: 0.5, ease: 'power3.inOut' });
        }
    };

    const formatCurrency = (amount) => {
        return `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`;
    };

    // =====================================================================
    // FORM VALIDATION
    // =====================================================================
    const formValidator = {
        init() {
            ELS.contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.validate()) {
                    this.showSuccess();
                } else {
                    gsap.fromTo(ELS.contactForm, { x: 0 }, { x: -10, duration: 0.05, repeat: 5, yoyo: true, clearProps: 'x' });
                }
            });
            
            ELS.contactForm.querySelectorAll('input, textarea').forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.validateField(input));
            });
        },
        validate() {
            let isValid = true;
            ELS.contactForm.querySelectorAll('input[required], textarea[required]').forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });
            return isValid;
        },
        validateField(input) {
            const parent = input.closest('.form-group');
            let isValid = true;

            if (input.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(input.value);
            } else {
                isValid = input.value.trim() !== '';
            }

            if(isValid) {
                parent.classList.remove('has-error');
            } else {
                parent.classList.add('has-error');
            }
            return isValid;
        },
        showSuccess() {
            ELS.contactForm.reset();
            ELS.formSuccess.classList.remove('hidden');
            gsap.fromTo(ELS.formSuccess, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
            setTimeout(() => {
                gsap.to(ELS.formSuccess, { opacity: 0, y: -20, duration: 0.5, onComplete: () => ELS.formSuccess.classList.add('hidden') });
            }, 3000);
        }
    };
    
    // =====================================================================
    // EVENT LISTENERS
    // =====================================================================
    const setupEventListeners = () => {
        // --- Cart Listeners ---
        ELS.addToCartBtns.forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.product-card');
                const productData = {
                    id: card.dataset.productId,
                    name: card.dataset.name,
                    price: parseFloat(card.dataset.price),
                    imageUrl: card.dataset.imageUrl
                };
                cartManager.add(productData);
            });
        });

        ELS.cartButton.addEventListener('click', cartManager.showCart);
        ELS.closeCartBtn.addEventListener('click', cartManager.hideCart);
        ELS.cartOverlay.addEventListener('click', cartManager.hideCart);

        // --- Mobile Menu ---
        ELS.mobileMenuBtn.addEventListener('click', toggleMobileMenu);

        // --- Dynamic Year in Footer ---
        document.getElementById('year').textContent = new Date().getFullYear();
    };

    // =====================================================================
    // SCRIPT EXECUTION
    // =====================================================================
    
    // Check if required elements exist before running scripts
    if(ELS.webglCanvas) initWebGLBackground();
    if(ELS.themeToggle) setupTheme();
    if(ELS.header) setupAnimations();
    if(ELS.cartButton) {
      cartManager.update(); // Initial update on page load
    }
    if(ELS.contactForm) formValidator.init();

    setupEventListeners();

});