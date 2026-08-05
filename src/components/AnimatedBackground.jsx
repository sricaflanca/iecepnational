import React, { useEffect, useRef } from "react";

/**
 * Full-viewport, fixed dark background with a circuit grid, ambient depth
 * glows, and a cyan radial light that follows the mouse. Sits behind all
 * page content (-z-10). Shared across every page via Layout.
 */
export default function AnimatedBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = null;
    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${e.clientX}px`);
        el.style.setProperty("--my", `${e.clientY}px`);
        raf = null;
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden bg-background"
      style={{ "--mx": "50vw", "--my": "50vh" }}
    >
      {/* Circuit grid */}
      <div className="absolute inset-0 circuit-grid" />

      {/* Ambient depth glows */}
      <div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(var(--navy)), transparent 70%)" }}
      />
      <div
        className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.12] blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(var(--azure)), transparent 70%)" }}
      />
      <div
        className="absolute -bottom-40 left-1/4 w-[700px] h-[700px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(var(--navy)), transparent 70%)" }}
      />

      {/* Mouse-following cyan glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(600px circle at var(--mx) var(--my), hsl(var(--azure) / 0.07), transparent 65%)",
        }}
      />

      {/* Vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, hsl(var(--background) / 0.7) 100%)",
        }}
      />
    </div>
  );
}