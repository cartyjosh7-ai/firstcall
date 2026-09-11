"use client";

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; r: number; speed: number; sway: number; phase: number; alpha: number };

/**
 * Wraps hero content with the blueprint texture, an ambient gold dust-particle
 * canvas, and a subtle cursor-parallax on that particle layer. Canvas-based
 * (not video) so it's free, crisp, and exactly the site's own gold.
 */
export function HeroPanel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || reduced) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const rect = wrap!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function seed() {
      const count = Math.max(22, Math.min(50, Math.round((w * h) / 11000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.5 + Math.random() * 1.2,
        speed: 5 + Math.random() * 9,
        sway: 8 + Math.random() * 14,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.12 + Math.random() * 0.3,
      }));
    }
    resize();
    seed();
    const onResize = () => {
      resize();
      seed();
    };
    window.addEventListener("resize", onResize);

    let lastT = performance.now();
    let raf = 0;
    function draw(now: number) {
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;
      ctx!.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.y -= p.speed * dt;
        p.phase += dt * 0.6;
        if (p.y < -4) {
          p.y = h + 4;
          p.x = Math.random() * w;
        }
        const x = p.x + Math.sin(p.phase) * (p.sway * 0.06);
        ctx!.beginPath();
        ctx!.arc(x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(201,162,39,${p.alpha})`;
        ctx!.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);

    const panel = panelRef.current;
    const hoverCapable = window.matchMedia("(hover: hover)").matches;
    const onMove = (e: MouseEvent) => {
      if (!panel) return;
      const r = panel.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      wrap!.style.transform = `translate(${px * -10}px, ${py * -10}px)`;
    };
    const onLeave = () => {
      wrap!.style.transform = "";
    };
    if (panel && hoverCapable) {
      panel.addEventListener("mousemove", onMove);
      panel.addEventListener("mouseleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      if (panel && hoverCapable) {
        panel.removeEventListener("mousemove", onMove);
        panel.removeEventListener("mouseleave", onLeave);
      }
    };
  }, []);

  return (
    <div ref={panelRef} className={`heropanel ${className}`}>
      <div className="blueprint" />
      <div ref={wrapRef} className="particlewrap" aria-hidden="true">
        <canvas ref={canvasRef} className="particlecanvas" />
      </div>
      <div className="heroinner">{children}</div>
    </div>
  );
}
