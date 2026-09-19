"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function animateCounters(root: ParentNode) {
  root.querySelectorAll<HTMLElement>(".countup").forEach((el) => {
    const to = parseFloat(el.getAttribute("data-to") || "0");
    const dec = parseInt(el.getAttribute("data-dec") || "0", 10);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.textContent = to.toFixed(dec);
      return;
    }
    const dur = 1000;
    let start: number | null = null;
    function step(ts: number) {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (to * eased).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = to.toFixed(dec);
    }
    requestAnimationFrame(step);
  });
}

/**
 * Mounts the shared scroll-reveal system for `.reveal` (focus-pull) and
 * `.maskline` (load-time wipe) elements anywhere on the page, plus the
 * `.countup` number animation. Renders nothing.
 *
 * Lives once in the root layout, not per-page — but Next's App Router keeps
 * the layout mounted across client-side navigations, so this re-scans the
 * DOM on every pathname change (a fresh IntersectionObserver each time)
 * instead of relying on a remount. Without that, a page reached via a Link
 * click (not a full reload) would never get its `.reveal` elements observed
 * and they'd sit at opacity:0 forever.
 */
export function RevealInit() {
  const pathname = usePathname();

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      animateCounters(document);
      return;
    }
    document.documentElement.classList.add("reveal-enabled");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            if (entry.target.querySelector(".countup")) animateCounters(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, threshold: 0.15 }
    );
    // Wait a tick so the new page's DOM (post-navigation) is actually in place.
    const raf = requestAnimationFrame(() => {
      document.querySelectorAll(".reveal, .maskline").forEach((el) => io.observe(el));
    });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
