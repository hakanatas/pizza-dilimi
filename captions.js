/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 7. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 10.2, tr: 'Bu dilimin alanı ne kadar?', en: 'How big is this slice?',
      note: 'Yarıçapı 10 santimetre olan bir pizza. Alanı 3,14 çarpı 10 çarpı 10, 314 santimetrekare. 90 derecelik bir dilimin alanı ne kadar?' },
    { scene: 2, start: 10.8, end: 20.8, tr: 'Açı yarıya inince…', en: 'When the angle halves…',
      note: '360 derecede yay bütün çember, 62,8 santimetre; dilim bütün daire, 314 santimetrekare. 180 derecede ikisi de yarıya, 90 derecede dörtte bire, 45 derecede sekizde bire iniyor.' },
    { scene: 2, start: 21.0, end: 27.8, tr: 'Açı, yay ve alan orantılı', en: 'Angle, arc and area are proportional',
      note: 'Yay ve dilimin alanı, merkez açıyla aynı oranda değişiyor.' },
    { scene: 3, start: 28.8, end: 40.2, tr: 'α/360: dairenin kesri', en: 'α/360: a fraction of the circle',
      note: '90 derece, 360 derecenin dörtte biri: yay çemberin, dilim dairenin dörtte biri. 120 derece üçte bir: yay da alan da üçte bir.' },
    { scene: 3, start: 40.4, end: 45.8, tr: '72° = 360°’nin beşte biri', en: '72° is one fifth of 360°',
      note: '72 derece beşte bir. Yay için bildiğimiz oran, alan için de geçerli.' },
    { scene: 4, start: 46.8, end: 56.8, tr: '314 · 72/360 = 62,8 cm²', en: '314 · 72/360 = 62.8 cm²',
      note: '72 derecelik dilimin alanı: 314 çarpı 72 bölü 360, yani 314’ün beşte biri, 62,8 santimetrekare.' },
    { scene: 4, start: 57.0, end: 63.8, tr: 'Dilim = πr² · α/360', en: 'Sector = πr² · α/360',
      note: 'Yay için 2 pi r çarpı alfa bölü 360 demiştik. Aynı düşünceyle dilimin alanı: pi r kare çarpı alfa bölü 360.' },
    { scene: 5, start: 64.8, end: 73.8, tr: 'r = 6 cm, 120°: 37,68 cm²', en: 'r = 6 cm, 120°: 37.68 cm²',
      note: 'Yarıçapı 6 santimetre olan pizza: alanı 113,04. 120 derece üçte bir; dilimin alanı 37,68 santimetrekare.' },
    { scene: 5, start: 74.0, end: 79.8, tr: 'Kontrol: 3 dilim = bütün', en: 'Check: 3 slices make the whole',
      note: 'Kontrol edelim: üç dilim bütün pizzayı yapar, 3 çarpı 37,68, 113,04.' },
    { scene: 6, start: 80.6, end: 86.4, tr: 'Açının kesri kadar', en: 'As big as the angle’s fraction',
      note: 'Aklında kalsın: açı 360 derecenin kaçta kaçıysa, yay çemberin, dilim dairenin o kadarıdır.' },
    { scene: 6, start: 86.8, end: 91.0, tr: 'Dilim = πr² · α/360', en: 'Sector = πr² · α/360',
      note: 'Daire diliminin alanı: pi r kare çarpı alfa bölü 360!' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
