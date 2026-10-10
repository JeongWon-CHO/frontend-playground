import {
  ArrowDown,
  ArrowLeft,
  Asterisk,
  ChevronDown,
  LoaderCircle,
  X,
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUp,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";

const icons = {
  "arrow-left": ArrowLeft,
  asterisk: Asterisk,
  chevron: ChevronDown,
  loading: LoaderCircle,
  close: X,
  "arrow-up-right": ArrowUpRight,
  "arrow-down-left": ArrowDownLeft,
  "arrow-down": ArrowDown,
  "arrow-up": ArrowUp,
  reset: RotateCcw,
  swap: ArrowLeftRight,
};

export default function Icon({
  name = "arrow-up-right",
  size = 24,
  className = "",
}: {
  name?: keyof typeof icons;
  size?: number;
  className?: string;
}) {
  const LucideIcon = icons[name];
  return (
    <LucideIcon
      className={`ui-icon ${className}`}
      size={size}
      strokeWidth={1.6}
      aria-hidden="true"
      focusable="false"
    />
  );
}
