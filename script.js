// JavaScript interaktif dengan GSAP dan validasi tingkat lanjut

document.addEventListener('DOMContentLoaded', () => {
    
    // Inisialisasi GSAP dan ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // --- PRELOADER ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            gsap.to(preloader, {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    preloader.style.display = 'none';
                    // Mulai animasi utama setelah preloader hilang
                    animateOnLoad();
                }
            });
        });
    }

    // --- Animasi Awal ---
    function animateOnLoad() {
        gsap.timeline()
            .from('[data-animate]', {
                opacity: 0,
                y: 50,
                stagger: 0.2,
                duration: 0.8,
                ease: 'power3.out'
            });
    }

    // --- DARK/LIGHT MODE TOGGLE ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlEl = document.documentElement;

    // Cek tema tersimpan di localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        htmlEl.classList.add('dark');
        if (themeIcon) themeIcon.className = 'fas fa-moon text-xl text-indigo-300';
    } else {
        htmlEl.classList.remove('dark');
         if (themeIcon) themeIcon.className = 'fas fa-sun text-xl text-yellow-300';
    }

    themeToggle.addEventListener('click', () => {
        gsap.to(themeIcon, { scale: 0, rotation: 90, duration: 0.3, onComplete: () => {
            htmlEl.classList.toggle('dark');
            const isDark = htmlEl.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            themeIcon.className = isDark 
                ? 'fas fa-moon text-xl text-indigo-300' 
                : 'fas fa-sun text-xl text-yellow-300';
            
            gsap.to(themeIcon, { scale: 1, rotation: 0, duration: 0.3 });
        }});
    });


    // --- HEADER SCROLL EFFECT ---
    const header = document.getElementById('header');
    if(header){
        ScrollTrigger.create({
            start: "top -80",
            end: 99999,
            toggleClass: {className: "scrolled", targets: "#header"}
        });
    }

    // --- SMOOTH SCROLLING ---
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
                        offsetY: 70 // Offset untuk header
                    },
                    ease: 'power2.inOut'
                });
            }

            // Tutup menu mobile jika terbuka
            const mobileMenu = document.getElementById('mobile-menu');
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });

    // --- SCROLL-TRIGGERED ANIMATIONS ---
    const animatedElements = gsap.utils.toArray('[data-animate]');
    animatedElements.forEach(el => {
        const animationType = el.dataset.animate || 'fade-up';
        const delay = parseFloat(el.dataset.animateDelay) || 0;

        let animationProps = {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out',
            delay: delay
        };

        if (animationType === 'fade-right') animationProps = {...animationProps, x: -100, y: 0};
        if (animationType === 'fade-left') animationProps = {...animationProps, x: 100, y: 0};
        if (animationType === 'zoom-in') animationProps = {...animationProps, scale: 0.8, y:0};

        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            ...animationProps
        });
    });

    // --- SKILLS PROGRESS BARS ANIMATION ---
    const skillBars = gsap.utils.toArray('.skill-bar');
    skillBars.forEach(bar => {
        const progress = bar.dataset.progress;
        gsap.fromTo(bar, 
            { width: '0%' },
            { 
                width: `${progress}%`,
                duration: 1.5,
                ease: 'power2.inOut',
                scrollTrigger: {
                    trigger: bar.closest('.skill-card'),
                    start: 'top 80%'
                }
            }
        );
    });

    // --- PROJECT GALLERY FILTERING ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectGrid = document.getElementById('project-grid');
    const projectCards = gsap.utils.toArray('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            
            // GSAP animation for filtering
            const timeline = gsap.timeline();
            timeline.to(projectCards, {
                duration: 0.3,
                opacity: 0,
                scale: 0.9,
                stagger: 0.05,
                onComplete: () => {
                    projectCards.forEach(card => {
                        const category = card.dataset.category;
                        if (filter === 'all' || filter === category) {
                           card.style.display = 'block';
                        } else {
                           card.style.display = 'none';
                        }
                    });
                     // Animate visible cards back in
                    const visibleCards = projectCards.filter(card => card.style.display === 'block');
                    gsap.to(visibleCards, {
                        duration: 0.4,
                        opacity: 1,
                        scale: 1,
                        stagger: 0.05
                    });
                }
            });
        });
    });

    // --- CONTACT FORM VALIDATION ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let isValid = true;

            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            const formStatus = document.getElementById('form-status');

            // Reset states
            [name, email, message].forEach(input => {
                input.parentElement.classList.remove('error');
                input.parentElement.querySelector('.error-message').textContent = '';
            });

            // Validate Name
            if (name.value.trim() === '') {
                isValid = false;
                showError(name, 'Nama tidak boleh kosong.');
            }

            // Validate Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.value.trim() === '') {
                isValid = false;
                showError(email, 'Email tidak boleh kosong.');
            } else if (!emailRegex.test(email.value)) {
                isValid = false;
                showError(email, 'Format email tidak valid.');
            }

            // Validate Message
            if (message.value.trim() === '') {
                isValid = false;
                showError(message, 'Pesan tidak boleh kosong.');
            }

            if (isValid) {
                // Handle successful submission
                formStatus.innerHTML = `<p class="text-green-400">Pesan Anda berhasil dikirim! Terima kasih.</p>`;
                contactForm.reset();
                 gsap.from(formStatus, {opacity: 0, y: 20, duration: 0.5});
            } else {
                formStatus.innerHTML = `<p class="text-red-400">Silakan perbaiki error sebelum mengirim.</p>`;
                 gsap.from(formStatus, {opacity: 0, y: 20, duration: 0.5});
            }
        });
    }

    function showError(input, message) {
        const formGroup = input.parentElement;
        formGroup.classList.add('error');
        formGroup.querySelector('.error-message').textContent = message;
        gsap.fromTo(formGroup, {x: -10}, {x: 10, duration: 0.1, repeat: 3, yoyo: true, clearProps: 'x'});
    }

    // --- MOBILE MENU ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // --- FOOTER CURRENT YEAR ---
    document.getElementById('current-year').textContent = new Date().getFullYear();

});