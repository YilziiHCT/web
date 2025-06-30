// JavaScript interaktif dengan WebGL (Three.js), GSAP, AOS, dan validasi canggih

document.addEventListener('DOMContentLoaded', () => {

    // Helper functions
    const select = (el, all = false) => all ? document.querySelectorAll(el) : document.querySelector(el);

    // --- GSAP and AOS Initialization ---
    gsap.registerPlugin(ScrollTrigger);
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out-cubic',
        once: true,
        offset: 50,
    });

    // --- Three.js WebGL Particle Background ---
    let scene, camera, renderer, particles;
    
    function initWebGL() {
        try {
            const container = select('#webgl-bg');
            if (!container) return;

            // Scene and Camera
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 25; // Adjusted z for better particle view

            // Renderer
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(renderer.domElement);

            // Particles Geometry and Material
            const particleCount = 7000;
            const positions = new Float32Array(particleCount * 3);
            for (let i = 0; i < particleCount * 3; i++) {
                positions[i] = (Math.random() - 0.5) * 50;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const material = new THREE.PointsMaterial({
                size: 0.03,
                color: '#00f2fe', // Neon Cyan
                blending: THREE.AdditiveBlending,
                transparent: true,
                opacity: 0.8,
            });
            particles = new THREE.Points(geometry, material);
            scene.add(particles);

            // Handle mouse move for parallax effect
            document.addEventListener('mousemove', onMouseMove);
            animate();
        } catch(e) {
            console.error("WebGL initialization failed:", e);
             // Optionally hide canvas on error
            const webglContainer = select('#webgl-bg');
            if (webglContainer) webglContainer.style.display = 'none';
        }
    }
    
    // Animate loop
    let mouseX = 0, mouseY = 0;
    
    function onMouseMove(event) {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Animate particles
        if (particles) {
            particles.rotation.y = elapsedTime * 0.05;
            particles.rotation.x = elapsedTime * 0.02;

             // Mouse parallax effect
            camera.position.x += (mouseX * 0.1 - camera.position.x) * 0.05;
            camera.position.y += (mouseY * 0.1 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);
        }
       
        if(renderer) renderer.render(scene, camera);
    }
    
    // Window resize handler
    window.addEventListener('resize', () => {
        if(camera && renderer){
           camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
        }
    });

    initWebGL(); // Run the initialization


    // --- Dark/Light Mode Toggle ---
    const themeToggle = select('#theme-toggle');
    const themeIcon = select('#theme-icon');
    const htmlEl = select('html');
    
    // On load, check localStorage
    if (localStorage.getItem('theme') === 'light') {
        htmlEl.classList.remove('dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        htmlEl.classList.toggle('dark');
        const isDark = htmlEl.classList.contains('dark');
        
        // GSAP animation for icon
        gsap.to(themeIcon, { rotation: isDark ? 360 : 0, scale: 0.8, duration: 0.5, ease: 'back.out(1.7)', onComplete: () => {
            gsap.to(themeIcon, {scale: 1, duration: 0.2});
        } });
        
        if (isDark) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'light');
        }
    });

    // --- Header Scroll Effect ---
    gsap.to('#header', {
        backgroundColor: "rgba(17, 24, 39, 0.6)", // #111827 with opacity
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
        scrollTrigger: {
            trigger: "body",
            start: "top -100px",
            toggleActions: "play none none reverse",
        }
    });
    
     // --- Mobile Menu ---
    const menuToggle = select('#menu-toggle');
    const mobileMenu = select('#mobile-menu');
    const hamburgerLines = select('#hamburger span', true);
    
    const menuTl = gsap.timeline({ paused: true });

    menuTl.to(mobileMenu, { right: 0, duration: 0.5, ease: 'power3.inOut' });
    menuTl.from(select('.mobile-nav-link', true), {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: 'power3.out'
    }, "-=0.3");

    let menuOpen = false;
    menuToggle.addEventListener('click', () => {
        menuOpen = !menuOpen;
        gsap.to(hamburgerLines[0], { rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0, duration: 0.4, ease: 'power2.inOut' });
        gsap.to(hamburgerLines[1], { opacity: menuOpen ? 0 : 1, duration: 0.4, ease: 'power2.inOut' });
        gsap.to(hamburgerLines[2], { rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0, duration: 0.4, ease: 'power2.inOut' });

        if (menuOpen) {
            menuTl.play();
        } else {
            menuTl.reverse();
        }
    });

    select('.mobile-nav-link', true).forEach(link => {
        link.addEventListener('click', () => {
            if (menuOpen) menuToggle.click();
        });
    });

    // --- Hero Section Typewriter Effect ---
    const typewriterEl = select('#typewriter');
    const words = ["We build interactive digital universes.", "Fusing elegant design with powerful code.", "Your vision, futuristically realized."];
    let wordIndex = 0;
    let charIndex = 0;

    function typeWriter() {
        if(charIndex < words[wordIndex].length) {
            typewriterEl.textContent += words[wordIndex].charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 50); // Typing speed
        } else {
            setTimeout(erase, 2000); // Wait before erasing
        }
    }
    
    function erase() {
        if(charIndex > 0) {
            typewriterEl.textContent = words[wordIndex].substring(0, charIndex-1);
            charIndex--;
            setTimeout(erase, 25); // Erasing speed
        } else {
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(typeWriter, 500); // Wait before typing new word
        }
    }

    typeWriter();

    // --- 3D Interactive Card Tilt Effect ---
    select('.card-3d-wrapper', true).forEach(card => {
        const innerCard = card.querySelector('.card-3d-inner');
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -12; // Invert for natural feel
            const rotateY = ((x - centerX) / centerX) * 12;

            gsap.to(innerCard, {
                duration: 0.5,
                rotationX: rotateX,
                rotationY: rotateY,
                scale: 1.05,
                ease: 'power1.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(innerCard, {
                duration: 1,
                rotationX: 0,
                rotationY: 0,
                scale: 1,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });

    // --- Contact Form Real-Time Validation & Submission ---
    const form = select('#contact-form');
    const inputs = select('input, textarea', true);

    const showError = (input, message) => {
        const group = input.parentElement;
        const errorEl = group.querySelector('.error-message');
        errorEl.textContent = message;
        input.classList.add('error');
        gsap.fromTo(group, { x: 0 }, { x: -10, duration: 0.1, yoyo: true, repeat: 3, ease: 'power2.inOut', clearProps:'x'});
    }

     const showSuccess = (input) => {
        const group = input.parentElement;
        const errorEl = group.querySelector('.error-message');
        errorEl.textContent = '';
         input.classList.remove('error');
    }
    
    const validateField = (input) => {
        let isValid = true;
        let message = '';

        if(input.validity.valueMissing) {
            message = "This field is required.";
            isValid = false;
        } else if (input.type === "email" && input.validity.typeMismatch) {
             message = "Please enter a valid email address.";
             isValid = false;
        }

        if(!isValid){
             showError(input, message)
        } else {
             showSuccess(input);
        }
        return isValid;
    };


    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        
        let isFormValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });
        
        if(isFormValid) {
            // Here you would typically send data to a server
            console.log("Form Submitted! Data:", {
                name: select('#name').value,
                email: select('#email').value,
                message: select('#message').value
            });
            showSuccessModal();
            this.reset();
        }
    });

    // -- Success Modal --
    function showSuccessModal() {
        const modal = select('#success-modal');
        const content = select('#success-modal-content');
        const tl = gsap.timeline();

        tl.to(modal, {autoAlpha: 1, duration: 0.3})
          .fromTo(content, {scale: 0.7, y:50}, {scale: 1, y:0, duration: 0.5, ease: 'back.out(1.7)'});

        setTimeout(() => {
           gsap.to(modal, {autoAlpha: 0, duration: 0.3});
        }, 3000);
    }

    
    // --- Scroll-to-Top Button ---
    const scrollTopBtn = select('#scroll-to-top');

    gsap.to(scrollTopBtn, {
         bottom: window.innerWidth > 768 ? '2rem' : '1rem', // responsive position
         autoAlpha: 1,
         duration: 0.5,
         scrollTrigger: {
            trigger: "body",
            start: "top -300px",
            toggleActions: "play none none reverse",
         }
    });
   
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // --- Copyright Year ---
    select('#copyright-year').textContent = new Date().getFullYear();

}); // End DOMContentLoaded