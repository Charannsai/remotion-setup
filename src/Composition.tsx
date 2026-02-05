import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";

// NotebookLM-tier premium scenes (Ultra-high-end motion graphics)
import { LogoConstructionScene } from "./scenes/LogoConstructionScene";
import { FrontendChaosScene } from "./scenes/FrontendChaosScene";
import { ThinBackendScene } from "./scenes/ThinBackendScene";
import { EasyBuildArrivalScene } from "./scenes/EasyBuildArrivalScene";
import { HowItWorksSceneNew } from "./scenes/HowItWorksSceneNew";
import { DevExperienceSceneNew } from "./scenes/DevExperienceSceneNew";
import { SecurityShieldScene } from "./scenes/SecurityShieldScene";
import { UseCasesSceneAdvanced } from "./scenes/UseCasesSceneAdvanced";
import { BusinessImpactScene } from "./scenes/BusinessImpactScene";
import { BrandIdentityScene } from "./scenes/BrandIdentityScene";
import { FinalCTAScene } from "./scenes/FinalCTAScene";

// ~70 seconds at 30fps = 2100 frames
// Scene distribution for premium pacing (NotebookLM-tier):
// 0. Logo Construction: 180 frames (6 sec)
// 1. Frontend Chaos: 180 frames (6 sec)
// 2. Thin Backend Pain: 180 frames (6 sec)
// 3. EasyBuild Arrival: 180 frames (6 sec)
// 4. How It Works: 180 frames (6 sec)
// 5. Dev Experience: 180 frames (6 sec)
// 6. Security Shield: 165 frames (5.5 sec)
// 7. Use Cases: 165 frames (5.5 sec)
// 8. Business Impact: 180 frames (6 sec)
// 9. Brand Identity: 180 frames (6 sec)
// 10. Final CTA: 210 frames (7 sec)
// Total: 1980 frames (66 sec)
// Transitions: 10 x 30 frames = 300 frames overlap
// Actual: ~1980 - 300 = ~1680 frames + buffer

// Premium transition config - ultra-smooth spring physics
const ultraSmoothSpring = springTiming({
  config: { damping: 22, stiffness: 80 },
  durationInFrames: 30,
});

const liquidFade = linearTiming({ durationInFrames: 30 });

// Dramatic wipe for key moments
const dramaticWipe = springTiming({
  config: { damping: 18, stiffness: 100 },
  durationInFrames: 35,
});

export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: "#050510",
      }}
    >
      <TransitionSeries>
        {/* Scene 0: Logo Construction Open */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <LogoConstructionScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={liquidFade}
        />

        {/* Scene 1: Frontend Chaos - The Problem */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <FrontendChaosScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-right" })}
          timing={dramaticWipe}
        />

        {/* Scene 2: Thin Backend Pain */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <ThinBackendScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={liquidFade}
        />

        {/* Scene 3: EasyBuild Arrival */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <EasyBuildArrivalScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={ultraSmoothSpring}
        />

        {/* Scene 4: How It Works */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <HowItWorksSceneNew />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={liquidFade}
        />

        {/* Scene 5: Dev Experience */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <DevExperienceSceneNew />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={dramaticWipe}
        />

        {/* Scene 6: Security Shield */}
        <TransitionSeries.Sequence durationInFrames={165}>
          <SecurityShieldScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={liquidFade}
        />

        {/* Scene 7: Use Cases */}
        <TransitionSeries.Sequence durationInFrames={165}>
          <UseCasesSceneAdvanced />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={ultraSmoothSpring}
        />

        {/* Scene 8: Business Impact */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <BusinessImpactScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={liquidFade}
        />

        {/* Scene 9: Brand Identity */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <BrandIdentityScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={liquidFade}
        />

        {/* Scene 10: Final CTA */}
        <TransitionSeries.Sequence durationInFrames={210}>
          <FinalCTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
