type IconName =
  | "arrow-up-right"
  | "arrow-down-left"
  | "arrow-down"
  | "arrow-up"
  | "reset"
  | "swap";

const paths: Record<IconName, string> = {
  "arrow-up-right": "M7 17 17 7M7 7h10v10",
  "arrow-down-left": "M17 7 7 17M7 7v10h10",
  "arrow-down": "M12 4v16M5 13l7 7 7-7",
  "arrow-up": "M12 20V4M5 11l7-7 7 7",
  reset: "M3 10a9 9 0 1 1 2.6 8.4M3 4v6h6",
  swap: "M4 8h16m-5-5 5 5-5 5M20 16H4m5-5-5 5 5 5",
};

export default function Icon({ name = "arrow-up-right" }: { name?: IconName }) {
  return (
    <svg
      className="ui-icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  );
}
