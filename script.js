document.addEventListener('DOMContentLoaded', () => {
    let cart = [];
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
    });
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.dataset.name;
            const price = parseInt(button.dataset.price);
            cart.push({ name, price });
            updateCart();
        });
    });
    function updateCart() {
        const cartItems = document.getElementById('cart-items');
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        cartItems.innerHTML = cart.length === 0 ? '<p class="text-center">Your cart is empty.</p>' : cart.map(item => `
            <div class="flex justify-between p-4 bg-white dark:bg-gray-700 rounded-lg">
                <span>${item.name}</span>
                <span>Rp ${item.price.toLocaleString('id-ID')}</span>
            </div>
        `).join('');
        cartCount.textContent = cart.length;
        cartTotal.textContent = 'Rp ' + cart.reduce((sum, item) => sum + item.price, 0).toLocaleString('id-ID');
    }
    document.getElementById('checkout').addEventListener('click', () => {
        alert('Checkout completed!');
        cart = [];
        updateCart();
    });
    
    document.getElementById('contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Message sent!');
    });
    
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
            }
        });
    }, { threshold: 0.2 });
    sections.forEach(section => observer.observe(section));
    
});