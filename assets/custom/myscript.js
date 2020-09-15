const kertasWidth = document.getElementById('kertas_width');
const kertasHeight = document.getElementById('kertas_height');
const fileSisi1 = document.getElementById('file_sisi_1');
const fileSisi2 = document.getElementById('file_sisi_2');
const tombolSubmit = document.getElementById('tombol_submit');

const kertasWidthSpan = document.getElementById('kertas_width_span');
const kertasHeightSpan = document.getElementById('kertas_height_span');
const cardLayoutBest = document.getElementById('card_layout_best');

const form = [kertasWidth, kertasHeight, fileSisi1, fileSisi2];

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

// Fungsi menghitung layout
function layout(k1, k2, s1, s2) {
    let jumlahItemW = [], jumlahItemH = [];
    let kertasSisa = 0;

    let i = 1;
    while(s1 * i <= k1) { let k = 1;
        while(s2 * k <= k2) { k++; }
        let j = 1;
        kertasSisa = k1 - s1 * i;
        jumlahItemW[i-1] = [i, 0], jumlahItemH[i-1] = [k-1, 0];
        while(s2 * j <= kertasSisa) { let l = 1;
            while(s1 * l <= k2) { l++; }
            jumlahItemH[i-1] = [k-1, l-1];
            j++;
        }
        jumlahItemW[i-1] = [i, j-1];
        i++;
    }

    let result = [], layoutObj = {};
    for (let i=0; i<jumlahItemH.length; i++) {
        const ukLayW = (jumlahItemW[i][0]*s1) + (jumlahItemW[i][1]*s2);
        const ukLayH = jumlahItemH[i][0]*s2 > jumlahItemH[i][1]*s1 ? jumlahItemH[i][0]*s2 : jumlahItemH[i][1]*s1;
        layoutObj = {
            itemW : jumlahItemW[i],
            itemH : jumlahItemH[i],
            ukLay : [ukLayW, ukLayH],
            sisa : [k1 - ukLayW, k2 - ukLayH],
            itemJumlah : (jumlahItemW[i][0]*jumlahItemH[i][0]) + (jumlahItemW[i][1]*jumlahItemH[i][1]),
            kertas : [k1, k2],
            sisi : [s1, s2]
        };
        result[i] = layoutObj;
    }
    return result;
}

// Fungsi menggambar layout
function layoutGambar(lay) {
    const sisaWidth = Math.floor(lay.sisa[0]/2*100/lay.kertas[0]*10)/10;
    const sisaHeight = Math.floor(lay.sisa[1]/2*100/lay.kertas[1]*10)/10;
    const itemWidth_s1 = Math.floor(lay.sisi[0]*100/lay.kertas[0]*10)/10;
    const itemHeight_s1 = Math.floor(lay.sisi[1]*100/lay.kertas[1]*10)/10;
    const itemWidth_s2 = Math.floor(lay.sisi[0]*100/lay.kertas[1]*10)/10;
    const itemHeight_s2 = Math.floor(lay.sisi[1]*100/lay.kertas[0]*10)/10;

    let gambar = '';
    if (lay.kertas[0] > lay.kertas[1]) {
        let garisHeight = 0, garisWidth = 0, garisLeft = sisaWidth;
        for (let i=0; i<lay.itemW[0]+lay.itemW[1]; i++) {
            garisTop = sisaHeight;
            if (i < lay.itemW[0]) {
                garisWidth = itemWidth_s1, garisHeight = itemHeight_s1;
                for (let j=0; j<lay.itemH[0]; j++) {
                    gambar += `<div style="position: absolute; border: 1px solid #000; width:${garisWidth}%; height:${garisHeight}%; top: ${garisTop}%; left: ${garisLeft}%;"></div>`;
                    garisTop += itemHeight_s1;
                }
            } else {
                garisWidth = itemHeight_s2, garisHeight = itemWidth_s2;
                for (let j=0; j<lay.itemH[1]; j++) {
                    gambar += `<div style="position: absolute; border: 1px solid #000; width:${garisWidth}%; height:${garisHeight}%; top: ${garisTop}%; left: ${garisLeft}%;"></div>`;
                    garisTop += itemWidth_s2;
                }
            }
            garisLeft += garisWidth;
        }
    } else {
        let garisHeight = 0, garisWidth = 0, garisTop = sisaWidth;
        for (let i=0; i<lay.itemW[0]+lay.itemW[1]; i++) {
            garisLeft = sisaHeight;
            if (i < lay.itemW[0]) {
                garisWidth = itemHeight_s1, garisHeight = itemWidth_s1;
                for (let j=0; j<lay.itemH[0]; j++) {
                    gambar += `<div style="position: absolute; border: 1px solid #000; width:${garisWidth}%; height:${garisHeight}%; top: ${garisTop}%; left: ${garisLeft}%;"></div>`;
                    garisLeft += itemHeight_s1;
                }
            } else {
                garisWidth = itemWidth_s2, garisHeight = itemHeight_s2;
                for (let j=0; j<lay.itemH[1]; j++) {
                    gambar += `<div style="position: absolute; border: 1px solid #000; width:${garisWidth}%; height:${garisHeight}%; top: ${garisTop}%; left: ${garisLeft}%;"></div>`;
                    garisLeft += itemWidth_s2;
                }
            }
            garisTop += garisHeight;
        }
    }
    return gambar;
}

