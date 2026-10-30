import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../hooks.js';
import { hole } from '../space.js';

/*
 * One continuous universe behind the whole page (fixed canvas):
 *  - layered starfield with scroll/mouse parallax, nebula and distant galaxies
 *  - the Sun with planets on tilted orbits (top-left)
 *  - a black hole with a Doppler-brightened accretion disk, lensed far side and photon ring
 *  - tech icons (chips, boards, neural nets, code, databases...) drifting in from deep space,
 *    spiralling down, stretching and redshifting before they cross the horizon
 */
const P = (d) => new Path2D(d);
const c = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;

const ICONS = [
  P('M6 6h12v12H6z M9 9h6v6H9z M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3'), // CPU
  P('M3 8h15v10H3z M18 10h3v6h-3 M5 4h2l1 2 1-2 1 2 1-2 1 2h2 M5 10h5v5H5z M12 11h4M12 13h4M12 15h3 M5 18v2M8 18v2M11 18v2M14 18v2M17 18v2'), // ESP32 board
  P([c(4, 7, 1.8), c(4, 17, 1.8), c(12, 4, 1.8), c(12, 12, 1.8), c(12, 20, 1.8), c(20, 9, 1.8), c(20, 15, 1.8)].join(' ') +
    ' M5.7 7.5 10.3 4.5M5.7 8 10.4 11.3M5.6 15 10.6 5.1M5.7 16 10.4 12.7M5.7 16.5 10.3 19.5 M13.7 4.6 18.3 8.4M13.8 11.6 18.2 9.4M13.8 12.4 18.2 14.6M13.7 19.4 18.3 15.6'), // neural net
  P('M12 2.5c.9 4.6 3.9 7.6 8.5 8.5-4.6.9-7.6 3.9-8.5 8.5-.9-4.6-3.9-7.6-8.5-8.5 4.6-.9 7.6-3.9 8.5-8.5z M19 2.5v4M17 4.5h4'), // AI spark
  P('M9 4c-3 0-3 2-3 4s-1 4-3 4c2 0 3 2 3 4s0 4 3 4 M15 4c3 0 3 2 3 4s1 4 3 4c-2 0-3 2-3 4s0 4-3 4'), // { }
  P('M8 7l-5 5 5 5 M16 7l5 5-5 5 M14 4l-4 16'), // </>
  P('M5 6c0-1.7 3.1-3 7-3s7 1.3 7 3-3.1 3-7 3-7-1.3-7-3zm0 0v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6 M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3'), // database
  P(`M5 9h14v10H5z M12 5v4 ${c(12, 4, 1.4)} ${c(9, 13, 1.4)} ${c(15, 13, 1.4)} M9.5 16.5h5 M3 12v4M21 12v4`), // robot
  P(`M2 12c3-5 6.5-7 10-7s7 2 10 7c-3 5-6.5 7-10 7s-7-2-10-7z ${c(12, 12, 3.2)}`), // vision / camera eye
  P('M3 5h18v14H3z M6 10l3 2-3 2 M11 15h5'), // terminal
  P(`${c(6, 5, 2)} ${c(6, 19, 2)} ${c(18, 8, 2)} M6 7v10 M18 10c0 4-6 3-11.2 7.4`), // git branch
  P('M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 11.5 3.5 3.5 0 0 0 7 18z'), // cloud
  P('M1 12h5l1.5-3 2 6 2-6 2 6 2-6 1.5 3h5'), // resistor
  P('M8 14v-4a4 4 0 0 1 8 0v4z M6.5 14h11 M10 14v7 M14 14v5 M18 4l2-2M19.5 7.5H22'), // LED
  P(`${c(12, 12, 9)} ${c(12, 12, 2.5)} M12 3v6.5M12 14.5V21M3 12h6.5M14.5 12H21`), // wheel
];
const TINTS = [
  [190, 230, 255],
  [255, 214, 160],
  [210, 196, 255],
  [170, 255, 225],
];

const PLANETS = [
  { orbit: 0.42, speed: 0.00042, size: 0.11, base: [170, 160, 150], shade: [70, 64, 60], phase: 0.6 }, // rocky
  { orbit: 0.68, speed: 0.00028, size: 0.17, base: [80, 150, 255], shade: [12, 40, 110], phase: 2.4, cloud: true }, // blue world
  { orbit: 0.95, speed: 0.0002, size: 0.13, base: [235, 120, 80], shade: [110, 40, 25], phase: 4.1 }, // red world
  { orbit: 1.35, speed: 0.00012, size: 0.3, base: [235, 205, 150], shade: [120, 90, 55], phase: 1.2, ring: true, bands: true }, // ringed giant
];

