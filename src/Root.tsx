import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";

// Problem Scene - Cinematic Motion Graphics
// Duration: 780 frames (13 seconds at 60fps)
// Architectural, expansive, controlled growth
// Ultra-smooth easing, no sudden cuts

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="EasyBuildPromo"
        component={MyComposition}
        durationInFrames={1200}
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};
