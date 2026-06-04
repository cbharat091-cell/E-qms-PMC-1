import { useLocation, useOutlet } from "react-router-dom";

/**
 * Wraps the routed <Outlet/> with a keyed fade+lift transition so every
 * route change feels intentional. Pure CSS — no extra deps.
 */
export function RouteTransition() {
  const location = useLocation();
  const outlet = useOutlet();
  return (
    <div key={location.pathname} className="view-transition">
      {outlet}
    </div>
  );
}
