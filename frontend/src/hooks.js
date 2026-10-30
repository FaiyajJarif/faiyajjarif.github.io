import { useEffect, useRef, useState } from 'react';
import { api, hasApi } from './api.js';
import { fallbackProjects, fallbackSkills } from './data/fallback.js';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Adds `is-visible` to elements with [data-reveal] as they scroll into view. */
export function useReveal(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]:not(.is-visible)');
    if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Scroll-linked motion. Every [data-scene] gets:
 *   --enter: 0 -> 1 as it slides up into view
 *   --leave: 0 -> 1 as it scrolls away off the top
 * and the page gets --sy (scroll offset, for parallax) and --progress (0..1, for the top bar).
 * The CSS turns these into movement, so each section glides in and out as you scroll or swipe.
 */
export function useScrollFx(deps = []) {
  useEffect(() => {
    const root = document.documentElement;
    const scenes = [...document.querySelectorAll('[data-scene]')];
    if (prefersReducedMotion()) {
      scenes.forEach((el) => {
        el.style.setProperty('--enter', '1');
        el.style.setProperty('--leave', '0');
      });
      return;
    }
    const clamp = (v) => Math.max(0, Math.min(1, v));
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const max = root.scrollHeight - vh;
      root.style.setProperty('--sy', String(window.scrollY));
      root.style.setProperty('--progress', String(max > 0 ? window.scrollY / max : 0));
      scenes.forEach((el) => {
        const r = el.getBoundingClientRect();
        const enter = clamp((vh - r.top) / (vh * 0.55));
        const leave = clamp((vh * 0.25 - r.bottom) / (vh * 0.5));
        el.style.setProperty('--enter', enter.toFixed(3));
        el.style.setProperty('--leave', leave.toFixed(3));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Mouse-driven depth and light:
 *  - sets --px / --py (-0.5..0.5) on <html>, which layered elements use for parallax
 *  - sets --lx / --ly on each glass pane so a soft reflection follows the cursor across it
 */
export function usePointerLight(deps = []) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = document.documentElement;
    const panes = [...document.querySelectorAll('.glass, .section, .card')];
    let raf = 0;
    let ev = null;
    const apply = () => {
      raf = 0;
      if (!ev) return;
      root.style.setProperty('--px', (ev.clientX / window.innerWidth - 0.5).toFixed(3));
      root.style.setProperty('--py', (ev.clientY / window.innerHeight - 0.5).toFixed(3));
      for (const el of panes) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > window.innerHeight + 200) continue;
        el.style.setProperty('--lx', `${ev.clientX - r.left}px`);
        el.style.setProperty('--ly', `${ev.clientY - r.top}px`);
      }
    };
    const onMove = (e) => {
      if (e.pointerType === 'touch') return;
      ev = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Counts from 0 to `target` once the element is on screen. */
export function useCountUp(target, duration = 1400) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (target == null) return;
    const el = ref.current;
    const run = () => {
      if (prefersReducedMotion()) return setValue(target);
      const from = started.current ? value : 0;
      started.current = true;
      const t0 = performance.now();
      let raf;
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(from + (target - from) * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    };
    if (started.current || !el || !('IntersectionObserver' in window)) return run();
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        io.disconnect();
        run();
      }
    });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return [ref, value];
}

/**
 * Loads projects, skills and stats from the API, showing built-in data immediately.
 * status: 'static' (no API configured) | 'waking' | 'live' | 'offline'
 */
export function usePortfolio() {
  const fallbackStats = {
    projects: fallbackProjects.length,
    awards: fallbackProjects.reduce((s, p) => s + (p.awardCount || 0), 0),
    skills: fallbackSkills.length,
    visitors: null,
  };
  const [state, setState] = useState({
    projects: fallbackProjects,
    skills: fallbackSkills,
    stats: fallbackStats,
    status: hasApi ? 'waking' : 'static',
  });

  const load = async () => {
    if (!hasApi) return;
    try {
      let visitors = null;
      let alreadyCounted = false;
      try {
        alreadyCounted = sessionStorage.getItem('fj-visit') === '1';
      } catch {
        /* storage unavailable */
      }
      if (!alreadyCounted) {
        const v = await api.recordVisit();
        visitors = v.visitors;
        try {
          sessionStorage.setItem('fj-visit', '1');
        } catch {
          /* storage unavailable */
        }
      }
      const [projects, skills, stats] = await Promise.all([api.projects(), api.skills(), api.stats()]);
      setState({
        projects: projects.length ? projects : fallbackProjects,
        skills: skills.length ? skills : fallbackSkills,
        stats: { ...stats, visitors: visitors ?? stats.visitors },
        status: 'live',
      });
    } catch {
      setState((s) => ({ ...s, status: 'offline' }));
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...state, reload: load };
}
