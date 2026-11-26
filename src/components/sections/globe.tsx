"use client";

import { useEffect, useRef } from "react";

import landDots from "@/components/sections/globe-dots.json";
import { type Flag, mapCountries } from "@/components/sections/map-countries";
import { cn } from "@/lib/utils";

/*
 * A dotted globe facing Africa (after the pxxl.app hero).
 *
 * - Land is round dots generated from Natural Earth coastlines
 *   (scripts/build-globe-dots.mjs); they shrink and fade toward the rim,
 *   and a soft glow traces the globe's edge.
 * - Great-circle routes link the countries, lifted off the surface, each
 *   with a red comet gliding along it.
 * - A spotlight moves from country to country: the active marker grows,
 *   pulses and shows its name, and its routes light up.
 * - Visitors can drag to spin the globe; it eases back to face Africa.
 */

const DEG = Math.PI / 180;
const CENTER = { lon: 14, lat: 6 }; // where the globe faces with reduced motion
// Camera tour, as on pxxl's sign-in page: glide to a country, pause, move on.
const STOP_MS = 3800; // time per country, including the glide
const MOVE_MS = 1500; // length of the glide
const TOUR = ["ng", "cm", "et", "ke", "ug", "rw", "mw", "bw", "gh", "sl", "sn"];
const RED = "255, 59, 69";

// Routes between countries (codes from map-countries.ts).
const ROUTES: [string, string][] = [
  ["ng", "gh"], ["gh", "sl"], ["sl", "sn"], ["ng", "cm"],
  ["ng", "et"], ["et", "ke"], ["ke", "ug"], ["ug", "rw"],
  ["rw", "mw"], ["mw", "bw"], ["bw", "ng"], ["ng", "ug"],
];

type V3 = [number, number, number];

const toVec = (lon: number, lat: number): V3 => [
  Math.cos(lat * DEG) * Math.cos(lon * DEG),
  Math.cos(lat * DEG) * Math.sin(lon * DEG),
  Math.sin(lat * DEG),
];

/** Point along the great circle between a and b (t from 0 to 1). */
function slerp(a: V3, b: V3, t: number): V3 {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const w = Math.acos(dot);
  if (w < 1e-6) return a;
  const s = Math.sin(w);
  const k1 = Math.sin((1 - t) * w) / s;
  const k2 = Math.sin(t * w) / s;
  return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
}

function drawFlag(ctx: CanvasRenderingContext2D, flag: Flag, x: number, y: number, r: number) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.clip();
  const total = flag.stripes.reduce((n, s) => n + (s.weight ?? 1), 0);
  let pos = 0;
  for (const s of flag.stripes) {
    const size = ((s.weight ?? 1) / total) * r * 2;
    ctx.fillStyle = s.color;
    if (flag.dir === "h") ctx.fillRect(x - r, y - r + pos, r * 2, size + 0.5);
    else ctx.fillRect(x - r + pos, y - r, size + 0.5, r * 2);
    pos += size;
  }
  if (flag.disc) {
    ctx.fillStyle = flag.disc;
    ctx.beginPath();
    ctx.arc(x, y, r * 0.32, 0, Math.PI * 2);
    ctx.fill();
  }
  if (flag.star) {
    ctx.fillStyle = flag.star;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const rr = i % 2 === 0 ? r * 0.34 : r * 0.14;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.fill();
  }
  ctx.restore();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const ease = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

