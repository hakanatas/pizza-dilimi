/* SAHNE 1 — BİR DİLİM (0–10 s)  90° lik bir pizza dilimi.
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg, lerp, inOut } = LI.E;
  const KD = LI.KD, F = () => LI.Film, A = LI.Ang, Ink = LI.Ink;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  function exprs(ctx, t, P, list, sz) {
    const f = F();
    list.forEach(([a, b, items, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.expr(ctx, typeof items === 'string' ? [items] : items, P.x, P.y, sz ?? P.s, { alpha: al, w: P.w, halo: true, color: hot ? A.amber : undefined });
    });
  }
  const at = (P, k, y) => ({ x: P.x, y: y ?? P.y[k], s: P.s, w: P.w });
  const amber = (a) => `rgba(${LI.AMBER_RGB},${a})`;
  const fr = (n, d, h) => F().fr(n, d, h);
  const neg = (s) => s.replace('-', '−');
  const label = (v) => (v < 0 ? neg(String(v)) : String(v));

  /* ---- boxes and equal objects: cabinet projection, x right, y back, z up ---- */
  const Pj = (O, c, x, y, z) => [O[0] + x * c + y * c * 0.5, O[1] - z * c - y * c * 0.5];
  function poly(ctx, P, a, fill, seed, w = 3) {
    ctx.beginPath(); P.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath();
    ctx.fillStyle = `rgba(${LI.PAPER_RGB},${a})`; ctx.fill();
    fill.forEach((f) => { if (f) { ctx.fillStyle = f; ctx.fill(); } });
    Ink.path(ctx, P.concat([P[0]]), { w, alpha: a * 0.9, seed, taper: [0, 0] });
  }
  /** a solid block x..x+dx, y..y+dy, z..z+dz */
  function block(ctx, O, c, x, y, z, dx, dy, dz, a, h, seed) {
    if (a <= 0) return;
    const P = (i, j, k) => Pj(O, c, x + i * dx, y + j * dy, z + k * dz), H = h > 0 ? amber(a * 0.6 * h) : null;
    poly(ctx, [P(0, 0, 1), P(1, 0, 1), P(1, 1, 1), P(0, 1, 1)], a, [amber(a * 0.2), H], seed, 2.5);
    poly(ctx, [P(1, 0, 0), P(1, 1, 0), P(1, 1, 1), P(1, 0, 1)], a, [`rgba(${LI.INK_RGB},${a * 0.14})`, H], seed + 1, 2.5);
    poly(ctx, [P(0, 0, 0), P(1, 0, 0), P(1, 0, 1), P(0, 0, 1)], a, [`rgba(${LI.INK_RGB},${a * 0.04})`, H], seed + 2, 2.5);
  }
  function ball(ctx, O, c, x, y, z, a, seed) {
    if (a <= 0) return; const C = Pj(O, c, x + 0.5, y + 0.5, z + 0.5), r = c * 0.47;
    ctx.beginPath(); ctx.arc(C[0], C[1], r, 0, 7);
    ctx.fillStyle = `rgba(${LI.PAPER_RGB},${a})`; ctx.fill();
    const g = ctx.createRadialGradient(C[0] - r * 0.35, C[1] - r * 0.35, r * 0.1, C[0], C[1], r);
    g.addColorStop(0, amber(a * 0.12)); g.addColorStop(1, amber(a * 0.45)); ctx.fillStyle = g; ctx.fill();
    const P = []; for (let i = 0; i <= 28; i++) P.push([C[0] + r * Math.cos(i / 28 * 6.2832), C[1] + r * Math.sin(i / 28 * 6.2832)]);
    Ink.path(ctx, P, { w: 2.5, alpha: a * 0.9, seed, taper: [0, 0] });
  }
  /** items [{x,y,z,dx,dy,dz}] in painter's order, each with a fill index i */
  function fillList(L, W, H, dx = 1) {
    const out = [];
    for (let z = 0; z < H; z++) for (let y = W - 1; y >= 0; y--) for (let x = 0; x < L; x += dx) out.push({ x, y, z, dx, dy: 1, dz: 1 });
    out.forEach((q, i) => (q.i = i));
    return out.slice().sort((p, q) => q.y - p.y || p.x - q.x || p.z - q.z);
  }
  const shown = (t, t0, dt, n) => Math.max(0, Math.min(n, Math.floor((t - t0) / dt + 0.4)));
  /** an open glass box: back walls first, then the contents, then the front edges */
  function container(ctx, O, c, L, W, H, a, seed, draw) {
    if (a <= 0) return;
    const P = (x, y, z) => Pj(O, c, x, y, z), ink = `rgba(${LI.INK_RGB},${a * 0.05})`;
    poly(ctx, [P(0, W, 0), P(L, W, 0), P(L, W, H), P(0, W, H)], a * 0.8, [ink], seed, 2);
    poly(ctx, [P(0, 0, 0), P(0, W, 0), P(0, W, H), P(0, 0, H)], a * 0.8, [ink], seed + 1, 2);
    poly(ctx, [P(0, 0, 0), P(L, 0, 0), P(L, W, 0), P(0, W, 0)], a * 0.8, [ink], seed + 2, 2);
    if (draw) draw();
    [[[0, 0, 0], [L, 0, 0]], [[L, 0, 0], [L, 0, H]], [[L, 0, H], [0, 0, H]], [[0, 0, H], [0, 0, 0]], [[L, 0, 0], [L, W, 0]], [[L, W, 0], [L, W, H]], [[L, W, H], [L, 0, H]], [[0, W, H], [L, W, H]], [[0, 0, H], [0, W, H]]]
      .forEach(([p, q], i) => Ink.path(ctx, [P(...p), P(...q)], { w: 3, alpha: a * 0.85, seed: seed + 10 + i, taper: [0, 0] }));
  }
  function fillBox(ctx, O, c, L, W, H, t, t0, dt, a, seed, kind = 'cube', hot = 0) {
    const dx = kind === 'brick' ? 2 : 1, items = fillList(L, W, H, dx);
    container(ctx, O, c, L, W, H, a, seed, () => items.forEach((q) => {
      const k = seg(t, t0 + q.i * dt, t0 + q.i * dt + 0.35); if (k <= 0) return;
      const dz = (1 - inOut(k)) * (H + 1 - q.z);
      if (kind === 'ball') ball(ctx, O, c, q.x, q.y, q.z + dz, a * k, seed + 100 + q.i * 3);
      else block(ctx, O, c, q.x, q.y, q.z + dz, q.dx, 1, 1, a * k, hot, seed + 100 + q.i * 3);
    }));
    return items.length;
  }
  function tag(ctx, env, O, c, L, text, a, hot) {
    if (a <= 0) return; const s = KD.L(env).G.s;
    F().T(ctx, text, O[0] + L * c / 2, O[1] + s * 0.95, { size: s * 0.66, alpha: a, halo: true, color: hot ? A.amber : undefined });
  }
  /** cubes of an L × W × H prism; when(q) gives each cube's arrival time (Infinity = never) */
  function cubes(L, W, H) {
    const out = [];
    for (let z = 0; z < H; z++) for (let y = W - 1; y >= 0; y--) for (let x = 0; x < L; x++) out.push({ x, y, z });
    return out.sort((p, q) => q.y - p.y || p.x - q.x || p.z - q.z);
  }
  function fillT(ctx, O, c, B, t, a, when, hot, seed) {
    let n = 0;
    container(ctx, O, c, B[0], B[1], B[2], a, seed, () => cubes(...B).forEach((q, i) => {
      const t0 = when(q); if (!(t >= t0)) return; n++;
      const k = seg(t, t0, t0 + 0.3);
      block(ctx, O, c, q.x, q.y, q.z + (1 - inOut(k)) * 1.2, 1, 1, 1, a * k, hot ? hot(q) : 0, seed + 100 + i * 3);
    }));
    return n;
  }
  function edges(ctx, env, O, c, B, a, labels) {
    if (a <= 0) return; const s = KD.L(env).G.s, o = { size: s * 0.7, alpha: a, halo: true, color: A.amber };
    const m = (p, q) => { const P = Pj(O, c, ...p), Q = Pj(O, c, ...q); return [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2]; };
    const [L, W, H] = B;
    let q = m([0, 0, 0], [L, 0, 0]); F().T(ctx, labels[0], q[0], q[1] + 36, o);
    q = m([L, 0, 0], [L, W, 0]); F().T(ctx, labels[1], q[0] + 50, q[1] + 12, o);
    q = m([L, W, 0], [L, W, H]); F().T(ctx, labels[2], q[0] + 48, q[1], o);
  }
  function tally(ctx, env, t, rows) {
    const T = KD.L(env).TL;
    rows.forEach(([t0, t1, txt, hot], i) => { const al = win(t, t0, t1) * END(t); if (al > 0) F().T(ctx, txt, T.x, T.y[i], { size: T.s, alpha: al, halo: true, color: hot ? A.amber : undefined }); });
  }

  const TAU = Math.PI * 2;
  function fillPoly(ctx, P, a, fills, seed, w = 2.5) {
    ctx.beginPath(); P.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath();
    ctx.fillStyle = `rgba(${LI.PAPER_RGB},${a})`; ctx.fill();
    fills.forEach((f) => { if (f) { ctx.fillStyle = f; ctx.fill(); } });
    if (w > 0) Ink.path(ctx, P.concat([P[0]]), { w, alpha: a * 0.85, seed, taper: [0, 0] });
  }
  const pt = (C, R, deg) => [C[0] + R * Math.cos((deg - 90) * Math.PI / 180), C[1] + R * Math.sin((deg - 90) * Math.PI / 180)];
  /** the pizza: a disc, a highlighted sector of alpha degrees from 12 o'clock clockwise, its arc and its angle */
  function pizza(ctx, env, C, R, al, a, o = {}) {
    if (a <= 0) return; const s = KD.L(env).G.s;
    const disc = []; for (let j = 0; j < 72; j++) disc.push(pt(C, R, j * 5));
    fillPoly(ctx, disc, a, [amber(a * 0.14)], 80000, 3.5);
    if (o.parts) { for (let d = 0; d < 360; d += o.parts) { const q = pt(C, R, d); dashL(ctx, C, q, a * 0.6, 80100 + d); } }
    if (al <= 0.5) return;
    const off = o.pull ? o.pull : 0, mid = al / 2, P0 = pt([0, 0], off, mid), C2 = [C[0] + P0[0], C[1] + P0[1]];
    const S = [C2]; const n = Math.max(2, Math.ceil(al / 4)); for (let j = 0; j <= n; j++) S.push(pt(C2, R, al * j / n));
    fillPoly(ctx, S, a, [amber(a * 0.5)], 80200, 3);
    Ink.path(ctx, S.slice(1), { w: 7, alpha: a * 0.9, seed: 80300, taper: [0, 0], color: LI.AMBER_RGB });
    const L = pt(C2, R * (al > 200 ? 0.2 : 0.42), al > 200 ? 180 : mid);
    F().T(ctx, `${Math.round(al)}°`, L[0], L[1], { size: s * 0.66, alpha: a, halo: true });
  }
  function dashL(ctx, p, q, a, seed) {
    const n = 12; for (let j = 0; j < n; j += 2) Ink.path(ctx, [[lerp(p[0], q[0], j / n), lerp(p[1], q[1], j / n)], [lerp(p[0], q[0], (j + 1) / n), lerp(p[1], q[1], (j + 1) / n)]], { w: 2, alpha: a, seed: seed + j, taper: [0, 0] });
  }
  function radius(ctx, env, C, R, a, txt) {
    if (a <= 0) return; const s = KD.L(env).G.s, q = pt(C, R, 225), m = pt(C, R * 0.55, 225);
    Ink.path(ctx, [C, q], { w: 3, alpha: a, seed: 80400, taper: [0, 0] });
    F().T(ctx, txt, m[0] - s * 1.1, m[1] - s * 0.1, { size: s * 0.6, alpha: a, halo: true });
  }

  function context(ctx, env, t) {
    exprs(ctx, t, KD.L(env).CX, [
      [4.4, 10.2, 'Bir pizza dilimi'],
      [10.6, 27.8, 'Açı değişince yay ve dilim nasıl değişir?'],
      [28.4, 45.8, 'Açı, yay ve alan: aynı oran'],
      [46.4, 63.8, 'Daire diliminin alanı'],
      [64.4, 79.8, 'Başka bir pizzada deneyelim'],
    ]);
  }

  function figure(ctx, env, t) {
    const L = KD.L(env), a = END(t), C = [L.C.x, L.C.y], R = L.C.R;
    // the angle over time
    const keys = [[4.6, 90], [11.0, 90], [11.6, 360], [13.6, 360], [14.2, 180], [16.0, 180], [16.6, 90], [18.4, 90], [19.0, 45], [28.0, 45], [29.0, 90], [34.8, 90], [35.4, 120], [40.4, 120], [41.0, 72], [63.8, 72]];
    let al = 90;
    for (let i = 0; i < keys.length - 1; i++) { const [t0, v0] = keys[i], [t1, v1] = keys[i + 1]; if (t >= t0 && t <= t1) al = lerp(v0, v1, inOut(seg(t, t0, t1))); }
    const aA = win(t, 4.6, 63.8) * a;
    if (aA > 0) {
      const parts = t > 29.4 && t < 34.8 ? 90 : t > 35.4 && t < 40.4 ? 120 : t > 41.0 && t < 45.8 ? 72 : 0;
      pizza(ctx, env, C, R, al, aA * seg(t, 4.8, 5.4), { pull: 18 * (win(t, 6.4, 10.2) + win(t, 47.0, 63.8)), parts });
      radius(ctx, env, C, R, aA * seg(t, 5.6, 6.0), 'r = 10 cm');
    }
    tally(ctx, env, t, [[12.0, 27.8, '360°: yay 62,8 cm · alan 314 cm²'], [14.4, 27.8, '180°: yay 31,4 cm · alan 157 cm²'], [16.8, 27.8, '90°: yay 15,7 cm · alan 78,5 cm²'], [19.2, 27.8, '45°: yay 7,85 cm · alan 39,25 cm²', true]]);
    const st = (t0, t1, f, n) => [[t0, t1, `açı: ${f}`], [t0 + 0.8, t1, `yay: 62,8 · ${n}`], [t0 + 1.6, t1, `alan: 314 · ${n}`, true]];
    tally(ctx, env, t, st(29.8, 34.6, '90/360 = 1/4', '1/4'));
    tally(ctx, env, t, st(35.6, 40.2, '120/360 = 1/3', '1/3'));
    tally(ctx, env, t, st(41.2, 45.8, '72/360 = 1/5', '1/5'));
    tally(ctx, env, t, [[48.0, 63.8, '72° lik dilim: 314 · 72/360'], [49.6, 63.8, '= 314 · 1/5'], [51.2, 63.8, '= 62,8 cm²', true]]);
    // S5: a smaller pizza
    const a5 = win(t, 64.8, 79.8) * a;
    if (a5 > 0) {
      const R2 = R * 0.72;
      pizza(ctx, env, C, R2, 120 * inOut(seg(t, 66.0, 67.2)), a5 * seg(t, 65.0, 65.6), { pull: 14 * seg(t, 67.2, 67.6) });
      radius(ctx, env, C, R2, a5 * seg(t, 65.4, 65.8), 'r = 6 cm');
      tally(ctx, env, t, [[67.8, 79.8, 'Daire: 3,14 · 6 · 6 = 113,04 cm²'], [69.6, 79.8, 'Açı: 120/360 = 1/3'], [71.4, 79.8, 'Dilim: 113,04 · 1/3 = 37,68 cm²', true]]);
    }
  }

  function words(ctx, env, t) {
    const W = KD.L(env).W;
    exprs(ctx, t, at(W, 0), [[5.6, 10.2, 'Yarıçapı 10 cm olan bir pizzadan 90° lik bir dilim'],
      [11.4, 27.8, 'Açı yarıya inince yay da dilim de yarıya iniyor'],
      [29.4, 45.8, 'Açı 360°’nin kaçta kaçıysa yay da alan da o kadar'],
      [47.4, 63.8, 'Dilimin alanı = dairenin alanı · α/360'],
      [65.4, 79.8, 'Başka pizza: r = 6 cm, 120° lik dilim']]);
    exprs(ctx, t, at(W, 1), [[7.4, 10.2, 'Pizzanın alanı 3,14 · 10 · 10 = 314 cm²'], [21.0, 27.8, 'Yay ve dilim, açıyla aynı oranda değişir'],
      [37.0, 45.8, 'Yay için bildiğimiz oran, alan için de geçerli'],
      [53.0, 63.8, 'Yay = 2πr · α/360   ↔   Dilim = πr² · α/360'],
      [74.0, 79.8, 'Kontrol: üç dilim birleşince bütün pizza, 3 · 37,68 = 113,04']]);
    exprs(ctx, t, at(W, 2), [[8.8, 10.2, 'Bu dilimin alanı ne kadar?', true], [23.4, 27.8, 'Açı, yay ve dilim alanı orantılı', true],
      [42.0, 45.8, 'α/360: dairenin hangi kesri?', true],
      [57.0, 63.8, 'Daire diliminin alanı = π · r² · α/360', true],
      [76.4, 79.8, 'Bağıntı her dilimde işliyor', true]]);
  }

  function summary(ctx, env, t) {
    if (t < 80.4) return;
    const S = KD.L(env).SUM, f = F(), a = END(t);
    [['Açı 360°’nin kaçta kaçıysa…', 80.6], ['…yay çemberin, dilim dairenin o kadarı', 81.6], ['Yay = 2πr · α/360', 82.6], ['Dilimin alanı = πr² · α/360', 83.6, true]].forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.expr(ctx, [s], S.x, S.y[i], S.s * (i === 3 ? 1.1 : 1), { alpha: al, w: S.w, halo: true, color: hot ? A.amber : undefined });
    });
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  LI.world = function (ctx, env, t) { context(ctx, env, t); figure(ctx, env, t); words(ctx, env, t); summary(ctx, env, t); };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'A slice', nameTr: 'Bir dilim', concept: 'A 90° sector', conceptTr: '90° lik dilim', render });
})(window.LI = window.LI || {});
