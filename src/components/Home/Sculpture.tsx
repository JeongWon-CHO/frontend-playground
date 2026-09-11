import { useEffect, useRef, useState } from "react";

const forms = ["Knot", "Orbit", "Wave"] as const;
type Point = { x: number; y: number; z: number };
type Particle = Point & {
  targets: Point[];
  sx: number;
  sy: number;
  depth: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  glow: number;
};

export default function Sculpture() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [form, setForm] = useState(0);
  const [dragging, setDragging] = useState(false);
  const model = useRef({
    form: 0,
    x: 0,
    y: 0,
    inside: false,
    down: false,
    moved: false,
    lastX: 0,
    lastY: 0,
    rotation: 0,
    tilt: -0.55,
    velocity: 0,
    pulse: -1,
    pulseX: 0,
    pulseY: 0,
    redraw: () => {},
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const state = model.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const particles: Particle[] = Array.from({ length: 3600 }, (_, i) => {
      const u = (Math.floor(i / 30) / 120) * Math.PI * 2;
      const v = ((i % 30) / 30) * Math.PI * 2;
      const r = 1.05 + 0.24 * Math.cos(3 * u);
      const knot = {
        x: (r + 0.39 * Math.cos(v)) * Math.cos(u),
        y: (r + 0.39 * Math.cos(v)) * Math.sin(u),
        z: 0.36 * Math.sin(3 * u) + 0.39 * Math.sin(v),
      };
      const latitude = Math.acos(1 - (2 * (i + 0.5)) / 3600);
      const longitude = i * Math.PI * (3 - Math.sqrt(5));
      return {
        ...knot,
        targets: [
          knot,
          {
            x: 1.5 * Math.sin(latitude) * Math.cos(longitude),
            y: 1.5 * Math.sin(latitude) * Math.sin(longitude),
            z: 1.5 * Math.cos(latitude),
          },
          {
            x: (Math.floor(i / 60) / 59 - 0.5) * 3.2,
            y: ((i % 60) / 59 - 0.5) * 2.7,
            z:
              0.4 *
              Math.sin(((i % 60) / 59) * 10 + (Math.floor(i / 60) / 59) * 5),
          },
        ],
        sx: 0,
        sy: 0,
        depth: 0,
        ox: 0,
        oy: 0,
        vx: 0,
        vy: 0,
        glow: 0,
      };
    });
    const sorted = [...particles];
    let width = 0,
      height = 0,
      frame = 0,
      visible = false,
      previous = 0,
      time = 0;
    const render = (delta = 1) => {
      const still = reduced.matches;
      const step = still ? 1 : delta;
      if (!still) {
        time += 0.012 * step;
        if (!state.down) {
          state.rotation += (0.003 + state.velocity) * step;
          state.velocity *= Math.pow(0.94, step);
        }
        if (state.pulse >= 0) {
          state.pulse += 9 * step;
          if (state.pulse > Math.max(width, height) * 1.3) state.pulse = -1;
        }
      }
      ctx.clearRect(0, 0, width, height);
      const size = Math.min(width, height) * 0.24;
      const cos = Math.cos(state.rotation),
        sin = Math.sin(state.rotation);
      const ct = Math.cos(state.tilt),
        st = Math.sin(state.tilt);
      for (const [i, p] of particles.entries()) {
        const target = p.targets[state.form];
        const morph = still ? 1 : 1 - Math.pow(0.91, step);
        p.x += (target.x - p.x) * morph;
        p.y += (target.y - p.y) * morph;
        p.z +=
          (target.z +
            (!still && state.form === 2 ? Math.sin(time + p.x * 3) * 0.3 : 0) -
            p.z) *
          morph;
        const rx = p.x * cos + p.z * sin;
        const rz = -p.x * sin + p.z * cos;
        const ry = p.y * ct - rz * st;
        p.depth = p.y * st + rz * ct;
        const perspective = 4.8 / (4.8 - p.depth);
        const x = width / 2 + rx * size * perspective;
        const y = height / 2 + ry * size * perspective;
        const dx = x - state.x,
          dy = y - state.y,
          distance = Math.hypot(dx, dy);
        const influence =
          !still && state.inside ? Math.max(0, 1 - distance / 130) : 0;
        const rippleDistance = Math.hypot(x - state.pulseX, y - state.pulseY);
        const ripple =
          !still && state.pulse >= 0
            ? Math.max(0, 1 - Math.abs(rippleDistance - state.pulse) / 65)
            : 0;
        const force = influence * 70 + ripple * 44;
        const direction = Math.atan2(dy, dx);
        p.vx += (Math.cos(direction) * force - p.ox) * 0.065 * step;
        p.vy += (Math.sin(direction) * force - p.oy) * 0.065 * step;
        p.vx *= Math.pow(0.77, step);
        p.vy *= Math.pow(0.77, step);
        p.ox = still ? 0 : p.ox + p.vx * step;
        p.oy = still ? 0 : p.oy + p.vy * step;
        p.sx = x + p.ox;
        p.sy = y + p.oy;
        p.glow = Math.max(influence, ripple, i % 120 < 7 ? 0.6 : 0);
      }
      sorted.sort((a, b) => a.depth - b.depth);
      if (state.inside && !still) {
        const gradient = ctx.createRadialGradient(
          state.x,
          state.y,
          0,
          state.x,
          state.y,
          145,
        );
        gradient.addColorStop(0, "#c9f76a13");
        gradient.addColorStop(1, "#c9f76a00");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = "#c9f76a60";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(state.x, state.y, state.down ? 17 : 8, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (state.pulse >= 0 && !still) {
        ctx.strokeStyle = `rgba(201,247,106,${Math.max(0, 0.5 - state.pulse / width)})`;
        ctx.beginPath();
        ctx.arc(state.pulseX, state.pulseY, state.pulse, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (const p of sorted) {
        const light = Math.round(105 + (p.depth + 1.8) * 34);
        ctx.fillStyle =
          p.glow > 0.1
            ? `rgb(${Math.round(light + (201 - light) * p.glow)},${Math.round(light + (247 - light) * p.glow)},${Math.round(light + (106 - light) * p.glow)})`
            : `rgb(${light},${light + 3},${light - 2})`;
        const s =
          Math.max(1, (width / 520) * (1.15 + (p.depth + 1.5) * 0.25)) + p.glow;
        ctx.fillRect(p.sx, p.sy, s, s);
      }
    };
    const tick = (now: number) => {
      frame = 0;
      if (!visible || document.hidden || reduced.matches) return;
      render(Math.min(2, previous ? (now - previous) / 16.67 : 1));
      previous = now;
      frame = requestAnimationFrame(tick);
    };
    const resume = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      render();
      if (visible && !document.hidden && !reduced.matches)
        frame = requestAnimationFrame(tick);
    };
    state.redraw = () => {
      if (reduced.matches) render();
    };
    const resize = new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render();
    });
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      resume();
    });
    resize.observe(canvas);
    observer.observe(canvas);
    document.addEventListener("visibilitychange", resume);
    reduced.addEventListener("change", resume);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", resume);
      reduced.removeEventListener("change", resume);
      state.redraw = () => {};
    };
  }, []);

  const pulse = () => {
    const state = model.current;
    const rect = canvasRef.current?.getBoundingClientRect();
    state.pulse = 0;
    state.pulseX = state.inside ? state.x : (rect?.width ?? 0) / 2;
    state.pulseY = state.inside ? state.y : (rect?.height ?? 0) / 2;
    state.redraw();
  };
  return (
    <div className="sculpture-stage">
      <button
        className={`sculpture ${dragging ? "is-dragging" : ""}`}
        aria-label="입자 조형물. 드래그 또는 방향키로 회전, 클릭 또는 Enter로 파동 보내기"
        onPointerDown={(event) => {
          const state = model.current;
          state.down = true;
          state.moved = false;
          state.lastX = event.clientX;
          state.lastY = event.clientY;
          state.velocity = 0;
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
        }}
        onPointerMove={(event) => {
          const state = model.current;
          const r = event.currentTarget.getBoundingClientRect();
          state.x = event.clientX - r.left;
          state.y = event.clientY - r.top;
          state.inside = true;
          if (state.down) {
            const dx = event.clientX - state.lastX,
              dy = event.clientY - state.lastY;
            if (Math.abs(dx) + Math.abs(dy) > 2) state.moved = true;
            state.rotation += dx * 0.009;
            state.tilt = Math.max(-1.5, Math.min(1.5, state.tilt + dy * 0.006));
            state.velocity = dx * 0.003;
            state.lastX = event.clientX;
            state.lastY = event.clientY;
            state.redraw();
          }
        }}
        onPointerUp={(event) => {
          model.current.down = false;
          event.currentTarget.releasePointerCapture(event.pointerId);
          setDragging(false);
        }}
        onPointerCancel={() => {
          model.current.down = false;
          model.current.inside = false;
          setDragging(false);
        }}
        onPointerLeave={() => {
          model.current.inside = false;
        }}
        onClick={(event) => {
          if (!model.current.moved || event.detail === 0) pulse();
        }}
        onKeyDown={(event) => {
          if (
            ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
              event.key,
            )
          ) {
            event.preventDefault();
            model.current.rotation +=
              event.key === "ArrowLeft"
                ? -0.25
                : event.key === "ArrowRight"
                  ? 0.25
                  : 0;
            model.current.tilt +=
              event.key === "ArrowUp"
                ? -0.15
                : event.key === "ArrowDown"
                  ? 0.15
                  : 0;
            model.current.redraw();
          }
        }}
      >
        <span className="orbit orbit-one" />
        <span className="orbit orbit-two" />
        <canvas ref={canvasRef} aria-hidden="true" />
        <span className="sculpture-coordinate mono">
          PLAY OBJECT / 00{form + 1}
        </span>
        <span className="sculpture-hint mono">
          <span />{" "}
          {dragging
            ? "YOU’RE IN CONTROL."
            : "DRAG TO ROTATE · CLICK TO SEND A WAVE"}
        </span>
      </button>
      <div className="sculpture-controls">
        <span className="mono">CHANGE THE SHAPE</span>
        <div role="group" aria-label="조형물 형태">
          {forms.map((name, index) => (
            <button
              key={name}
              aria-pressed={form === index}
              onClick={() => {
                setForm(index);
                model.current.form = index;
                model.current.redraw();
              }}
            >
              {name}
              <span>0{index + 1}</span>
            </button>
          ))}
        </div>
        <button
          className="burst-button"
          onClick={pulse}
          aria-label="입자 파동 보내기"
        >
          ↗ <span>Send a wave</span>
        </button>
      </div>
    </div>
  );
}
