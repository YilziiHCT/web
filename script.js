// JavaScript interaktif, modern, dengan smooth scroll dan validasi form

document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        preloader.classList.add('animate__animated', 'animate__fadeOut');
        preloader.addEventListener('animationend', () => {
            preloader.style.display = 'none';
        });
    });

    // --- Dark/Light Mode Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const html = document.documentElement;

    // Set initial theme based on localStorage or system preference
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        html.classList.remove('dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        if (html.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    });
    
    // --- Sticky Header on Scroll ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuIcon = mobileMenuButton.querySelector('i');
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        if(mobileMenu.classList.contains('hidden')){
            mobileMenuIcon.classList.remove('fa-times');
            mobileMenuIcon.classList.add('fa-bars');
        } else {
            mobileMenuIcon.classList.remove('fa-bars');
            mobileMenuIcon.classList.add('fa-times');
        }
    });
    
    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenuIcon.classList.remove('fa-times');
            mobileMenuIcon.classList.add('fa-bars');
        });
    });


    // --- Typed.js for Hero Section ---
    const typedTextSpan = document.getElementById('typed-text');
    const textArray = ["Futuristic", "Elegant", "Responsive", "Professional"];
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, 100);
        } else {
            setTimeout(erase, 2000);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, 50);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, 500);
        }
    }
    type();

    // --- Scroll-triggered Animations ---
    const scrollAnimateElements = document.querySelectorAll('.scroll-animate');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animation = entry.target.dataset.animation || 'animate__fadeInUp';
                const delay = entry.target.dataset.delay;
                entry.target.classList.add('animate__animated', animation, 'opacity-100');
                if (delay) {
                    entry.target.style.animationDelay = `${delay}ms`;
                }
                
                // Animate progress bars if they are in the skill section
                const skillProgress = entry.target.querySelector('.skill-progress');
                if(skillProgress){
                   const progress = skillProgress.dataset.progress;
                   const progressValue = skillProgress.querySelector('.progress-value');
                   skillProgress.style.setProperty('--progress', `${progress}%`);
                   let start = 0;
                   const duration = 1500;
                   const step = (timestamp) => {
                       if(!start) start = timestamp;
                       const progressTime = timestamp - start;
                       const currentProgress = Math.min(Math.floor((progressTime/duration) * progress), progress);
                       progressValue.textContent = `${currentProgress}%`;
                       if(currentProgress < progress) {
                           requestAnimationFrame(step);
                       }
                   }
                   requestAnimationFrame(step);
                }

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    scrollAnimateElements.forEach(el => {
        el.classList.add('opacity-0'); // Initially hide elements
        observer.observe(el);
    });
    
    // --- Portfolio Gallery Filter ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button style
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;

            projectCards.forEach(card => {
                card.style.display = 'none'; // Hide all cards first
                card.classList.remove('animate__animated', 'animate__zoomIn');
                
                if (filter === 'all' || card.dataset.category === filter) {
                    // Using a timeout to allow the display property to update before animating
                    setTimeout(() => {
                        card.style.display = 'block';
                        card.classList.add('animate__animated', 'animate__zoomIn');
                    }, 10);
                }
            });
        });
    });

    // --- Contact Form Validation ---
    const form = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        
        // Reset styles
        [name, email, message].forEach(input => {
            input.classList.remove('invalid');
            input.nextElementSibling.style.display = 'none';
        });
        formFeedback.textContent = '';
        formFeedback.className = 'mb-4 text-center';

        // Validate Name
        if (name.value.trim() === '') {
            isValid = false;
            name.classList.add('invalid');
            name.nextElementSibling.style.display = 'block';
        }

        // Validate Email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value.trim())) {
            isValid = false;
            email.classList.add('invalid');
            email.nextElementSibling.style.display = 'block';
        }

        // Validate Message
        if (message.value.trim() === '') {
            isValid = false;
            message.classList.add('invalid');
            message.nextElementSibling.style.display = 'block';
        }

        if (isValid) {
            formFeedback.textContent = 'Thank you! Your message has been sent successfully.';
            formFeedback.classList.add('text-green-500');
            form.reset();
        } else {
            formFeedback.textContent = 'Please fix the errors above.';
            formFeedback.classList.add('text-red-500');
        }
    });

    // --- Update Footer Year ---
    document.getElementById('current-year').textContent = new Date().getFullYear();
});