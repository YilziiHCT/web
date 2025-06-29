document.addEventListener('DOMContentLoaded', () => {

    // --- UTILITIES ---
    const select = (el, all = false) => {
        el = el.trim()
        if (all) {
            return [...document.querySelectorAll(el)]
        } else {
            return document.querySelector(el)
        }
    }

    const on = (type, el, listener) => {
        let selectEl = select(el)
        if (selectEl) {
            selectEl.addEventListener(type, listener)
        }
    }

    // --- HEADER ON SCROLL ---
    const header = select('#header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('glassmorphism', 'shadow-lg');
            } else {
                header.classList.remove('glassmorphism', 'shadow-lg');
            }
        });
    }

    // --- THEME (DARK/LIGHT) TOGGLE ---
    const themeToggleBtn = select('#theme-toggle');
    const lightIcon = select('#theme-toggle-light-icon');
    const darkIcon = select('#theme-toggle-dark-icon');

    // Set initial icon state based on theme
    if (document.documentElement.classList.contains('dark')) {
        darkIcon.classList.remove('hidden');
        lightIcon.classList.add('hidden');
    }

    on('click', '#theme-toggle', () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        darkIcon.classList.toggle('hidden', !isDark);
        lightIcon.classList.toggle('hidden', isDark);
    });

    // --- MOBILE MENU TOGGLE ---
    const mobileMenuButton = select('#mobile-menu-button');
    const mobileMenu = select('#mobile-menu');
    on('click', '#mobile-menu-button', () => {
        mobileMenu.classList.toggle('hidden');
    });
    // Close mobile menu when a link is clicked
    select('.mobile-nav-link', true).forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // --- SCROLL-TRIGGERED ANIMATIONS ---
    const scrollRevealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate progress bars
                if (entry.target.id === 'skills') {
                    animateProgressBars();
                }
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, { rootMargin: "0px 0px -100px 0px" });

    select('.scroll-reveal', true).forEach(el => {
        scrollRevealObserver.observe(el);
    });
    
    // --- SKILLS PROGRESS BAR ANIMATION ---
    function animateProgressBars() {
        select('.progress', true).forEach(progress => {
            const targetWidth = progress.getAttribute('data-width');
            progress.style.width = targetWidth;
        });
    }

    // --- PORTFOLIO FILTER ---
    const filterContainer = select('#portfolio-filters');
    const filterBtns = select('.filter-btn', true);
    const portfolioItems = select('.portfolio-item', true);

    if (filterContainer) {
        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                const filterValue = e.target.getAttribute('data-filter');
                
                // Update active button
                filterBtns.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                // Filter items
                portfolioItems.forEach(item => {
                    item.classList.add('hidden'); // Use a class for transition
                    setTimeout(() => { // Needed for transition to work properly
                        if (filterValue === 'all' || item.dataset.category === filterValue) {
                           item.classList.remove('hidden');
                        }
                    }, 50); 
                });
            }
        });
    }

    // --- CONTACT FORM VALIDATION ---
    const contactForm = select('#contact-form');
    if(contactForm){
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isFormValid = validateForm();
            
            const formMessage = select('#form-message');

            if(isFormValid){
                // Simulate form submission
                formMessage.textContent = 'Pesan Anda telah berhasil dikirim. Terima kasih!';
                formMessage.className = 'block mb-4 p-3 rounded-lg text-center bg-green-500/20 text-green-400';
                contactForm.reset();
                setTimeout(() => formMessage.className = 'hidden', 5000);
            } else {
                 formMessage.textContent = 'Harap perbaiki error sebelum mengirim.';
                 formMessage.className = 'block mb-4 p-3 rounded-lg text-center bg-red-500/20 text-red-400';
            }
        });
    }
    
    function validateForm() {
        let isValid = true;
        const inputs = select('#contact-form [required]', true);

        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        return isValid;
    }
    
    function validateInput(input) {
         let valid = true;
         const errorMessageEl = input.nextElementSibling;
         
         // Reset
         input.classList.remove('error');
         errorMessageEl.textContent = '';
         
         if (input.hasAttribute('required') && input.value.trim() === '') {
             showError(input, 'Field ini wajib diisi.');
             valid = false;
         }
         
         if (input.type === 'email' && input.value.trim() !== '') {
             const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
             if (!emailRegex.test(input.value)) {
                 showError(input, 'Format email tidak valid.');
                 valid = false;
             }
         }
         
         return valid;
    }

    function showError(input, message) {
        input.classList.add('error');
        const errorMessageEl = input.nextElementSibling;
        errorMessageEl.textContent = message;
    }

    // Real-time validation on blur
    select('#contact-form [required]', true).forEach(input => {
        input.addEventListener('blur', () => validateInput(input));
    });

});