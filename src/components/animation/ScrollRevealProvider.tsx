import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Global IntersectionObserver that reveals any element marked with
 * `data-reveal` as it scrolls into view. Re-scans on route changes so
 * freshly-mounted pages get observed automatically.
 */
export function ScrollRevealProvider() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    const scan = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)").forEach((el, i) => {
        if (!el.style.transitionDelay) {
          el.style.transitionDelay = `${Math.min(i * 40, 320)}ms`;
        }
        observer.observe(el);
      });
    };

    // Initial pass + a couple of delayed passes for async-rendered content.
    scan();
    const t1 = window.setTimeout(scan, 120);
    const t2 = window.setTimeout(scan, 480);

    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [location.pathname]);

  return null;
}
