// Nama file: script.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('Website Yilzi loaded');
    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(anchor.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    // Toggle menu
    const nav = document.querySelector('nav');
    nav.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
});