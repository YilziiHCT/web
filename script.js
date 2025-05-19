// Nama file: script.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('Website portfolio sederhana loaded');

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(anchor.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Mobile menu
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        menuToggle.textContent = mobileMenu.classList.contains('active') ? '✕' : '☰';
    });

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.getElementById('theme-body');
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark');
        themeToggle.innerHTML = body.classList.contains('dark') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
    });
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Project filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.getAttribute('data-filter');
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Contact form
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    const validateEmail = (email) => /^[^s@]+@[^s@]+.[^s@]+$/.test(email);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        if (!nameInput.value.trim()) {
            nameError.classList.remove('hidden');
            isValid = false;
        } else {
            nameError.classList.add('hidden');
        }

        if (!validateEmail(emailInput.value)) {
            emailError.classList.remove('hidden');
            isValid = false;
        } else {
            emailError.classList.add('hidden');
        }

        if (!messageInput.value.trim()) {
            messageError.classList.remove('hidden');
            isValid = false;
        } else {
            messageError.classList.add('hidden');
        }

        if (isValid) {
            alert('Message sent successfully!');
            form.reset();
        }
    });

    // Real-time validation
    nameInput.addEventListener('input', () => {
        if (nameInput.value.trim()) {
            nameError.classList.add('hidden');
        }
    });
    emailInput.addEventListener('input', () => {
        if (validateEmail(emailInput.value)) {
            emailError.classList.add('hidden');
        }
    });
    messageInput.addEventListener('input', () => {
        if (messageInput.value.trim()) {
            messageError.classList.add('hidden');
        }
    });

    // Project card animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    projectCards.forEach(card => observer.observe(card));
});