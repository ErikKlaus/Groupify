document.addEventListener('DOMContentLoaded', function () {
    const tombolAcak = document.querySelector('button[type="submit"]');
    const tombolSalin = document.getElementById('btnSalin');
    const teksSalin = document.getElementById('textSalin');
    const formKelompok = document.getElementById('formKelompok');
    const daftarNamaInput = document.getElementById('daftarNama');
    const jumlahKelompokSelect = document.getElementById('jumlahKelompok');
    const areaHasil = document.getElementById('areaHasil');
    const pakaiPotRadio = document.querySelectorAll('input[name="pakaiPot"]');

    let hasilAcakan = ''; 
    let acakanSelesai = false; 

    function updateDropdown() {
        const daftarInput = daftarNamaInput.value.split(',').map(n => n.trim()).filter(n => n !== '');
        const pakaiPot = document.querySelector('input[name="pakaiPot"]:checked').value === 'ya';

        if (!pakaiPot) {
            jumlahKelompokSelect.innerHTML = '';
            for (let i = 2; i <= daftarInput.length; i++) {
                if (daftarInput.length % i === 0 || Math.floor(daftarInput.length / i) >= 1) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = i;
                    jumlahKelompokSelect.appendChild(option);
                }
            }
            return;
        }

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

        let validKelompokOptions = [];

        for (let i = 2; i <= daftarInput.length; i++) {
            let isValid = true;
            for (let pot in potMap) {
                if (potMap[pot].length < i) {
                    isValid = false;
                    break;
                }
            }
            if (isValid) {
                validKelompokOptions.push(i);
            }
        }

        jumlahKelompokSelect.innerHTML = '';
        validKelompokOptions.forEach(optionValue => {
            const option = document.createElement('option');
            option.value = optionValue;
            option.textContent = optionValue;
            jumlahKelompokSelect.appendChild(option);
        });
    }

    function tampilkanPot() {
        const daftarInput = daftarNamaInput.value.split(',').map(n => n.trim()).filter(n => n !== '');
        const pakaiPot = document.querySelector('input[name="pakaiPot"]:checked').value === 'ya';
        const areaPot = document.getElementById('areaPot');
        areaPot.innerHTML = '';
        if (daftarInput.length === 0) return;
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

    daftarNamaInput.addEventListener('input', () => {
        tampilkanPot();
        updateDropdown();
    });

    pakaiPotRadio.forEach(radio => {
        radio.addEventListener('change', tampilkanPot);
    });

    formKelompok.addEventListener('submit', function (e) {
        e.preventDefault();
        tombolAcak.disabled = true;

        const daftarInput = daftarNamaInput.value.split(',').map(n => n.trim()).filter(n => n !== '');
        const jumlahKelompok = parseInt(jumlahKelompokSelect.value);
        const pakaiPot = document.querySelector('input[name="pakaiPot"]:checked').value === 'ya';
        areaHasil.innerHTML = '<div class="loading-placeholder">Lagi dibagiin kelompok... tungguin yaa</div>';
        areaHasil.style.minHeight = '200px';

        setTimeout(() => {
            areaHasil.innerHTML = '';
            let hasilSalinan = '';

            if (daftarInput.length === 0) {
                areaHasil.innerHTML = '<p class="error-message">Masukkan daftar nama terlebih dahulu, silakan refresh browser.</p>';
                return;
            }
            if (isNaN(jumlahKelompok) || jumlahKelompok < 1) {
                areaHasil.innerHTML = '<p class="error-message">Masukkan jumlah kelompok yang valid, silakan refresh browser.</p>';
                return;
            }

            let konfigurasiAkhir = Array.from({ length: jumlahKelompok }, () => []);
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
                    anggota.sort(() => Math.random() - 0.5);
                    anggota.forEach((nama, idx) => {
                        konfigurasiAkhir[idx % jumlahKelompok].push(nama);
                    });
                });
            } else {
                let semuaNama = daftarInput;
                semuaNama.sort(() => Math.random() - 0.5);
                semuaNama.forEach((nama, idx) => {
                    konfigurasiAkhir[idx % jumlahKelompok].push(nama);
                });
            }

            konfigurasiAkhir.forEach((kelompok, i) => {
                const kelompokHtml = `<div class="kelompok"><h3>Kelompok ${i + 1}:</h3><ul>${kelompok.map(nama => `<li>${nama}</li>`).join('')}</ul></div>`;
                areaHasil.innerHTML += kelompokHtml;
                hasilSalinan += `Kelompok ${i + 1}:\n` + kelompok.join('\n') + '\n\n';
            });

            tombolAcak.disabled = false;

            hasilAcakan = hasilSalinan;
            acakanSelesai = true; 

            navigator.clipboard.writeText(hasilAcakan).then(() => {
                teksSalin.textContent = '✅ Disalin!';
                setTimeout(() => {
                    teksSalin.textContent = 'Acak';
                }, 2000);
            });

        }, 1000);
    });

    tombolSalin.addEventListener('click', function () {
        if (acakanSelesai) {
            navigator.clipboard.writeText(hasilAcakan).then(() => {
                teksSalin.textContent = '✅ Disalin!';
                setTimeout(() => {
                    teksSalin.textContent = 'Acak';
                }, 2000);
            });
        } else {
            teksSalin.textContent = 'Acak';
            setTimeout(() => {
                teksSalin.textContent = 'Acak';
            }, 2000);
        }
    });

    tampilkanPot();
    updateDropdown();
});
