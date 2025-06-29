// JavaScript interaktif dengan GSAP dan validasi tingkat lanjut
'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // --- GSAP Plugin Registration ---
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        gsap.to(preloader, { 
            opacity: 0, 
            duration: 0.8, 
            onComplete: () => preloader.style.display = 'none' 
        });
        
        // Trigger animations after preloader is done
        initAnimations();
    });
    
    // --- Dark/Light Mode Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            lightIcon.classList.add('hidden');
            darkIcon.classList.remove('hidden');
        } else {
            document.documentElement.classList.remove('dark');
            lightIcon.classList.remove('hidden');
            darkIcon.classList.add('hidden');
        }
    };
    
    // Check for saved theme in localStorage or system preference
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    });

    // --- Smooth Scrolling for Nav Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                gsap.to(window, {
                    duration: 1.2,
                    scrollTo: {
                        y: targetElement,
                        offsetY: 70 // Adjust offset for fixed header
                    },
                    ease: 'power3.inOut'
                });
            }
             // Close mobile menu on click
            if (mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
    
    // --- Header Scroll Effect ---
    const header = document.getElementById('header');
    ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        onUpdate: self => {
            if (self.direction === 1) { // Scrolling down
                header.classList.add('scrolled');
            } else { // Scrolling up
                if (window.scrollY < 50) {
                     header.classList.remove('scrolled');
                }
            }
        }
    });

    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuIcon = mobileMenuButton.querySelector('i');

    const toggleMobileMenu = () => {
        mobileMenu.classList.toggle('active');
        if (mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('-translate-y-full');
            mobileMenuIcon.classList.replace('fa-bars', 'fa-xmark');
            mobileMenuButton.setAttribute('aria-expanded', 'true');
        } else {
            mobileMenu.classList.add('-translate-y-full');
            mobileMenuIcon.classList.replace('fa-xmark', 'fa-bars');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
        }
    }
    mobileMenuButton.addEventListener('click', toggleMobileMenu);

    // --- Scroll-Triggered Animations ---
    function initAnimations() {
        // Hero text animation
        gsap.from(".hero-text-reveal", {
            y: 100,
            opacity: 0,
            stagger: 0.2,
            duration: 1,
            ease: "power3.out",
            delay: 0.5
        });

        // Generic reveal animation for sections
        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // Skills progress bars animation
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            gsap.to(bar, {
                width: bar.dataset.level,
                duration: 1.5,
                ease: 'power3.inOut',
                scrollTrigger: {
                    trigger: bar.parentElement,
                    start: 'top 85%',
                }
            });
        });
    }

    // --- Project Gallery Filter ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button style
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            
            projectItems.forEach(item => {
                const matches = filterValue === '*' || item.classList.contains(filterValue.substring(1));
                gsap.to(item, {
                    duration: 0.5,
                    opacity: matches ? 1 : 0,
                    scale: matches ? 1 : 0.8,
                    display: matches ? 'block' : 'none',
                    ease: 'power3.out'
                });
            });
        });
    });

    // --- Contact Form Validation ---
    const form = document.getElementById('contact-form');
    const feedbackEl = document.getElementById('form-feedback');
    
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
            group.querySelector('.form-error-msg').textContent = '';
        });

        const name = form.querySelector('#name');
        const email = form.querySelector('#email');
        const message = form.querySelector('#message');
        
        // Name validation
        if (name.value.trim() === '') {
            showError(name, 'Name cannot be empty.');
            isValid = false;
        }

        // Email validation
        if (email.value.trim() === '') {
            showError(email, 'Email cannot be empty.');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            showError(email, 'Please enter a valid email address.');
            isValid = false;
        }

        // Message validation
        if (message.value.trim() === '') {
            showError(message, 'Message cannot be empty.');
            isValid = false;
        }

        if (isValid) {
            // Simulate form submission
            showFeedback('success', 'Thank you! Your message has been sent successfully.');
            form.reset();
        } else {
            showFeedback('error', 'Please correct the errors before submitting.');
        }
    });

    function showError(input, message) {
        const formGroup = input.parentElement;
        formGroup.classList.add('error');
        formGroup.querySelector('.form-error-msg').textContent = message;
        input.classList.add('animate__animated', 'animate__shakeX');
        input.addEventListener('animationend', () => {
             input.classList.remove('animate__animated', 'animate__shakeX');
        });
    }

    function showFeedback(type, message) {
        feedbackEl.className = 'p-4 rounded-lg text-center'; // Reset classes
        if (type === 'success') {
            feedbackEl.classList.add('bg-green-500/20', 'text-green-300');
        } else {
            feedbackEl.classList.add('bg-red-500/20', 'text-red-300');
        }
        feedbackEl.textContent = message;
        gsap.fromTo(feedbackEl, { y: -20, opacity: 0, display: 'none' }, { y: 0, opacity: 1, display: 'block', duration: 0.5 });
    }
    
    // --- Scroll-to-Top Button ---
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    ScrollTrigger.create({
        start: 'top -500',
        end: 99999,
        onUpdate: self => {
            if (self.isActive && self.direction === 1) {
                gsap.to(scrollToTopBtn, { opacity: 1, y: 0, duration: 0.3 });
            } else if (!self.isActive || (self.direction === -1 && window.scrollY < 500)) {
                gsap.to(scrollToTopBtn, { opacity: 0, y: -16, duration: 0.3 });
            }
        }
    });

    // --- Footer Year ---
    document.getElementById('current-year').textContent = new Date().getFullYear();
});