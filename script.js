const namaInput = document.getElementById('nama');
const cekNamaButton = document.getElementById('cekNama');
const hasilDiv = document.getElementById('hasil');

const karakter = [
    "Aella", "Baelar", "Cairn", "Dara", "Elowen", "Faelar", "Gideon", "Halia", "Ilyana", "Jareth", "Kaelen", "Liora", "Maeve", "Nesta", "Orion", "Rhysand", "Soren", "Taryn", "Uther", "Valen",
    "Anya", "Bran", "Cillian", "Deirdre", "Eamon", "Finnian", "Gareth", "Hazel", "Ivor", "Jasper", "Keir", "Lachlan", "Magnus", "Niall", "Owen", "Percival", "Quinn", "Rowan", "Seamus", "Tiernan",
    "Alistair", "Brennan", "Caelan", "Declan", "Ewan", "Fergus", "Griffin", "Hunter", "Ian", "Kieran", "Liam", "Malcolm", "Neil", "Owen", "Patrick", "Quentin", "Rhys", "Sawyer", "Tristan", "Ulysses",
    "Alana", "Bethany", "Ciara", "Deanna", "Eleanor", "Fiona", "Gemma", "Holly",  "Isla", "Josie", "Katie", "Lily", "Maisie", "Nora", "Olivia", "Piper", "Quinn", "Rosie", "Sophia", "Tara",
    "Arden", "Blake", "Caleb", "Damon", "Ethan", "Felix", "Gavin", "Hayden", "Isaac", "Jasper", "Kai", "Liam", "Mason", "Noah", "Oliver", "Owen", "Parker", "Quentin", "Ryan", "Samuel"
];

cekNamaButton.addEventListener('click', () => {
    const nama = namaInput.value.trim();
    if (nama === "") {
        hasilDiv.innerHTML = '<p class="text-red-500 animate-pulse">Masukkan nama terlebih dahulu!</p>';
        return;
    }

    const randomKarakter = karakter[Math.floor(Math.random() * karakter.length)];
    hasilDiv.innerHTML = `
        <p class="text-xl font-medium animate-bounce">Karakter untuk ${nama}: <span class="text-blue-600">${randomKarakter}</span></p>
    `;
});