export default function SpaceBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduce = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, px: -9999, py: -9999, lx: null, ly: null };
    let w = 0, h = 0, R = 40, sunX = 0, sunY = 0, sunR = 30, orbitScale = 200;
    let stars = [], disk = [], items = [], flashes = [], dust = [], nebula = null;
    let raf = 0, last = 0, spawnAcc = 0, scrollY = window.scrollY;

    const newDisk = () => ({ r: R * (1.55 + Math.pow(Math.random(), 1.7) * 3.4), a: Math.random() * Math.PI * 2, s: Math.random() * 1.3 + 0.4, j: (Math.random() - 0.5) * 0.06 });

    const buildNebula = () => {
      const cv = document.createElement('canvas');
      cv.width = w * dpr;
      cv.height = h * dpr;
      const n = cv.getContext('2d');
      n.scale(dpr, dpr);
      const blob = (x, y, r, rgb, a) => {
        const g = n.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(${rgb}, ${a})`);
        g.addColorStop(1, `rgba(${rgb}, 0)`);
        n.fillStyle = g;
        n.fillRect(x - r, y - r, r * 2, r * 2);
      };
      blob(w * 0.2, h * 0.75, w * 0.45, '70, 60, 180', 0.18);
      blob(w * 0.55, h * 0.1, w * 0.35, '40, 110, 180', 0.12);
      blob(w * 0.95, h * 0.85, w * 0.35, '150, 60, 140', 0.12);
      blob(hole.x, hole.y, R * 9, '255, 130, 50', 0.1);
      n.save();
      n.translate(w * 0.45, h * 0.55);
      n.rotate(-0.45);
      n.scale(1, 0.16);
      blob(0, 0, w * 0.4, '80, 100, 170', 0.12);
      n.restore();
      for (let i = 0; i < 5; i++) {
        n.save();
        n.translate(Math.random() * w, Math.random() * h);
        n.rotate(Math.random() * Math.PI);
        n.scale(1, 0.3 + Math.random() * 0.3);
        blob(0, 0, 9 + Math.random() * 15, '220, 210, 255', 0.45);
        blob(0, 0, 2.5, '255, 250, 240', 0.9);
        n.restore();
      }
      return cv;
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      const narrow = w < 900;
      R = Math.min(w, h) * (narrow ? 0.075 : 0.085);
      hole.x = narrow ? w * 0.62 : w * 0.74;
      hole.y = narrow ? h * 0.3 : h * 0.46;
      hole.R = R;
      hole.ready = true;
      sunR = Math.min(w, h) * (narrow ? 0.045 : 0.04);
      sunX = narrow ? w * 0.16 : w * 0.08;
      sunY = narrow ? h * 0.14 : h * 0.15;
      orbitScale = Math.min(w, h) * (narrow ? 0.38 : 0.3);
      stars = Array.from({ length: Math.round((w * h) / 2000) }, () => {
        const t = Math.random();
        return {
          x: Math.random() * w,
          y: Math.random() * h * 1.6,
          r: Math.random() < 0.93 ? Math.random() * 0.8 + 0.25 : Math.random() * 1.3 + 0.9,
          a: Math.random() * 0.7 + 0.25,
          tw: Math.random() * 6.28,
          sp: Math.random() * 1.5 + 0.4,
          d: Math.random(),
          c: t < 0.12 ? '255, 214, 170' : t < 0.35 ? '190, 210, 255' : '255, 255, 255',
        };
      });
      disk = Array.from({ length: narrow ? 900 : 1600 }, newDisk);
      items = [];
      nebula = buildNebula();
    };

    const diskColor = (r) => {
      const k = Math.min(1, Math.max(0, (r / R - 1.55) / 3.4));
      return [255, Math.round(235 - k * 150), Math.round(200 - k * 175)];
    };

    const drawPlanet = (p, x, y, size) => {
      const lx = sunX - x;
      const ly = sunY - y;
      const ld = Math.hypot(lx, ly) || 1;
      const hx = x + (lx / ld) * size * 0.45;
      const hy = y + (ly / ld) * size * 0.45;
      if (p.ring) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-0.35);
        ctx.strokeStyle = `rgba(${p.base.join(',')}, 0.45)`;
        ctx.lineWidth = size * 0.22;
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 2.1, size * 0.55, 0, Math.PI, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      const g = ctx.createRadialGradient(hx, hy, size * 0.1, x, y, size);
      g.addColorStop(0, `rgb(${p.base.map((v) => Math.min(255, v + 40)).join(',')})`);
      g.addColorStop(0.55, `rgb(${p.base.join(',')})`);
      g.addColorStop(1, `rgb(${p.shade.join(',')})`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      if (p.bands || p.cloud) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = p.cloud ? 'rgba(255,255,255,0.35)' : 'rgba(150,100,60,0.35)';
        for (let i = -2; i <= 2; i++) ctx.fillRect(x - size, y + i * size * 0.32 - size * 0.06, size * 2, size * (p.cloud ? 0.08 : 0.13));
        ctx.restore();
      }
      // night side
      const n = ctx.createLinearGradient(x + (lx / ld) * size, y + (ly / ld) * size, x - (lx / ld) * size, y - (ly / ld) * size);
      n.addColorStop(0.45, 'rgba(0,0,0,0)');
      n.addColorStop(1, 'rgba(0,0,6,0.75)');
      ctx.fillStyle = n;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      if (p.ring) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-0.35);
        ctx.strokeStyle = `rgba(${p.base.join(',')}, 0.6)`;
        ctx.lineWidth = size * 0.22;
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 2.1, size * 0.55, 0, 0, Math.PI);
        ctx.stroke();
        ctx.restore();
      }
    };

    const spawnItem = () => {
      const th = Math.random() * Math.PI * 2;
      items.push({
        icon: ICONS[Math.floor(Math.random() * ICONS.length)],
        tint: TINTS[Math.floor(Math.random() * TINTS.length)],
        th,
        r: Math.max(w, h) * (0.6 + Math.random() * 0.25),
        v: 0.3 + Math.random() * 0.4,
        size: 11 + Math.random() * 8,
        spin: (Math.random() - 0.5) * 0.004,
        flip: Math.random() * Math.PI * 2,
        vflip: 0.0015 + Math.random() * 0.002,
        trail: [],
        rot: Math.random() * Math.PI * 2,
        age: 0,
      });
    };

    const frame = (now) => {
      const dt = last ? Math.min(50, now - last) : 16;
      last = now;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      const sy = scrollY;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#04050b';
      ctx.fillRect(0, 0, w, h);
      if (nebula) ctx.drawImage(nebula, 0, -((sy * 0.03) % 1), w, h);

      // stars with depth parallax (wrap vertically)
      const t = now / 1000;
      const span = h * 1.6;
      for (const s of stars) {
        const a = s.a * (0.7 + 0.3 * Math.sin(t * s.sp + s.tw));
        const x = s.x + mouse.x * 14 * s.d;
        let y = (s.y - sy * (0.05 + s.d * 0.12)) % span;
        if (y < 0) y += span;
        y += mouse.y * 10 * s.d - h * 0.3;
        if (y < -5 || y > h + 5) continue;
        // the cursor acts like a small lens: nearby stars are pushed outward and brighten
        let sx = x;
        let syy = y;
        let boost = 1;
        const ldx = x - mouse.px;
        const ldy = y - mouse.py;
        const ld = Math.hypot(ldx, ldy);
        if (ld < 160 && ld > 0.5) {
          const k = (160 - ld) / 160;
          sx += (ldx / ld) * k * k * 36;
          syy += (ldy / ld) * k * k * 36;
          boost = 1 + k * 1.5;
        }
        ctx.fillStyle = `rgba(${s.c}, ${Math.min(1, a * boost)})`;
        ctx.beginPath();
        ctx.arc(sx, syy, s.r * (boost > 1 ? 1 + (boost - 1) * 0.4 : 1), 0, Math.PI * 2);
        ctx.fill();
        if (s.r > 1.4) {
          ctx.fillStyle = `rgba(${s.c}, ${a * 0.25})`;
          ctx.fillRect(sx - s.r * 3, syy - 0.4, s.r * 6, 0.8);
          ctx.fillRect(sx - 0.4, syy - s.r * 3, 0.8, s.r * 6);
        }
      }

      // --- Sun and planets (drift up gently with scroll) ---
      const syS = sunY - Math.min(sy * 0.06, h * 0.12) + mouse.y * 16;
      const sxS = sunX + mouse.x * 24;
      ctx.globalCompositeOperation = 'lighter';
      const corona = ctx.createRadialGradient(sxS, syS, sunR * 0.4, sxS, syS, sunR * 7);
      corona.addColorStop(0, 'rgba(255, 220, 150, 0.55)');
      corona.addColorStop(0.25, 'rgba(255, 170, 80, 0.16)');
      corona.addColorStop(1, 'rgba(255, 140, 60, 0)');
      ctx.fillStyle = corona;
      ctx.fillRect(sxS - sunR * 7, syS - sunR * 7, sunR * 14, sunR * 14);
      ctx.globalCompositeOperation = 'source-over';
      const core = ctx.createRadialGradient(sxS - sunR * 0.2, syS - sunR * 0.2, 0, sxS, syS, sunR);
      core.addColorStop(0, '#fffbe8');
      core.addColorStop(0.6, '#ffd77a');
      core.addColorStop(1, '#ff9f3d');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(sxS, syS, sunR * (1 + 0.012 * Math.sin(t * 2)), 0, Math.PI * 2);
      ctx.fill();

      const tiltO = 0.32;
      for (const p of PLANETS) {
        const or = orbitScale * p.orbit;
        ctx.strokeStyle = 'rgba(180, 200, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(sxS, syS, or, or * tiltO, -0.18, 0, Math.PI * 2);
        ctx.stroke();
        if (!reduce) p.phase += p.speed * dt;
        const ca = Math.cos(p.phase);
        const sa = Math.sin(p.phase);
        const ex = or * ca;
        const ey = or * tiltO * sa;
        const rx = ex * Math.cos(-0.18) - ey * Math.sin(-0.18);
        const ry = ex * Math.sin(-0.18) + ey * Math.cos(-0.18);
        const depth = 0.85 + 0.15 * sa; // nearer when in front
        const size = sunR * p.size * 2.2 * depth;
        const behindSun = sa < 0 && Math.hypot(rx, ry) < sunR;
        if (!behindSun) drawPlanet(p, sxS + rx + mouse.x * 14 * depth * p.orbit, syS + ry + mouse.y * 9 * depth * p.orbit, size);
      }

      // --- Black hole ---
      const cx = hole.x - mouse.x * 14;
      const cy = hole.y - mouse.y * 10;
      const tilt = 0.2 + mouse.y * 0.12;
      if (!reduce) for (const p of disk) p.a += 0.018 * Math.pow(R / p.r, 1.5) * (dt / 16);

      ctx.globalCompositeOperation = 'lighter';
      const glow = ctx.createRadialGradient(cx, cy, R * 0.8, cx, cy, R * 7);
      glow.addColorStop(0, 'rgba(255, 150, 70, 0.28)');
      glow.addColorStop(0.35, 'rgba(255, 110, 50, 0.08)');
      glow.addColorStop(1, 'rgba(255, 90, 40, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(cx - R * 7, cy - R * 7, R * 14, R * 14);

      const band = (front) => {
        ctx.lineWidth = R * 0.2;
        for (let k = 0; k < 18; k++) {
          const rx = R * (1.6 + k * 0.19);
          const [cr, cg, cb] = diskColor(rx);
          ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${0.075 * (1 - k / 22)})`;
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, rx * tilt, 0, front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2);
          ctx.stroke();
        }
      };
      const particles = (front) => {
        for (const p of disk) {
          const s = Math.sin(p.a);
          if (front ? s < 0 : s >= 0) continue;
          const [cr, cg, cb] = diskColor(p.r);
          const beam = 1 + 0.65 * -Math.cos(p.a);
          ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${Math.min(1, 0.22 * p.s * beam * (front ? 1 : 0.8))})`;
          const sz = p.s * (p.r < R * 2.2 ? 1.5 : 1.1);
          ctx.fillRect(cx + p.r * Math.cos(p.a), cy + p.r * s * tilt + p.j * R, sz * 1.8, sz);
        }
      };
      band(false);
      particles(false);
      for (let k = 0; k < 26; k++) {
        const rr = R * (1.18 + k * 0.045);
        const a = 0.085 * (1 - k / 26);
        const [cr, cg, cb] = diskColor(R * (1.6 + k * 0.12));
        ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${a})`;
        ctx.lineWidth = R * 0.075;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rr * 1.04, rr, 0, Math.PI * 1.02, Math.PI * 1.98);
        ctx.stroke();
        ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${a * 0.35})`;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rr * 1.04, rr * 0.92, 0, Math.PI * 0.08, Math.PI * 0.92);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
      const sh = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.12);
      sh.addColorStop(0, 'rgba(0, 0, 0, 1)');
      sh.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sh;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = 'rgba(255, 236, 210, 0.85)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.04, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255, 190, 120, 0.25)';
      ctx.lineWidth = 5;
      ctx.stroke();
      band(true);
      particles(true);

      // --- icons falling in ---
      if (!reduce) {
        spawnAcc += dt;
        const every = w < 900 ? 600 : 380;
        while (spawnAcc > every) {
          spawnAcc -= every;
          if (items.length < (w < 900 ? 14 : 26)) spawnItem();
        }
      } else if (!items.length) {
        for (let i = 0; i < 12; i++) spawnItem();
        items.forEach((f) => (f.r *= 0.3 + Math.random() * 0.5));
      }
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      items = items.filter((f) => {
        if (!reduce) {
          f.age += dt;
          const pull = 1 + (R * 5) / f.r;
          f.r -= f.v * pull * pull * (dt / 16);
          f.th += 0.0035 * Math.pow((R * 6) / f.r, 1.25) * (dt / 16);
          f.rot += f.spin * dt;
        }
        if (f.r < R * 1.25) {
          flashes.push({ x: cx + f.r * Math.cos(f.th), y: cy + f.r * Math.sin(f.th) * 0.22, life: 1 });
          for (let i = 0; i < 6; i++) disk.push(Object.assign(newDisk(), { r: R * (1.6 + Math.random() * 0.5), a: f.th }));
          if (disk.length > 2200) disk.splice(0, disk.length - 2200);
          return false;
        }
        const near = Math.min(1, (R * 7) / f.r);
        const flat = 0.95 - near * 0.73;
        let x = cx + f.r * Math.cos(f.th);
        let y = cy + f.r * Math.sin(f.th) * flat;
        // cursor nudges icons aside as you sweep past them
        const mdx = x - mouse.px;
        const mdy = y - mouse.py;
        const md = Math.hypot(mdx, mdy);
        if (md < 120 && md > 0.5) {
          f.th += ((120 - md) / 120) * 0.004 * Math.sign(mdx * Math.sin(f.th) - mdy * Math.cos(f.th) || 1);
          f.r += ((120 - md) / 120) * 1.2;
        }
        x = cx + f.r * Math.cos(f.th);
        y = cy + f.r * Math.sin(f.th) * flat;
        if (!reduce) f.flip += f.vflip * dt;
        const tangent = Math.atan2(Math.cos(f.th) * flat, -Math.sin(f.th));
        const stretch = 1 + Math.pow(near, 2.2) * 3;
        const a = Math.min(1, f.age / 900) * (0.5 + near * 0.45) * Math.min(1, (f.r - R * 1.25) / (R * 1.2));
        const [tr, tg, tb] = f.tint;
        const rr = Math.round(tr + (255 - tr) * near);
        const gg = Math.round(tg - (tg - 120) * near);
        const bb = Math.round(tb - (tb - 60) * near);
        const col = `${rr}, ${gg}, ${bb}`;

        // motion trail
        f.trail.push([x, y]);
        if (f.trail.length > 14) f.trail.shift();
        if (f.trail.length > 2) {
          ctx.lineWidth = 1.2;
          for (let i = 1; i < f.trail.length; i++) {
            ctx.strokeStyle = `rgba(${col}, ${(i / f.trail.length) * a * 0.35})`;
            ctx.beginPath();
            ctx.moveTo(f.trail[i - 1][0], f.trail[i - 1][1]);
            ctx.lineTo(f.trail[i][0], f.trail[i][1]);
            ctx.stroke();
          }
        }

        // glow halo
        const halo = f.size * 1.6;
        const hg = ctx.createRadialGradient(x, y, 0, x, y, halo);
        hg.addColorStop(0, `rgba(${col}, ${a * 0.35})`);
        hg.addColorStop(1, `rgba(${col}, 0)`);
        ctx.fillStyle = hg;
        ctx.fillRect(x - halo, y - halo, halo * 2, halo * 2);

        // the icon itself, spinning in 3D (x-scale follows cos of its flip angle)
        const flipK = Math.cos(f.flip);
        const face = 0.55 + 0.45 * Math.abs(flipK);
        const size = f.size * (1 - near * 0.3);
        const s = size / 24;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(near > 0.25 ? tangent : 0);
        ctx.scale(stretch, 1 / (1 + (stretch - 1) * 0.45));
        ctx.rotate(near > 0.25 ? 0 : f.rot);
        ctx.scale(s * Math.max(0.12, Math.abs(flipK)), s);
        ctx.translate(-12, -12);
        ctx.fillStyle = `rgba(${col}, ${a * 0.12 * face})`;
        ctx.fill(f.icon);
        ctx.strokeStyle = `rgba(${col}, ${a * face})`;
        ctx.lineWidth = 1.7 / s;
        ctx.stroke(f.icon);
        ctx.restore();
        return true;
      });

      flashes = flashes.filter((fl) => {
        fl.life -= dt / 400;
        if (fl.life <= 0) return false;
        const g = ctx.createRadialGradient(fl.x, fl.y, 0, fl.x, fl.y, 18);
        g.addColorStop(0, `rgba(255, 220, 180, ${fl.life * 0.8})`);
        g.addColorStop(1, 'rgba(255, 160, 80, 0)');
        ctx.fillStyle = g;
        ctx.fillRect(fl.x - 18, fl.y - 18, 36, 36);
        return true;
      });
      // stardust from the cursor, pulled toward the black hole
      dust = dust.filter((d) => {
        d.life -= dt / d.span;
        if (d.life <= 0) return false;
        const dx = cx - d.x;
        const dy = cy - d.y;
        const dd = Math.hypot(dx, dy) || 1;
        if (dd < R * 1.1) return false;
        const pull = Math.min(0.02, 30 / (dd * dd) + 0.00035);
        d.vx += ((dx / dd) * pull + (-dy / dd) * pull * 0.5) * dt;
        d.vy += ((dy / dd) * pull + (dx / dd) * pull * 0.5) * dt;
        d.vx *= 0.992;
        d.vy *= 0.992;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        const al = Math.min(1, d.life * 1.4) * d.a;
        ctx.fillStyle = `rgba(${d.c}, ${al * 0.18})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${d.c}, ${al})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });
      if (dust.length > 420) dust.splice(0, dust.length - 420);
      ctx.globalCompositeOperation = 'source-over';

      if (!reduce && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const DUST = ['190, 225, 255', '255, 205, 150', '220, 205, 255', '255, 255, 255'];
    const onMove = (e) => {
      mouse.tx = e.clientX / window.innerWidth - 0.5;
      mouse.ty = e.clientY / window.innerHeight - 0.5;
      mouse.px = e.clientX;
      mouse.py = e.clientY;
      if (reduce || e.pointerType === 'touch') return;
      const vx = mouse.lx == null ? 0 : e.clientX - mouse.lx;
      const vy = mouse.ly == null ? 0 : e.clientY - mouse.ly;
      mouse.lx = e.clientX;
      mouse.ly = e.clientY;
      const n = Math.min(6, 2 + Math.floor(Math.hypot(vx, vy) / 10));
      for (let i = 0; i < n; i++) {
        dust.push({
          x: e.clientX + (Math.random() - 0.5) * 6,
          y: e.clientY + (Math.random() - 0.5) * 6,
          vx: vx * 0.004 + (Math.random() - 0.5) * 0.06,
          vy: vy * 0.004 + (Math.random() - 0.5) * 0.06,
          r: Math.random() * 1.4 + 0.7,
          a: 0.6 + Math.random() * 0.4,
          c: DUST[Math.floor(Math.random() * DUST.length)],
          life: 1,
          span: 1800 + Math.random() * 2200,
        });
      }
    };
    const onLeave = () => {
      mouse.px = -9999;
      mouse.py = -9999;
      mouse.lx = null;
      mouse.ly = null;
    };
    const onScroll = () => {
      scrollY = window.scrollY;
      if (reduce) start();
    };
    const onResize = () => {
      resize();
      start();
    };
    const onVisibility = () => {
      if (!document.hidden) start();
    };

    resize();
    start();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.documentElement.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="space-bg" aria-hidden="true" />;
}
