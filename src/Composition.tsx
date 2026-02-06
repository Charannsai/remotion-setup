import React from "react";
import { AbsoluteFill } from "remotion";

// Problem Scene - Showing the API integration complexity
import { ProblemScene } from "./scenes/ProblemScene";

// Scene Duration: 300 frames (10 seconds at 30fps)
// This scene shows the problem of modern API-dependent applications
// and the backend complexity that arises from credential protection needs.

export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: "#050510",
      }}
    >
      <ProblemScene />
    </AbsoluteFill>
  );
};