tombolSubmit.addEventListener('click', function() {
    // Mengambil nilai dari form input
    const kertasWidthValue = kertasWidth.value;
    const kertasHeightValue = kertasHeight.value;
    const fileSisi1Value = fileSisi1.value;
    const fileSisi2Value = fileSisi2.value;

    const layoutFix = [...layout(kertasWidthValue, kertasHeightValue, fileSisi1Value, fileSisi2Value), ...layout(kertasHeightValue, kertasWidthValue, fileSisi1Value, fileSisi2Value)];
    layoutFix.sort((a, b) => {
        return b.itemJumlah - a.itemJumlah;
    });
    console.log(layoutFix);
    cardLayoutBest.innerHTML = layoutGambar(layoutFix[0]);
    // Menampilkan detail informasi layout
    const tableTr = document.querySelectorAll('tr');
    const tableValue = [layoutFix[0].ukLay[1]+' mm', layoutFix[0].ukLay[0]+' mm', layoutFix[0].sisa[0]+' mm', layoutFix[0].sisa[1]+' mm', layoutFix[0].itemJumlah+' biji'];
    kertasWidthSpan.innerHTML = layoutFix[0].kertas[0]+' mm';
    kertasHeightSpan.innerHTML = layoutFix[0].kertas[1]+' mm';
    tableTr.forEach((element, index) => {
        element.childNodes[5].innerHTML = tableValue[index];
    });

    const tombolLayoutOther = document.getElementById('tombol_layout_other');
    tombolLayoutOther.classList.remove('d-none');
    tombolLayoutOther.addEventListener('click', function() {
        const cardLayoutOther = document.getElementById('card_layout_other');
        let layoutLainnya = '';
        layoutFix.forEach(val => {
            layoutLainnya += `
                <div class="card shadow my-2">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-6">
                                <div class="offset-2">
                                    <p class="m-0">Height</p>
                                    <div class="arrow left"></div>
                                    <p class="line-text-hr"><span>${val.kertas[0]} mm</span></p>
                                    <div class="arrow right"></div>
                                </div>
                                <div class="row">
                                    <div class="col-1">
                                        <p style="width:1px; word-wrap: break-word;">Width</p>
                                    </div>
                                    <div class="col-1">
                                        <div class="arrow up"></div>
                                        <div class="line-text-vr"><span>${val.kertas[1]} mm</span></div>
                                        <div class="arrow down"></div>
                                    </div>
                                    <div class="col-10">
                                        <div class="card my-3">
                                            <div class="card-body bg-light p-0" style="height: 200px;">
                                                <div class="w-100 h-100 p-0">
                                                    ${layoutGambar(val)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <table class="table text-left mt-4">
                                    <tr>
                                        <td class="p-2">Ukuran Layout Width</td>
                                        <td class="p-2">:</td>
                                        <td class="p-2">${val.ukLay[0]} mm</td>
                                    </tr>
                                    <tr>
                                        <td class="p-2">Ukuran Layout Height</td>
                                        <td class="p-2">:</td>
                                        <td class="p-2">${val.ukLay[1]} mm</td>
                                    </tr>
                                    <tr>
                                        <td class="p-2">Ukuran Sisa Width</td>
                                        <td class="p-2">:</td>
                                        <td class="p-2">${val.sisa[0]} mm</td>
                                    </tr>
                                    <tr>
                                        <td class="p-2">Ukuran Sisa Height</td>
                                        <td class="p-2">:</td>
                                        <td class="p-2">${val.sisa[1]} mm</td>
                                    </tr>
                                    <tr>
                                        <td class="p-2">1 Layout Isi</td>
                                        <td class="p-2">:</td>
                                        <td class="p-2">${val.itemJumlah} Biji</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        cardLayoutOther.innerHTML = layoutLainnya;
    });
});