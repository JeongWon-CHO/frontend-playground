import {
  ArrowDown,
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUp,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";

const icons = {
  "arrow-up-right": ArrowUpRight,
  "arrow-down-left": ArrowDownLeft,
  "arrow-down": ArrowDown,
  "arrow-up": ArrowUp,
  reset: RotateCcw,
  swap: ArrowLeftRight,
};

export default function Icon({
  name = "arrow-up-right",
}: {
  name?: keyof typeof icons;
}) {
  const LucideIcon = icons[name];
  return (
    <LucideIcon
      className="ui-icon"
      size={24}
      strokeWidth={1.6}
      aria-hidden="true"
      focusable="false"
    />
  );
}
