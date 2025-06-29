// JavaScript interaktif dengan GSAP untuk animasi canggih, validasi form, dan fitur modern.
document.addEventListener('DOMContentLoaded', () => {

    // === Preloader ===
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        gsap.to(preloader, {
            opacity: 0,
            duration: 0.8,
            onComplete: () => {
                preloader.style.display = 'none';
            }
        });
        
        // Mulai animasi utama setelah preloader hilang
        startMainAnimations();
    });

    // === GSAP Plugin Registration ===
    gsap.registerPlugin(ScrollTrigger);

    // === Theme (Dark/Light Mode) Toggle ===
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const sunIcon = '<i class="fas fa-sun"></i>';
    const moonIcon = '<i class="fas fa-moon"></i>';

    // Periksa tema yang tersimpan di localStorage
    if (localStorage.getItem('theme') === 'light') {
        htmlEl.classList.remove('dark');
        themeToggle.innerHTML = moonIcon;
    } else {
        htmlEl.classList.add('dark');
        themeToggle.innerHTML = sunIcon;
    }

    themeToggle.addEventListener('click', () => {
        if (htmlEl.classList.contains('dark')) {
            htmlEl.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = moonIcon;
        } else {
            htmlEl.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = sunIcon;
        }
        gsap.from(themeToggle, { scale: 0.5, rotation: 180, duration: 0.5 });
    });
    
    // === Sticky Header & Scroll to Top Button ===
    const header = document.getElementById('header');
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
            gsap.to(scrollToTopBtn, { y: 0, opacity: 1, duration: 0.3 });
        } else {
            header.classList.remove('header-scrolled');
            gsap.to(scrollToTopBtn, { y: 80, opacity: 0, duration: 0.3 });
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // === Mobile Menu ===
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        gsap.fromTo(mobileMenu, 
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
    });
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });

    // === Main Animations Function ===
    function startMainAnimations() {
        // Hero Section Animation
        gsap.from(".animate-text-reveal", {
            y: 100,
            opacity: 0,
            stagger: 0.2,
            duration: 1,
            ease: 'power4.out',
            delay: 0.5
        });

        // Typewriter Effect
        const typewriterEl = document.querySelector('.typewriter');
        const textToType = "Menciptakan Masa Depan Digital, Satu Baris Kode demi Satu Baris.";
        let i = 0;
        function typeWriter() {
            if (i < textToType.length) {
                typewriterEl.innerHTML += textToType.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        setTimeout(typeWriter, 1500); // Start after title animation
        
        // General Scroll-triggered Animations for Sections
        gsap.utils.toArray('.scroll-section').forEach(section => {
            gsap.from(section.children, {
                y: 50,
                opacity: 0,
                stagger: 0.2,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Skills Progress Bar Animation
        gsap.utils.toArray('.skill-item').forEach(item => {
            const progress = item.dataset.progress;
            const progressBar = item.querySelector('.skill-progress-fill');
            gsap.fromTo(progressBar, 
                { width: '0%' },
                {
                    width: `${progress}%`,
                    duration: 1.5,
                    ease: 'power2.inOut',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%'
                    }
                }
            );
        });
    }

    // === Project Gallery Filter ===
    const filterContainer = document.getElementById('project-filters');
    const projectGrid = document.getElementById('project-grid');
    const projectCards = gsap.utils.toArray('.project-card');

    filterContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const filterValue = e.target.getAttribute('data-filter');
            
            // Update active button state
            filterContainer.querySelector('.active').classList.remove('active');
            e.target.classList.add('active');

            // Animate cards
            gsap.to(projectCards, {
                duration: 0.3,
                opacity: 0,
                scale: 0.95,
                y: 20,
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

                    gsap.to(projectCards.filter(card => card.style.display === 'block'), {
                        duration: 0.4,
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        stagger: 0.05,
                    });
                }
            });
        }
    });

    // === Contact Form Validation ===
    const form = document.getElementById('contact-form');
    const feedbackEl = document.getElementById('form-feedback');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        
        const inputs = form.querySelectorAll('input[required], textarea[required]');

        inputs.forEach(input => {
            const errorEl = input.nextElementSibling;
            if (!input.checkValidity()) {
                isValid = false;
                input.classList.add('input-error');
                input.classList.add('animate__animated', 'animate__shakeX');
                if (input.type === 'email') {
                    errorEl.textContent = 'Format email tidak valid.';
                } else {
                    errorEl.textContent = 'Kolom ini wajib diisi.';
                }
                setTimeout(() => {
                    input.classList.remove('animate__animated', 'animate__shakeX');
                }, 1000);
            } else {
                input.classList.remove('input-error');
                errorEl.textContent = '';
            }
        });

        if (isValid) {
            feedbackEl.textContent = 'Mengirim pesan...';
            feedbackEl.className = 'text-sky-400';

            // Simulate form submission
            setTimeout(() => {
                feedbackEl.textContent = 'Pesan Anda berhasil terkirim! Terima kasih.';
                feedbackEl.className = 'text-green-500 font-bold';
                form.reset();
                gsap.to('#contact-form button', {
                    opacity: 0.5,
                    pointerEvents: 'none'
                });
            }, 1500);
        } else {
            feedbackEl.textContent = 'Harap perbaiki kesalahan sebelum mengirim.';
            feedbackEl.className = 'text-red-500';
        }
    });
    
    // === Footer Year ===
    document.getElementById('current-year').textContent = new Date().getFullYear();
});