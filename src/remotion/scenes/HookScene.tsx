import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
} from "remotion";
import { COLORS } from "../constants";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background gradient rotation
  const gradientAngle = interpolate(frame, [0, 75], [135, 180], {
    extrapolateRight: "clamp",
  });

  // "STOP SCROLLING" animation - slam in with spring
  const slamScale = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 200 },
  });

  // Shake effect on slam
  const shakeX =
    frame < 12
      ? interpolate(frame % 4, [0, 1, 2, 3], [-8, 8, -5, 5])
      : 0;
  const shakeY =
    frame < 12
      ? interpolate(frame % 4, [0, 1, 2, 3], [5, -8, 8, -5])
      : 0;

  // Flash effect
  const flashOpacity = interpolate(frame, [0, 5, 10], [1, 0.6, 0], {
    extrapolateRight: "clamp",
  });

  // Second line entrance
  const line2Spring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 12, stiffness: 150 },
  });
  const line2Y = interpolate(line2Spring, [0, 1], [80, 0]);
  const line2Opacity = interpolate(line2Spring, [0, 1], [0, 1]);

  // Emoji burst
  const emojiBurst = spring({
    frame: frame - 8,
    fps,
    config: { damping: 6 },
  });

  // Pulsing glow on "STOP"
  const glowPulse = interpolate(
    frame % 20,
    [0, 10, 20],
    [0, 15, 0],
  );

  return (
    <AbsoluteFill>
      {/* Animated gradient background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${gradientAngle}deg, ${COLORS.deepBlue} 0%, #1a0a3e 40%, ${COLORS.royalBlue} 100%)`,
        }}
      />

      {/* Animated grid pattern */}
      <AbsoluteFill
        style={{
          opacity: 0.08,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: `translateY(${frame * 0.5}px)`,
        }}
      />

      {/* Flash overlay */}
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.white,
          opacity: flashOpacity,
        }}
      />

      {/* Main content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* STOP SCROLLING text */}
        <div
          style={{
            transform: `scale(${slamScale}) translate(${shakeX}px, ${shakeY}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 110,
              fontWeight: 900,
              color: COLORS.white,
              fontFamily: "sans-serif",
              letterSpacing: -3,
              textShadow: `0 0 ${glowPulse + 20}px ${COLORS.gold}, 0 0 ${glowPulse + 40}px rgba(245,166,35,0.5)`,
              lineHeight: 1.1,
            }}
          >
            STOP
          </div>
          <div
            style={{
              fontSize: 88,
              fontWeight: 900,
              color: COLORS.gold,
              fontFamily: "sans-serif",
              letterSpacing: -2,
              textShadow: `0 0 30px rgba(245,166,35,0.6)`,
            }}
          >
            SCROLLING! ✋
          </div>
        </div>

        {/* Emoji burst effect */}
        {["⚡", "🔥", "✨", "💫"].map((emoji, i) => {
          const angle = (i * 90 + 45) * (Math.PI / 180);
          const distance = interpolate(emojiBurst, [0, 1], [0, 200]);
          const emojiOpacity = interpolate(emojiBurst, [0, 0.3, 1], [0, 1, 0.4]);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "42%",
                left: "50%",
                fontSize: 60,
                transform: `translate(${Math.cos(angle) * distance - 30}px, ${Math.sin(angle) * distance - 30}px)`,
                opacity: emojiOpacity,
              }}
            >
              {emoji}
            </div>
          );
        })}
      </AbsoluteFill>

      {/* Second line - "Your Child Deserves THE BEST" */}
      <Sequence from={30} layout="none">
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 450,
          }}
        >
          <div
            style={{
              transform: `translateY(${line2Y}px)`,
              opacity: line2Opacity,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 52,
                fontWeight: 600,
                color: "rgba(255,255,255,0.9)",
                fontFamily: "sans-serif",
                letterSpacing: 2,
              }}
            >
              Your Child Deserves
            </div>
            <div
              style={{
                fontSize: 80,
                fontWeight: 900,
                background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.warmOrange})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "sans-serif",
                letterSpacing: 3,
              }}
            >
              THE BEST
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
