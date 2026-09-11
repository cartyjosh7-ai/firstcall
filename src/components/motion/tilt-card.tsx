"use client";

import { useEffect, useRef } from "react";

/**
 * A card that tilts gently toward the cursor (subtle 3D) on hover-capable
 * desktop pointers only. Sits on its own ambient gold glow.
 */
export function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hoverCapable = window.matchMedia("(hover: hover)").matches;
    const zone = zoneRef.current;
    const card = cardRef.current;
    if (!zone || !card || reduced || !hoverCapable) return;

    const onMove = (e: MouseEvent) => {
      const r = zone.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${px * 7}deg) rotateX(${py * -7}deg)`;
    };
    const onLeave = () => {
      card.style.transform = "";
    };
    zone.addEventListener("mousemove", onMove);
    zone.addEventListener("mouseleave", onLeave);
    return () => {
      zone.removeEventListener("mousemove", onMove);
      zone.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={zoneRef} className="tiltzone">
      <div className="glow" />
      <div ref={cardRef} className={`mapcard ${className}`}>
        {children}
      </div>
    </div>
  );
}
