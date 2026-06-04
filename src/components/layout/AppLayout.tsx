import { MobileNav } from "./MobileNav";
import { SideNav } from "./SideNav";
import { RouteTransition } from "@/components/animation/RouteTransition";
import { ScrollRevealProvider } from "@/components/animation/ScrollRevealProvider";

export function AppLayout() {
  return (
    <div className="min-h-dvh bg-background flex">
      <ScrollRevealProvider />

      {/* Desktop: Side navigation */}
      <SideNav />

      {/* Main content area */}
      <main className="flex-1 min-w-0 pb-safe lg:pb-0 flex flex-col">
        <div className="flex-1">
          <RouteTransition />
        </div>

        <footer className="px-4 lg:px-6 py-4 text-center text-xs text-muted-foreground border-t border-border/60 bg-background/80">
          Brought to you by{" "}
          <a
            href="https://macerti.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary link-underline hover:opacity-80"
          >
            Macerti.com
          </a>
        </footer>
      </main>

      {/* Mobile: Bottom navigation */}
      <MobileNav />
    </div>
  );
}
