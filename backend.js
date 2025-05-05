document.addEventListener('DOMContentLoaded', function () {
    function tampilkanPot() {
        const daftarInput = document.getElementById('daftarNama').value
            .split(',')
            .map(n => n.trim())
            .filter(n => n !== '');

        const pakaiPot = document.querySelector('input[name="pakaiPot"]:checked').value === 'ya';
        const areaPot = document.getElementById('areaPot');
        areaPot.innerHTML = '';

        if (daftarInput.length === 0) {
            return;
        }

        if (pakaiPot) {
            const potMap = {};

            daftarInput.forEach(item => {
                const match = item.match(/^(.+?)#(\d+)$/);
                if (match) {
                    const nama = match[1].trim();
                    const pot = parseInt(match[2]);

                    if (!potMap[pot]) potMap[pot] = [];
                    potMap[pot].push(nama);
                }
            });

            Object.keys(potMap).forEach(pot => {
                const anggota = potMap[pot];
                const potHtml = `
                    <div class="pot">
                        <h4>Pot ${pot}:</h4>
                        <ul>${anggota.map(nama => `<li>${nama}</li>`).join('')}</ul>
                    </div>`;
                areaPot.innerHTML += potHtml;
            });

            areaPot.style.display = 'block';
        } else {
            areaPot.style.display = 'none';
        }
    }

    document.querySelectorAll('input[name="pakaiPot"]').forEach(radio => {
        radio.addEventListener('change', tampilkanPot);
    });

    document.getElementById('formKelompok').addEventListener('submit', function (e) {
        e.preventDefault();
        const daftarInput = document.getElementById('daftarNama').value
            .split(',')
            .map(n => n.trim())
            .filter(n => n !== '');

        const jumlahKelompok = parseInt(document.getElementById('jumlahKelompok').value);
        const pakaiPot = document.querySelector('input[name="pakaiPot"]:checked').value === 'ya';
        const areaHasil = document.getElementById('areaHasil');
        areaHasil.innerHTML = '';

        if (daftarInput.length === 0) {
            areaHasil.innerHTML = '<p class="error-message">Error: Masukkan daftar nama terlebih dahulu.</p>';
            return;
        }

        if (isNaN(jumlahKelompok) || jumlahKelompok < 1) {
            areaHasil.innerHTML = '<p class="error-message">Error: Masukkan jumlah kelompok yang valid.</p>';
            return;
        }

        if (pakaiPot) {
            const potMap = {};

            daftarInput.forEach(item => {
                const match = item.match(/^(.+?)#(\d+)$/);
                if (match) {
                    const nama = match[1].trim();
                    const pot = parseInt(match[2]);

                    if (!potMap[pot]) potMap[pot] = [];
                    potMap[pot].push(nama);
                }
            });

            let konfigurasiAkhir = Array.from({ length: jumlahKelompok }, () => []);

            Object.keys(potMap).forEach(pot => {
                const anggota = potMap[pot];
                anggota.sort(() => Math.random() - 0.5);
                anggota.forEach((nama, idx) => {
                    konfigurasiAkhir[idx % jumlahKelompok].push(nama);
                });
            });

            konfigurasiAkhir.forEach((kelompok, i) => {
                const kelompokHtml = `<div class="kelompok"><h3>Kelompok ${i + 1}:</h3><ul>${kelompok.map(nama => `<li>${nama}</li>`).join('')}</ul></div>`;
                areaHasil.innerHTML += kelompokHtml;
            });

        } else {
            let semuaNama = daftarInput;
            semuaNama.sort(() => Math.random() - 0.5);
            let hasil = Array.from({ length: jumlahKelompok }, () => []);

            semuaNama.forEach((nama, idx) => {
                hasil[idx % jumlahKelompok].push(nama);
            });

            hasil.forEach((kelompok, i) => {
                const kelompokHtml = `<div class="kelompok"><h3>Kelompok ${i + 1}:</h3><ul>${kelompok.map(nama => `<li>${nama}</li>`).join('')}</ul></div>`;
                areaHasil.innerHTML += kelompokHtml;
            });
        }
    });

    window.addEventListener('DOMContentLoaded', tampilkanPot);
});
