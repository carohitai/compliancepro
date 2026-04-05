import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { HookScene } from "./scenes/HookScene";
import { SchoolRevealScene } from "./scenes/SchoolRevealScene";
import { AdmissionsOpenScene } from "./scenes/AdmissionsOpenScene";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { ICSEScene } from "./scenes/ICSEScene";
import { CTAScene } from "./scenes/CTAScene";

// Scene durations in frames (30fps)
const HOOK = 80;
const SCHOOL_REVEAL = 85;
const ADMISSIONS_OPEN = 80;
const FEATURES = 250;
const ICSE = 105;
const CTA = 100;
const TRANSITION = 12;

export const AdmissionsVideo: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 1: Viral Hook - "STOP SCROLLING" */}
      <TransitionSeries.Sequence durationInFrames={HOOK}>
        <HookScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION })}
      />

      {/* Scene 2: School Name Reveal */}
      <TransitionSeries.Sequence durationInFrames={SCHOOL_REVEAL}>
        <SchoolRevealScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: TRANSITION })}
      />

      {/* Scene 3: Admissions Open 2026-27 */}
      <TransitionSeries.Sequence durationInFrames={ADMISSIONS_OPEN}>
        <AdmissionsOpenScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={wipe({ direction: "from-left" })}
        timing={linearTiming({ durationInFrames: TRANSITION })}
      />

      {/* Scene 4: Features Showcase */}
      <TransitionSeries.Sequence durationInFrames={FEATURES}>
        <FeaturesScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION })}
      />

      {/* Scene 5: Why ICSE */}
      <TransitionSeries.Sequence durationInFrames={ICSE}>
        <ICSEScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: TRANSITION })}
      />

      {/* Scene 6: Call to Action */}
      <TransitionSeries.Sequence durationInFrames={CTA}>
        <CTAScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
