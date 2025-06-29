// JavaScript interaktif dengan GSAP dan validasi tingkat lanjut

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- PRELOADER ---
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        gsap.to(preloader, { opacity: 0, duration: 0.8, onComplete: () => preloader.style.display = 'none' });
    });

    // --- GSAP PLUGIN REGISTRATION ---
    gsap.registerPlugin(ScrollTrigger);
    
    // --- THREE.JS FUTURISTIC BACKGROUND ---
    function initWebGLBackground() {
        const container = document.getElementById('webgl-canvas');
        if (!container) return;

        let scene, camera, renderer, particles, mouseX = 0, mouseY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;
        
        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
            camera.position.z = 1000;

            const particleCount = 5000;
            const particlesGeometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);

            for (let i = 0; i < particleCount * 3; i++) {
                positions[i] = (Math.random() - 0.5) * 2000;
            }
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const particleMaterial = new THREE.PointsMaterial({
                color: 0x4361ee, // Warna partikel
                size: 2,
                transparent: true,
                opacity: 0.7,
                blending: THREE.AdditiveBlending
            });
            
            particles = new THREE.Points(particlesGeometry, particleMaterial);
            scene.add(particles);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            container.appendChild(renderer.domElement);
            
            document.addEventListener('mousemove', onDocumentMouseMove, false);
            window.addEventListener('resize', onWindowResize, false);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function onDocumentMouseMove(event) {
            mouseX = event.clientX - windowHalfX;
            mouseY = event.clientY - windowHalfY;
        }

        function animate() {
            requestAnimationFrame(animate);
            render();
        }

        function render() {
            const time = Date.now() * 0.00005;
            camera.position.x += (mouseX - camera.position.x) * 0.05;
            camera.position.y += (-mouseY - camera.position.y) * 0.05;
            camera.lookAt(scene.position);
            
            particles.rotation.x = time * 0.5;
            particles.rotation.y = time * 0.25;
            
            renderer.render(scene, camera);
        }

        init();
        animate();
    }
    initWebGLBackground();


    // --- DARK/LIGHT MODE TOGGLE ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    // Set initial theme based on localStorage or system preference
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlEl.classList.add('dark');
    } else {
        htmlEl.classList.remove('dark');
    }

    themeToggle.addEventListener('click', () => {
        htmlEl.classList.toggle('dark');
        localStorage.setItem('theme', htmlEl.classList.contains('dark') ? 'dark' : 'light');
    });

    // --- STICKY HEADER & SMOOTH SCROLL ---
    const header = document.getElementById('header');
    gsap.to(header, {
        scrollTrigger: {
            trigger: "body",
            start: "10px top",
            end: "bottom bottom",
            onEnter: () => header.classList.add('header-scrolled'),
            onLeaveBack: () => header.classList.remove('header-scrolled'),
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                gsap.to(window, { duration: 1, scrollTo: targetElement, ease: 'power2.inOut' });
            }
            // Close mobile menu on click
            if (mobileMenu.classList.contains('flex')) {
                mobileMenu.classList.remove('flex');
                mobileMenu.classList.add('hidden');
                menuBtn.innerHTML = `<i class="fas fa-bars"></i>`;
            }
        });
    });

    // --- MOBILE NAVIGATION ---
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    menuBtn.addEventListener('click', () => {
        const isOpened = mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('flex', !isOpened);
        menuBtn.innerHTML = isOpened ? `<i class="fas fa-bars"></i>` : `<i class="fas fa-times"></i>`;
        
        gsap.fromTo(mobileMenu, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        if(!isOpened){
            gsap.from(".mobile-nav-link", {
                opacity: 0,
                y: -20,
                stagger: 0.1,
                delay: 0.2,
            });
        }
    });

    // --- SCROLL-TRIGGERED ANIMATIONS ---
    // General section animation
    gsap.utils.toArray('.animate-section').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Hero animations
    gsap.from('.hero-title, .hero-subtitle, .cta-button', {
        opacity: 0,
        y: 30,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.5
    });

    // Skills progress bars animation
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        const progressBar = item.querySelector('.progress-bar-inner');
        const progressValue = progressBar.dataset.progress;

        gsap.from(progressBar, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            width: '0%',
            duration: 1.5,
            ease: 'power2.out'
        });
        progressBar.style.width = `${progressValue}%`;
    });
    
    // --- PROJECTS GALLERY FILTER ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');

            gsap.to(projectCards, {
                opacity: 0,
                scale: 0.9,
                duration: 0.3,
                stagger: 0.05,
                onComplete: () => {
                    projectCards.forEach(card => {
                        const category = card.getAttribute('data-category');
                        if (filterValue === 'all' || category === filterValue) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                    gsap.to(projectCards, {
                         opacity: 1,
                         scale: 1,
                         duration: 0.3,
                         stagger: 0.05
                    });
                }
            });
        });
    });
    // Animate initial project cards
    gsap.from(projectCards, {
        scrollTrigger: {
            trigger: '#project-gallery',
            start: 'top 80%',
        },
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 0.8
    });

    // --- CONTACT FORM VALIDATION ---
    const form = document.getElementById('contact-form');
    const feedbackEl = document.getElementById('form-feedback');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required]');

        inputs.forEach(input => {
            const parent = input.parentElement;
            if (!input.value.trim() || (input.type === 'email' && !/^\S+@\S+\.\S+$/.test(input.value))) {
                isValid = false;
                parent.classList.add('error');
                gsap.fromTo(parent, { x: 0 }, { x: -10, duration: 0.1, repeat: 3, yoyo: true, clearProps: "x" });
            } else {
                parent.classList.remove('error');
            }
        });
        
        feedbackEl.classList.remove('success-msg', 'error-msg');
        if (isValid) {
            feedbackEl.textContent = 'Terima kasih! Pesan Anda telah terkirim.';
            feedbackEl.classList.add('success-msg');
            form.reset();
        } else {
            feedbackEl.textContent = 'Mohon periksa kembali form, ada beberapa isian yang salah.';
            feedbackEl.classList.add('error-msg');
        }
         gsap.fromTo(feedbackEl, {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: 0.5});
    });
    
    // --- SCROLL TO TOP BUTTON ---
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    gsap.to(scrollToTopBtn, {
        scrollTrigger: {
            trigger: 'body',
            start: '300px top',
            end: 'bottom bottom',
            toggleActions: 'play none none reverse',
        },
        opacity: 1,
        y: 0,
        pointerEvents: 'auto',
        duration: 0.3
    });
    
    // --- FOOTER CURRENT YEAR ---
    document.getElementById('current-year').textContent = new Date().getFullYear();
});