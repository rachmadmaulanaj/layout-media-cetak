const kertasPanjang = document.getElementById('kertas_panjang');
const kertasLebar = document.getElementById('kertas_lebar');
const filePanjang = document.getElementById('file_panjang');
const fileLebar = document.getElementById('file_lebar');
const tombolSubmit = document.getElementById('tombol_submit');

const kertasPanjangSpan = document.getElementById('kertas_panjang_span');
const kertasLebarSpan = document.getElementById('kertas_lebar_span');
const cardLayout = document.getElementById('card_layout');

const form = [kertasPanjang, kertasLebar, filePanjang, fileLebar];

// Fungsi menonaktifkan button submit jika input belum terisi semua
function toggleButtonClassDisabled(element) {
    element.forEach(e => {
        e.addEventListener('keyup', function() {
            if (element[0].value !== '' && element[1].value !== '' && element[2].value !== '' && element[3].value !== '') {
                tombolSubmit.removeAttribute('disabled');
            } else {
                tombolSubmit.setAttribute('disabled', 'disabled');
            }
        });
    });
}
toggleButtonClassDisabled(form);

// Fungsi menghitung jumlah item, ukuran layout dan ukuran sisa layout
function layout(kertas, file) {
    const item = Math.floor(kertas / file); // Jumlah item
    const layout = file * item; // Ukuran layout
    const sisa = kertas - layout; // Ukuran sisa layout
    const result = [item, layout, sisa];
    return result;
}

tombolSubmit.addEventListener('click', function() {
    // Mengambil nilai dari form input
    const kertasPanjangValue = kertasPanjang.value;
    const kertasLebarValue = kertasLebar.value;
    const filePanjangValue = filePanjang.value;
    const fileLebarValue = fileLebar.value;

    // Memanggil fungsi layout
    const layPanjang = layout(kertasPanjangValue, filePanjangValue)
    const layLebar = layout(kertasLebarValue, fileLebarValue)

    // Menampilkan detail informasi layout
    const tableTr = document.querySelectorAll('tr');
    const tableValue = [layPanjang[1]+' mm', layLebar[1]+' mm', layPanjang[2]+' mm', layLebar[2]+' mm', (layPanjang[0]*layLebar[0])+' biji'];
    kertasPanjangSpan.innerHTML = kertasPanjangValue+' mm';
    kertasLebarSpan.innerHTML = kertasLebarValue+' mm';
    tableTr.forEach((element, index) => {
        element.childNodes[5].innerHTML = tableValue[index];
    });

    // Menampilkan visual layout
    let hasilLayout = '';
    const sisaPanjang = Math.floor(layPanjang[2]/2*100/kertasPanjangValue*10)/10;
    const itemPanjang = Math.floor(filePanjangValue*100/kertasPanjangValue*10)/10;
    const sisaLebar = Math.floor(layLebar[2]/2*100/kertasLebarValue*10)/10;
    const itemLebar = Math.floor(fileLebarValue*100/kertasLebarValue*10)/10;
    
    let panjang = 0;
    let lebar = 0;
    let jarakAtas = 0;

    for (let i=0; i<(layPanjang[0]+2); i++) {
        let jarakKiri = 0;
        if (i==0) {
            jarakAtas = 0;
            panjang = sisaPanjang;
        } else if (i==1) {
            jarakAtas += sisaPanjang;
            panjang = itemPanjang;
        } else if (i==layPanjang[0]+1) {
            jarakAtas += itemPanjang;
            panjang = sisaPanjang;
        } else {
            jarakAtas +=itemPanjang;
            panjang = itemPanjang;
        }
        for (let j=0; j<(layLebar[0]+2); j++) {
            if (j==0 || j==layLebar[0]+1) {
                lebar = sisaLebar;
                hasilLayout += `<div style="width: ${lebar}%; height: ${panjang}%; position: absolute; top: ${Math.floor(jarakAtas*10)/10}%; left: ${jarakKiri}%;"></div>`;
                jarakKiri += sisaLebar;
                console.log(Math.floor(jarakAtas*10)/10);
            } else {
                lebar = itemLebar;
                let border = i==0 || i==layPanjang[0]+1 ? '' : 'border: 1px solid gray;';
                hasilLayout += `<div style="width: ${lebar}%; height: ${panjang}%; position: absolute; top: ${Math.floor(jarakAtas*10)/10}%; left: ${jarakKiri}%; ${border}"></div>`;
                jarakKiri += itemLebar;
                console.log(Math.floor(jarakAtas*10)/10);
            }
        }
    }
    
    cardLayout.innerHTML = hasilLayout;
});