// Only preserve position during client-side navigation, never across reloads.
let position: number | null = null;

export function rememberHomeScroll() {
  position = window.scrollY;
}

export function restoreHomeScroll() {
  const anchor = position === null && location.hash
    ? document.getElementById(location.hash.slice(1))
    : null;
  if (anchor) {
    anchor.scrollIntoView({ behavior: "instant" });
  } else {
    window.scrollTo({ top: position ?? 0, behavior: "instant" });
  }
}
