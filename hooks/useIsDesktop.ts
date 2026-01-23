import { useEffect, useState } from "react";

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(min-width: 1280px)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(min-width: 1280px)");
    const listener = () => setIsDesktop(media.matches);
    media.addEventListener("change", listener);
    // Usar requestAnimationFrame para evitar cascada de renders
    requestAnimationFrame(() => setIsDesktop(media.matches));
    return () => media.removeEventListener("change", listener);
  }, []);

  return isDesktop;
}
