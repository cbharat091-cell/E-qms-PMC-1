import Joyride, { CallBackProps, STATUS, EVENTS, ACTIONS } from "react-joyride";
import { useTour } from "@/context/TourContext";
import { TOURS } from "@/tours/tourSteps";

export function AppTour() {
  const { activeTour, run, stop } = useTour();
  if (!activeTour) return null;
  const tour = TOURS[activeTour];

  const handleCallback = (data: CallBackProps) => {
    const { status, type, action } = data;
    if (
      status === STATUS.FINISHED ||
      status === STATUS.SKIPPED ||
      action === ACTIONS.CLOSE ||
      type === EVENTS.TOUR_END
    ) {
      stop();
    }
  };

  return (
    <Joyride
      steps={tour.steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      scrollToFirstStep
      disableScrolling={false}
      callback={handleCallback}
      locale={{
        back: "Back",
        close: "Close",
        last: "Finish",
        next: "Next",
        skip: "Skip tour",
      }}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: "hsl(var(--primary))",
          textColor: "hsl(var(--foreground))",
          backgroundColor: "hsl(var(--background))",
          arrowColor: "hsl(var(--background))",
          overlayColor: "hsla(0, 0%, 0%, 0.55)",
        },
        tooltip: {
          borderRadius: 12,
          padding: 16,
        },
        tooltipTitle: { fontSize: 15, fontWeight: 600 },
        tooltipContent: { fontSize: 13, lineHeight: 1.55 },
        buttonNext: {
          backgroundColor: "hsl(var(--primary))",
          color: "hsl(var(--primary-foreground))",
          borderRadius: 8,
          padding: "8px 14px",
          fontSize: 13,
        },
        buttonBack: {
          color: "hsl(var(--muted-foreground))",
          marginRight: 8,
          fontSize: 13,
        },
        buttonSkip: { color: "hsl(var(--muted-foreground))", fontSize: 12 },
      }}
    />
  );
}
