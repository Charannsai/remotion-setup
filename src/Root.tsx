import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";

// NotebookLM-tier Premium Video - 11 Scenes @ 30fps
// Scene breakdown:
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
// Total: 1980 frames - 10 transitions (30 frames each) = ~1680 frames
// With buffer: 1980 frames (~66 seconds)

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="EasyBuildPromo"
        component={MyComposition}
        durationInFrames={1980}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
