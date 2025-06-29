// JavaScript interaktif, modern, dengan smooth scroll dan validasi form */

document.addEventListener('DOMContentLoaded', () => {

    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const header = document.getElementById('header');
    const backToTopButton = document.getElementById('back-to-top');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectGallery = document.getElementById('project-gallery');
    const projectItems = document.querySelectorAll('.project-item');
    const contactForm = document.getElementById('contact-form');
    
    // 1. Dark/Light Mode Toggle
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark' || (!currentTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
        themeToggle.innerHTML = '<i class="fas fa-moon text-xl"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-sun text-xl"></i>';
    }

    themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-moon text-xl"></i>' : '<i class="fas fa-sun text-xl"></i>';
    });
    
    // 2. Mobile Menu
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenuButton.innerHTML = mobileMenu.classList.contains('hidden') ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
    });
    // Close mobile menu on link click
    mobileMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            mobileMenu.classList.add('hidden');
            mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    // 3. Header styling on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('glassmorphism-dark', 'shadow-lg');
        } else {
            header.classList.remove('glassmorphism-dark', 'shadow-lg');
        }
        
        // Back to top button
        if (window.scrollY > 300) {
            backToTopButton.classList.remove('hidden', 'scale-0');
            backToTopButton.classList.add('flex', 'scale-100');
        } else {
            backToTopButton.classList.add('scale-0');
            setTimeout(() => {
                if(window.scrollY <= 300) backToTopButton.classList.add('hidden');
            }, 300); // match transition duration
        }
    });

    // 4. Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId.length > 1) { // Ensure it's not just "#"
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
     // Back to top functionality
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 5. Scroll-triggered animations with Intersection Observer
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // Animate progress bars
                const progressBars = entry.target.querySelectorAll('.progress');
                progressBars.forEach(bar => {
                    bar.style.width = bar.dataset.width;
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    animatedElements.forEach(el => observer.observe(el));
    
    // 6. Project gallery filtering
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Manage active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;
            
            projectItems.forEach(item => {
                // Add group-hover utility to parent for hover effects to work
                item.classList.add('group');

                item.classList.remove('project-item-hidden');
                item.style.display = 'block';

                const category = item.dataset.category;
                
                if (filter === 'all' || filter === category) {
                    item.style.animation = 'fadeIn 0.5s';
                } else {
                    item.style.animation = 'fadeOut 0.5s forwards';
                     setTimeout(() => {
                        item.classList.add('project-item-hidden');
                    }, 500); // Hide after animation
                }
            });
        });
    });

    // Add CSS for fade animations dynamically
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes fadeOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.9); } }
    `;
    document.head.appendChild(styleSheet);


    // 7. Contact form real-time validation
    const formInputs = contactForm.querySelectorAll('input[required], textarea[required]');
    
    const validateField = (field) => {
        const errorMsg = field.nextElementSibling;
        let isValid = false;

        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(field.value);
        } else {
            isValid = field.value.trim() !== '';
        }

        if (isValid) {
            field.classList.remove('border-red-400');
            field.classList.add('border-green-400');
            errorMsg.style.display = 'none';
        } else {
            field.classList.remove('border-green-400');
            field.classList.add('border-red-400');
            errorMsg.style.display = 'block';
        }
        return isValid;
    };
    
    formInputs.forEach(input => {
        input.addEventListener('input', () => validateField(input));
    });

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isFormValid = true;
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            console.log('Form is valid. Simulating submission...');
            // Here you would typically send the data with fetch() or AJAX
            // For demonstration, we'll just show a success message
            this.style.display = 'none';
            document.getElementById('form-success').style.display = 'block';
        } else {
            console.log('Form has errors.');
        }
    });

    // 8. Set current year in footer
    document.getElementById('year').textContent = new
    Date().getFullYear();
});