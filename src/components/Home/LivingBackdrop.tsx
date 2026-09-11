import { useEffect, useRef } from "react";

// One viewport-sized scene spans the chapters; the cursor glow is never clipped by a card.
export default function LivingBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.querySelector<HTMLElement>(".playground");
    const sections = [
      ...document.querySelectorAll<HTMLElement>(
        ".hero, .featured-section, .archive, .about-section",
      ),
    ];
    const points = Array.from({ length: 360 }, (_, i) => ({
      x: 0,
      y: 0,
      seed: i / 360,
    }));
    let width = innerWidth,
      height = innerHeight,
      frame = 0,
      last = 0,
      phase = 0,
      chapter = 0;
    const pointer = { x: width / 2, y: height / 2, active: false };
    const updateChapter = () => {
      const center = innerHeight * 0.5;
      chapter = 0;
      sections.forEach((section, index) => {
        if (section.getBoundingClientRect().top <= center) chapter = index;
      });
      canvas.dataset.chapter = String(chapter);
      if (reduced.matches) draw(0);
    };
    const target = (i: number) => {
      const u = i / 359;
      if (chapter === 0)
        return { x: ((i * 0.618) % 1) * width, y: ((i * 0.381) % 1) * height };
      if (chapter === 1)
        return {
          x: ((u * 3 + phase * 0.02) % 1) * width,
          y: height * (0.28 + (i % 6) * 0.1) + Math.sin(u * 15 + phase) * 45,
        };
      if (chapter === 2)
        return {
          x: width * (0.03 + ((i % 30) / 29) * 0.94),
          y: height * (0.08 + (Math.floor(i / 30) / 11) * 0.84),
        };
      return {
        x: u * width,
        y:
          height * 0.65 +
          Math.sin(u * 8 + phase + (i % 5) * 0.3) * height * 0.21,
      };
    };
    const draw = (dt: number) => {
      phase += dt * 0.00035;
      ctx.clearRect(0, 0, width, height);
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${pointer.x - 230}px,${pointer.y - 230}px,0)`;
        glowRef.current.style.opacity =
          pointer.active && !reduced.matches ? "1" : "0";
      }
      const blend = reduced.matches || dt === 0 ? 1 : 1 - Math.exp(-dt / 260);
      for (const [i, p] of points.entries()) {
        const destination = target(i);
        const dx = destination.x - pointer.x,
          dy = destination.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        const push =
          pointer.active && !reduced.matches
            ? Math.max(0, 1 - distance / 200) * 45
            : 0;
        p.x += (destination.x + (dx / (distance || 1)) * push - p.x) * blend;
        p.y += (destination.y + (dy / (distance || 1)) * push - p.y) * blend;
        ctx.fillStyle = `rgba(201,247,106,${chapter === 0 ? 0.09 : 0.18 + push / 140})`;
        ctx.fillRect(
          p.x,
          p.y,
          chapter === 2 ? 2 : 1.5,
          chapter === 2 ? 2 : 1.5,
        );
        if (chapter !== 0 && i > 0 && i % 30 !== 0) {
          const prev = points[i - 1];
          if (Math.hypot(prev.x - p.x, prev.y - p.y) < width * 0.08) {
            ctx.strokeStyle = `rgba(164,201,115,${chapter === 3 ? 0.13 : 0.06})`;
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
        }
      }
    };
    const tick = (now: number) => {
      frame = 0;
      if (document.hidden || reduced.matches) return;
      draw(Math.min(40, last ? now - last : 16));
      last = now;
      frame = requestAnimationFrame(tick);
    };
    const resume = () => {
      cancelAnimationFrame(frame);
      last = 0;
      draw(0);
      if (!document.hidden && !reduced.matches)
        frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      width = innerWidth;
      height = innerHeight;
      const dpr = Math.min(devicePixelRatio, 1.5);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      updateChapter();
      draw(0);
    };
    const move = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = event.pointerType !== "touch";
    };
    const leave = () => {
      pointer.active = false;
    };
    const observer = new ResizeObserver(updateChapter);
    if (root) observer.observe(root);
    root?.addEventListener("pointermove", move);
    root?.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", updateChapter, { passive: true });
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", resume);
    reduced.addEventListener("change", resume);
    resize();
    resume();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      root?.removeEventListener("pointermove", move);
      root?.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", updateChapter);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", resume);
      reduced.removeEventListener("change", resume);
    };
  }, []);
  return (
    <>
      <canvas className="living-backdrop" ref={canvasRef} aria-hidden="true" />
      <div ref={glowRef} className="cursor-aura" aria-hidden="true" />
    </>
  );
}
