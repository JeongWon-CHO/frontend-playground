import { useEffect, useRef, useState } from "react";

const chapters = [
  { selector: ".hero", label: "Intro" },
  { selector: ".featured-section", label: "Spotlight" },
  { selector: ".archive", label: "Experiments" },
  { selector: ".about-section", label: "About" },
];

export default function SectionNavigation() {
  const [active, setActive] = useState(0);
  const navigate = useRef<(index: number) => void>(() => {});

  useEffect(() => {
    const desktop = matchMedia("(min-width: 901px) and (pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let animation = 0;
    let scrollFrame = 0;
    let lastWheel = 0;
    let accumulated = 0;
    let consumed = false;
    const sections = chapters.map((chapter) =>
      document.querySelector<HTMLElement>(chapter.selector),
    );
    // Measure on demand: filtering, load more and viewport changes can move sections.
    const positions = () =>
      sections.map((section, index) =>
        index === 0
          ? 0
          : section
            ? section.getBoundingClientRect().top + scrollY
            : null,
      );
    const stop = () => {
      cancelAnimationFrame(animation);
      animation = 0;
    };
    const move = (target: number) => {
      stop();
      const start = scrollY;
      const end = Math.max(
        0,
        Math.min(target, document.documentElement.scrollHeight - innerHeight),
      );
      if (reduced.matches) {
        window.scrollTo({ top: end, behavior: "instant" });
        return;
      }
      const started = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - started) / 760);
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        window.scrollTo({
          top: start + (end - start) * ease,
          behavior: "instant",
        });
        animation = t < 1 ? requestAnimationFrame(step) : 0;
      };
      animation = requestAnimationFrame(step);
    };
    navigate.current = (index) => {
      const target = positions()[index];
      if (target !== null && target !== undefined) move(target);
    };
    const updateActive = () => {
      scrollFrame = 0;
      const tops = positions();
      let current = 0;
      tops.forEach((top, index) => {
        if (top !== null && top <= scrollY + innerHeight * 0.35)
          current = index;
      });
      setActive(current);
    };
    const onScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateActive);
    };
    const ownsWheel = (target: EventTarget | null, direction: number) => {
      if (!(target instanceof Element)) return false;
      if (
        target.closest(
          'input, textarea, select, [contenteditable="true"], [role="dialog"]',
        )
      )
        return true;
      for (
        let node: Element | null = target;
        node && node !== document.body;
        node = node.parentElement
      ) {
        if (
          /(auto|scroll)/.test(getComputedStyle(node).overflowY) &&
          node.scrollHeight > node.clientHeight + 1
        ) {
          if (
            direction > 0
              ? node.scrollTop + node.clientHeight < node.scrollHeight - 1
              : node.scrollTop > 1
          )
            return true;
        }
      }
      return false;
    };
    const onWheel = (event: WheelEvent) => {
      if (
        !desktop.matches ||
        event.ctrlKey ||
        event.metaKey ||
        !event.cancelable ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ||
        event.deltaY === 0
      )
        return;
      const direction = Math.sign(event.deltaY);
      if (ownsWheel(event.target, direction)) return;
      const now = performance.now();
      if (now - lastWheel > 180 && !animation) {
        consumed = false;
        accumulated = 0;
      }
      lastWheel = now;
      // Keep trackpad inertia in this chapter instead of triggering a second jump.
      if (animation || consumed) {
        event.preventDefault();
        return;
      }
      const tops = positions().flatMap((top, index) =>
        top === null ? [] : [{ top, index }],
      );
      let current = 0;
      tops.forEach((section, index) => {
        if (section.top <= scrollY + 3) current = index;
      });
      const start = tops[current].top;
      const next = tops[current + 1]?.top;
      const delta =
        event.deltaY *
        (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      const bottom =
        next === undefined
          ? document.documentElement.scrollHeight - innerHeight
          : Math.max(start, next - innerHeight);
      // Tall chapters remain readable: scroll their content before changing chapter.
      if (direction > 0 && scrollY < bottom - 3) {
        if (scrollY + delta >= bottom) {
          event.preventDefault();
          consumed = true;
          window.scrollTo({ top: bottom, behavior: "instant" });
        }
        return;
      }
      if (direction < 0 && scrollY > start + 3) {
        if (scrollY + delta <= start) {
          event.preventDefault();
          consumed = true;
          window.scrollTo({ top: start, behavior: "instant" });
        }
        return;
      }
      let target: number | undefined = next;
      if (direction < 0) {
        const previous = tops[current - 1]?.top;
        target =
          previous === undefined
            ? undefined
            : Math.max(previous, start - innerHeight);
      }
      if (target === undefined) return;
      event.preventDefault();
      accumulated =
        Math.sign(accumulated) === direction ? accumulated + delta : delta;
      if (Math.abs(accumulated) < 18) return;
      consumed = true;
      move(target);
    };
    const onKey = (event: KeyboardEvent) => {
      if (
        [
          "Escape",
          "Tab",
          "ArrowDown",
          "ArrowUp",
          "PageDown",
          "PageUp",
          "Home",
          "End",
          " ",
        ].includes(event.key)
      )
        stop();
    };
    const reset = () => {
      stop();
      consumed = false;
      accumulated = 0;
      onScroll();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", stop);
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("resize", reset);
    desktop.addEventListener("change", reset);
    reduced.addEventListener("change", reset);
    onScroll();
    return () => {
      stop();
      cancelAnimationFrame(scrollFrame);
      navigate.current = () => {};
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("resize", reset);
      desktop.removeEventListener("change", reset);
      reduced.removeEventListener("change", reset);
    };
  }, []);

  return (
    <nav className="section-navigation" aria-label="섹션 바로가기">
      {chapters.map((chapter, index) => (
        <button
          key={chapter.label}
          aria-label={`${index + 1}. ${chapter.label} 섹션으로 이동`}
          aria-current={active === index ? "location" : undefined}
          onClick={() => navigate.current(index)}
        >
          <span className="chapter-label mono">{chapter.label}</span>
          <span className="chapter-mark" />
        </button>
      ))}
      <span className="chapter-count mono">0{active + 1} / 04</span>
    </nav>
  );
}
