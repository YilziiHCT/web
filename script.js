// Anda bisa menambahkan JavaScript untuk menambahkan fitur interaktif di sini.
// Contoh:  Animasi, efek hover, validasi form, dll.

// Contoh sederhana untuk menambahkan efek hover pada link navigasi:

const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
    link.addEventListener('mouseover', () => {
        link.style.backgroundColor = '#555';
    });
    link.addEventListener('mouseout', () => {
        link.style.backgroundColor = 'transparent';
    });
});