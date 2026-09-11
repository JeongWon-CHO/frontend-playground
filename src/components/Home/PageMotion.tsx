import { useEffect, useRef } from "react";

export default function PageMotion() {
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const hero = document.querySelector<HTMLElement>(".hero-copy");
    const sections = document.querySelectorAll<HTMLElement>(
      ".featured-section, .archive, .about-section",
    );
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.current?.style.setProperty(
        "transform",
        `scaleX(${max > 0 ? scrollY / max : 0})`,
      );
      hero?.style.setProperty(
        "--scroll-shift",
        reduced.matches ? "0px" : `${Math.min(scrollY * 0.12, 65)}px`,
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add("has-entered");
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.08 },
    );
    sections.forEach((section) => observer.observe(section));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    reduced.addEventListener("change", update);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduced.removeEventListener("change", update);
      hero?.style.removeProperty("--scroll-shift");
    };
  }, []);
  return <div className="reading-progress" aria-hidden="true" ref={progress} />;
}
