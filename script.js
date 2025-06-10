document.getElementById('diamondForm').addEventListener('submit', function(e) {
  e.preventDefault();
  // Tambahkan kode validasi formulir di sini
  // ... (Contoh: Validasi input username dan game) ...

  //Simulasi respon
  document.getElementById('formResponse').innerHTML = '<p class="text-green-500">Formulir terkirim. Silahkan tunggu.</p>';

});


// Smooth Scrolling (Contoh)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});