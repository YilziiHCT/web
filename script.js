document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        // Toggle icon between menu and close
        const icon = mobileMenuButton.querySelector('i');
        if (icon.classList.contains('bx-menu')) {
            icon.classList.replace('bx-menu', 'bx-x');
        } else {
            icon.classList.replace('bx-x', 'bx-menu');
        }
    });
    
    // Close mobile menu when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenuButton.querySelector('i').classList.replace('bx-x', 'bx-menu');
        });
    });

    // --- Typed.js Initialization for Typing Effect ---
    const typed = new Typed('.typed-text', {
        strings: ['Web Developer', 'UI/UX Enthusiast', 'Tech Innovator', 'Problem Solver'],
        typeSpeed: 75,
        backSpeed: 50,
        backDelay: 2000,
        loop: true
    });

    // --- ScrollReveal Initialization for Scroll Animations ---
    const sr = ScrollReveal({
        distance: '60px',
        duration: 2500,
        delay: 400,
        reset: false, // Animation repeats only once
    });

    // Animate elements based on their classes
    sr.reveal('.hero-text', { delay: 200, origin: 'top' });
    sr.reveal('.section-title', { delay: 100, origin: 'left' });
    sr.reveal('.profile-img', { delay: 200, origin: 'right', distance: '100px' });
    sr.reveal('.profile-text', { delay: 300, origin: 'left' });
    sr.reveal('.skill-card', { interval: 150, origin: 'bottom' });
    sr.reveal('#contact form', { delay: 200, origin: 'bottom' });
    
    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');
    
    const onScroll = () => {
        // Change header background on scroll
        if (window.scrollY > 50) {
            header.classList.add('shadow-lg', 'shadow-slate-950/10');
        } else {
            header.classList.remove('shadow-lg', 'shadow-slate-950/10');
        }
        
        // Highlight active nav link
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100; // a bit of offset
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
        
        // Special case for bottom of page to highlight contact link
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
             navLinks.forEach(link => link.classList.remove('active'));
             document.querySelector('a[href="#contact"].nav-link').classList.add('active');
        }
    };
    
    window.addEventListener('scroll', onScroll);
    // Run on page load to set initial state
    onScroll();

});