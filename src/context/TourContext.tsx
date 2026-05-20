import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { TOURS, tourKeyForPath, type TourKey } from "@/tours/tourSteps";

interface TourContextValue {
  activeTour: TourKey | null;
  run: boolean;
  start: (key?: TourKey) => void;
  stop: () => void;
  markSeen: (key: TourKey) => void;
  hasSeen: (key: TourKey) => boolean;
}

const TourContext = createContext<TourContextValue | undefined>(undefined);

const seenKey = (userId: string | undefined, key: TourKey) =>
  `tour:seen:${userId ?? "anon"}:${key}`;

export function TourProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user } = useAuth();
  const [activeTour, setActiveTour] = useState<TourKey | null>(null);
  const [run, setRun] = useState(false);

  const hasSeen = useCallback(
    (key: TourKey) => {
      try {
        return localStorage.getItem(seenKey(user?.id, key)) === "1";
      } catch {
        return false;
      }
    },
    [user?.id],
  );

  const markSeen = useCallback(
    (key: TourKey) => {
      try {
        localStorage.setItem(seenKey(user?.id, key), "1");
      } catch {
        /* noop */
      }
    },
    [user?.id],
  );

  const start = useCallback(
    (key?: TourKey) => {
      const k = key ?? tourKeyForPath(location.pathname);
      if (!k || !TOURS[k]) return;
      setActiveTour(k);
      // small delay so any route content can mount targets
      setTimeout(() => setRun(true), 150);
    },
    [location.pathname],
  );

  const stop = useCallback(() => {
    setRun(false);
    if (activeTour) markSeen(activeTour);
    setActiveTour(null);
  }, [activeTour, markSeen]);

  // auto-launch first-time per route
  useEffect(() => {
    if (!user) return;
    const k = tourKeyForPath(location.pathname);
    if (!k) return;
    if (hasSeen(k)) return;
    // delay to allow targets to render
    const t = setTimeout(() => {
      setActiveTour(k);
      setRun(true);
    }, 600);
    return () => clearTimeout(t);
  }, [location.pathname, user, hasSeen]);

  const value = useMemo<TourContextValue>(
    () => ({ activeTour, run, start, stop, markSeen, hasSeen }),
    [activeTour, run, start, stop, markSeen, hasSeen],
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within TourProvider");
  return ctx;
}
