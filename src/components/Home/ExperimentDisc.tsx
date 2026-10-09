import { useId } from "react";
const palettes = [
  ["#a09c48", "#292e1e", "#dcda9e"],
  ["#486c6d", "#152a32", "#bbd9cd"],
  ["#d6512b", "#70201d", "#ffc98c"],
  ["#7f83ac", "#242239", "#e0cce8"],
];
const names = ["Beyond the", "Every render", "The art of", "Small pieces,"];
const subtitles = [
  "main thread.",
  "tells a story.",
  "doing less.",
  "faster pages.",
];
export default function ExperimentDisc({ index }: { index: number }) {
  const id = useId().replace(/:/g, "");
  const [base, dark, light] = palettes[index % palettes.length];
  return (
    <svg viewBox="0 0 600 600" className="disc-art" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-paint`} cx="30%" cy="20%" r="90%">
          <stop stopColor={base} />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
        <linearGradient id={`${id}-metal`} x2="1" y2="1">
          <stop stopColor="#e5e5df" />
          <stop offset=".3" stopColor="#8c9094" />
          <stop offset=".55" stopColor="#dddeda" />
          <stop offset="1" stopColor="#5d636b" />
        </linearGradient>
        <filter id={`${id}-grain`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope=".2" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" mode="soft-light" />
        </filter>
        <mask id={`${id}-hole`}>
          <circle cx="300" cy="300" r="298" fill="white" />
          <circle cx="300" cy="300" r="40" fill="black" />
        </mask>
        <clipPath id={`${id}-clip`}>
          <circle cx="300" cy="300" r="291" />
        </clipPath>
        <path
          id={`${id}-label`}
          d="M 52,300 A248,248 0 1,1 548,300 A248,248 0 1,1 52,300"
        />
      </defs>
      <g mask={`url(#${id}-hole)`}>
        <circle cx="300" cy="300" r="298" fill={`url(#${id}-metal)`} />
        <g clipPath={`url(#${id}-clip)`} filter={`url(#${id}-grain)`}>
          <circle cx="300" cy="300" r="292" fill={`url(#${id}-paint)`} />
          {index === 0 ? (
            <g fill="none" stroke={light}>
              {Array.from({ length: 16 }, (_, i) => (
                <path
                  key={i}
                  d={`M ${-80 + i * 18} 610 C ${480 - i * 12} ${170 + i * 13}, ${70 + i * 19} ${510 - i * 7}, 660 ${330 + i * 18}`}
                  strokeWidth={i % 3 === 0 ? 5 : 1}
                  opacity=".55"
                />
              ))}
            </g>
          ) : index === 1 ? (
            <g fill={light} opacity=".55">
              {Array.from({ length: 36 }, (_, i) => (
                <rect
                  key={i}
                  x={65 + (i % 6) * 80}
                  y={260 + Math.floor(i / 6) * 55}
                  width="60"
                  height="35"
                  rx={i % 3 === 0 ? 17 : 0}
                  opacity={0.2 + (i % 5) * 0.17}
                />
              ))}
            </g>
          ) : index === 2 ? (
            <g fill="none" stroke={light} opacity=".6">
              {Array.from({ length: 9 }, (_, i) => (
                <circle
                  key={i}
                  cx="340"
                  cy="460"
                  r={35 + i * 21}
                  strokeWidth={i % 2 ? 2 : 9}
                />
              ))}
            </g>
          ) : (
            <g fill={light} opacity=".7">
              {Array.from({ length: 13 }, (_, i) => (
                <rect
                  key={i}
                  x={60 + i * 35}
                  y={340 + (i % 3) * 25}
                  width="25"
                  height={190 - (i % 4) * 30}
                  transform={`rotate(-15 300 400)`}
                />
              ))}
            </g>
          )}
          <text
            x="300"
            y="132"
            textAnchor="middle"
            fill={light}
            fontFamily="Georgia, serif"
            fontSize="55"
            letterSpacing="-3"
          >
            {names[index]}
          </text>
          <text
            x="300"
            y="184"
            textAnchor="middle"
            fill={light}
            fontFamily="Georgia, serif"
            fontSize="55"
            letterSpacing="-3"
          >
            {subtitles[index]}
          </text>
          <text
            x="300"
            y="224"
            textAnchor="middle"
            fill={light}
            fontFamily="Georgia, serif"
            fontWeight="bold"
            fontSize="26"
          >
            PG / {String(index + 1).padStart(2, "0")}
          </text>
          <text
            fill={light}
            fontFamily="Arial, sans-serif"
            fontSize="9"
            letterSpacing="4"
          >
            <textPath href={`#${id}-label`} startOffset="4%">
              FRONTEND EXPERIMENTS · JEONGWON CHO · VOL.{" "}
              {String(index + 1).padStart(2, "0")} · 2026 · CODE. PLAY.
              DISCOVER. REPEAT.
            </textPath>
          </text>
        </g>
        <circle cx="300" cy="300" r="66" fill={`url(#${id}-metal)`} />
        <circle cx="300" cy="300" r="57" fill="#8f969e" />
        <circle cx="300" cy="300" r="49" fill="#c6c9cb" />
        <circle cx="300" cy="300" r="42" fill="#efefe9" />
      </g>
    </svg>
  );
}