export function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Canvas can't read CSS variables, so take the page's resolved font.
    const font = getComputedStyle(document.body).fontFamily;
    const dots = (landDots as [number, number][]).map(([lon, lat]) => toVec(lon, lat));
    const countries = mapCountries.map((c) => ({ ...c, v: toVec(c.lon, c.lat), grow: c.hub ? 1 : 0 }));
    const byCode = Object.fromEntries(countries.map((c) => [c.code, c]));
    const tour = TOUR.map((code) => byCode[code]).filter(Boolean);
    // Each route gets its own comet speed, offset and direction.
    const routes = ROUTES.filter(([a, b]) => byCode[a] && byCode[b]).map(([a, b], i) => ({
      from: a,
      to: b,
      a: byCode[a].v,
      b: byCode[b].v,
      speed: 3600 + ((i * 977) % 2600),
      offset: (i * 0.29) % 1,
      reverse: i % 3 === 1,
    }));

    // ---- Size ----
    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ---- Drag to spin, easing back to Africa ----
    const drag = { active: false, x: 0, y: 0, lon: 0, lat: 0, vLon: 0, idle: 0 };
    const onDown = (e: PointerEvent) => {
      drag.active = true;
      drag.x = e.clientX;
      drag.y = e.clientY;
      drag.vLon = 0;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!drag.active) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      drag.x = e.clientX;
      drag.y = e.clientY;
      drag.lon -= dx * 0.22;
      drag.lat = Math.max(-25, Math.min(25, drag.lat + dy * 0.18));
      drag.vLon = -dx * 0.22;
    };
    const onUp = () => {
      drag.active = false;
      drag.idle = performance.now();
      canvas.style.cursor = "grab";
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.style.cursor = "grab";

    let raf = 0;
    const start = performance.now();
    let last = start;

    const frame = (now: number) => {
      const t = now - start;
      const dt = Math.min(now - last, 50);
      last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Drag inertia, then a slow ease back to the resting view.
      if (!drag.active) {
        drag.lon += drag.vLon;
        drag.vLon *= 0.92;
        if (now - drag.idle > 1200) {
          drag.lon *= 0.965;
          drag.lat *= 0.965;
        }
      }

      // Globe size and position: zoomed in like pxxl's, centred right on desktop.
      const wide = w >= 1024;
      const R = wide ? Math.max(h * 1.0, w * 0.44) : Math.max(w * 1.1, h * 0.66);
      const cx = wide ? w * 0.62 : w * 0.5;
      const cy = wide ? h * 0.45 : h * 0.4;

      // Camera tour: glide (eased) from the last stop to the current one.
      const stop = Math.floor(t / STOP_MS);
      const cur = tour[stop % tour.length];
      const prev = tour[(stop - 1 + tour.length) % tour.length];
      const m = stop === 0 ? 1 : easeInOut(Math.min(1, (t % STOP_MS) / MOVE_MS));
      const focus = reduce ? toVec(CENTER.lon, CENTER.lat) : slerp(prev.v, cur.v, m);
      const lon0 = (Math.atan2(focus[1], focus[0]) / DEG + drag.lon) * DEG;
      const lat0 = (Math.asin(Math.max(-1, Math.min(1, focus[2]))) / DEG + drag.lat) * DEG;
      const cl = Math.cos(lon0);
      const sl = -Math.sin(lon0);
      const cp = Math.cos(lat0);
      const sp = Math.sin(lat0);
      // Rotate a unit vector into view space: x right, y up, depth toward viewer.
      const view = (v: V3, lift = 1) => {
        const x1 = v[0] * cl - v[1] * sl;
        const y1 = v[0] * sl + v[1] * cl;
        const z1 = v[2];
        const depth = x1 * cp + z1 * sp;
        const up = -x1 * sp + z1 * cp;
        return { sx: cx + y1 * R * lift, sy: cy - up * R * lift, depth };
      };

      // Soft glow tracing the globe's edge.
      const rim = ctx.createRadialGradient(cx, cy, R * 0.86, cx, cy, R * 1.08);
      rim.addColorStop(0, "rgba(255,255,255,0)");
      rim.addColorStop(0.72, "rgba(255,255,255,0.05)");
      rim.addColorStop(0.8, "rgba(255,255,255,0.02)");
      rim.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = rim;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.08, 0, Math.PI * 2);
      ctx.fill();

      // Land: round dots, batched into brightness bands for speed.
      const BANDS = 8;
      const paths = Array.from({ length: BANDS }, () => new Path2D());
      for (const v of dots) {
        const p = view(v);
        if (p.depth <= 0.03) continue;
        if (p.sx < -4 || p.sx > w + 4 || p.sy < -4 || p.sy > h + 4) continue;
        const k = Math.pow(p.depth, 0.55);
        const band = Math.min(BANDS - 1, Math.floor(k * BANDS));
        const r = 0.45 + 1.05 * k;
        paths[band].moveTo(p.sx + r, p.sy);
        paths[band].arc(p.sx, p.sy, r, 0, Math.PI * 2);
      }
      paths.forEach((path, i) => {
        ctx.fillStyle = `rgba(255,255,255,${(0.06 + (0.36 * (i + 1)) / BANDS).toFixed(3)})`;
        ctx.fill(path);
      });

      // Spotlight: the country the camera has arrived at (the hub when still).
      const active = reduce ? byCode.ng ?? countries[0] : cur;
      const arrived = reduce || stop === 0 ? 1 : ease(Math.max(0, ((t % STOP_MS) - MOVE_MS * 0.7) / 450));
      const into = Math.min(1, arrived);
      for (const c of countries) {
        const target = c === active ? into : 0;
        c.grow += (target - c.grow) * Math.min(1, dt / 160);
      }

      // Great-circle routes, lifted off the surface (longer routes arc higher).
      const SAMPLES = 72;
      for (const r of routes) {
        const span = Math.acos(Math.min(1, r.a[0] * r.b[0] + r.a[1] * r.b[1] + r.a[2] * r.b[2]));
        const lift = 0.04 + span * 0.12;
        const pts: { sx: number; sy: number; depth: number }[] = [];
        for (let k = 0; k <= SAMPLES; k++) {
          const u = k / SAMPLES;
          pts.push(view(slerp(r.a, r.b, u), 1 + lift * Math.sin(Math.PI * u)));
        }
        const lit = r.from === active.code || r.to === active.code;

        // Track: a fine line that fades in and out near the markers (so it
        // never stabs into a flag) and round the back of the globe. The
        // active country's routes turn red.
        ctx.lineCap = "round";
        ctx.lineWidth = lit ? 1.1 : 0.8;
        for (let k = 0; k < SAMPLES; k++) {
          const a = pts[k];
          const b = pts[k + 1];
          const d = Math.min(a.depth, b.depth);
          if (d <= -0.05) continue;
          const u = (k + 0.5) / SAMPLES;
          const ends = Math.min(1, u / 0.1, (1 - u) / 0.1);
          const alpha = (lit ? 0.55 : 0.2) * ends * Math.max(0, Math.min(1, d * 3 + 0.2));
          if (alpha < 0.01) continue;
          ctx.strokeStyle = lit ? `rgba(${RED},${alpha.toFixed(3)})` : `rgba(255,255,255,${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy);
          ctx.lineTo(b.sx, b.sy);
          ctx.stroke();
        }

        // Comet: a smooth tail that thickens toward a small glowing head.
        if (!reduce) {
          const phase = ((t / r.speed + r.offset) % 1) * 1.5 - 0.25;
          const head = Math.min(Math.max(phase, 0), 1);
          const tail = Math.min(Math.max(phase - 0.3, 0), 1);
          if (head > tail) {
            const from = Math.floor(tail * SAMPLES);
            const to = Math.ceil(head * SAMPLES);
            const at = (k: number) => pts[r.reverse ? SAMPLES - k : k];
            for (let k = from; k < to; k++) {
              const a = at(k);
              const b = at(k + 1);
              if (!a || !b || Math.min(a.depth, b.depth) <= 0) continue;
              const f = (k - from) / Math.max(to - from, 1); // 0 tail → 1 head
              ctx.strokeStyle = `rgba(${RED},${(0.9 * f * f).toFixed(3)})`;
              ctx.lineWidth = 0.6 + 1.6 * f;
              ctx.beginPath();
              ctx.moveTo(a.sx, a.sy);
              ctx.lineTo(b.sx, b.sy);
              ctx.stroke();
            }
            const hp = at(Math.min(to, SAMPLES));
            if (hp && hp.depth > 0 && head < 1) {
              ctx.save();
              ctx.shadowColor = `rgba(${RED},1)`;
              ctx.shadowBlur = 14;
              ctx.fillStyle = "rgba(255,190,194,1)";
              ctx.beginPath();
              ctx.arc(hp.sx, hp.sy, 1.9, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          }
        }
      }

      // Markers: active one last so it sits on top.
      const order = [...countries].sort((a, b) => a.grow - b.grow);
      for (const c of order) {
        const p = view(c.v);
        if (p.depth <= 0.05) continue;
        const g = c.grow;
        const r = 5.5 + 6.5 * g;

        if (g > 0.02) {
          // Pulsing ring and glow on the spotlit country.
          const pulse = reduce ? 0 : (t % 1800) / 1800;
          ctx.strokeStyle = `rgba(${RED},${(0.75 * (1 - pulse) * g).toFixed(3)})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, r + 3 + pulse * 14, 0, Math.PI * 2);
          ctx.stroke();
          ctx.save();
          ctx.shadowColor = `rgba(${RED},0.9)`;
          ctx.shadowBlur = 18 * g;
          ctx.fillStyle = `rgba(${RED},${g.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, r + 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        if (g < 0.98) {
          ctx.fillStyle = `rgba(255,255,255,${(0.2 * (1 - g)).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, r + 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = "#0b0b0b";
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r + 1.5, 0, Math.PI * 2);
        ctx.fill();
        drawFlag(ctx, c.flag, p.sx, p.sy, r);

        // Name tag on the spotlit country, sliding in.
        if (c === active && into > 0.01) {
          const label = `${c.city}, ${c.code.toUpperCase()} · Tracking`;
          ctx.font = `600 13px ${font}`;
          const tw = ctx.measureText(label).width;
          // Sit right of the marker, or flip left if it would leave the screen.
          const boxW = tw + 20;
          const fitsRight = p.sx + r + 12 + boxW < w - 16;
          const x = fitsRight
            ? p.sx + r + 12 - (1 - into) * 8
            : p.sx - r - 12 - boxW + (1 - into) * 8;
          const y = p.sy;
          ctx.globalAlpha = into;
          ctx.fillStyle = "rgba(12,12,12,0.85)";
          ctx.strokeStyle = "rgba(255,255,255,0.14)";
          ctx.lineWidth = 1;
          roundRect(ctx, x, y - 13, tw + 20, 26, 6);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "#fff";
          ctx.textBaseline = "middle";
          ctx.fillText(label, x + 10, y + 0.5);
          ctx.globalAlpha = 1;
        }
      }

      if (visible && (!reduce || drag.active || Math.abs(drag.lon) > 0.05)) {
        raf = requestAnimationFrame(frame);
      }
    };
    const kick = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(frame);
    };
    if (reduce) canvas.addEventListener("pointermove", kick);

    // Only animate while the globe is on screen and the tab is visible,
    // so it costs nothing (and saves phone batteries) once scrolled past.
    let visible = false;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && document.visibilityState === "visible";
      if (visible) kick();
      else cancelAnimationFrame(raf);
    });
    io.observe(canvas);
    const onVisibility = () => {
      const onScreen = canvas.getBoundingClientRect();
      visible =
        document.visibilityState === "visible" &&
        onScreen.bottom > 0 &&
        onScreen.top < window.innerHeight;
      if (visible) kick();
      else cancelAnimationFrame(raf);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointermove", kick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={`Globe showing the network across Africa: ${mapCountries.map((c) => c.name).join(", ")}`}
      className={cn("block size-full touch-pan-y", className)}
    />
  );
}
