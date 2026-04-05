import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
} from "remotion";
import { COLORS, FEATURES } from "../constants";

const FeatureCard: React.FC<{
  icon: string;
  title: string;
  subtitle: string;
  index: number;
}> = ({ icon, title, subtitle, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  const slideX = interpolate(entrance, [0, 1], [index % 2 === 0 ? -400 : 400, 0]);
  const cardOpacity = interpolate(entrance, [0, 1], [0, 1]);

  // Subtle floating animation
  const floatY = interpolate(
    (frame + index * 10) % 40,
    [0, 20, 40],
    [0, -5, 0],
  );

  // Glow pulse
  const glowIntensity = interpolate(
    (frame + index * 5) % 30,
    [0, 15, 30],
    [0.2, 0.5, 0.2],
  );

  const cardColors = [
    { bg: "rgba(16,185,129,0.15)", border: COLORS.emerald, glow: COLORS.emerald },
    { bg: "rgba(6,182,212,0.15)", border: COLORS.cyan, glow: COLORS.cyan },
    { bg: "rgba(124,58,237,0.15)", border: COLORS.purple, glow: COLORS.purple },
    { bg: "rgba(236,72,153,0.15)", border: COLORS.pink, glow: COLORS.pink },
    { bg: "rgba(245,166,35,0.15)", border: COLORS.gold, glow: COLORS.gold },
    { bg: "rgba(255,107,53,0.15)", border: COLORS.warmOrange, glow: COLORS.warmOrange },
    { bg: "rgba(6,182,212,0.15)", border: COLORS.cyan, glow: COLORS.cyan },
    { bg: "rgba(16,185,129,0.15)", border: COLORS.emerald, glow: COLORS.emerald },
  ];

  const color = cardColors[index % cardColors.length];

  return (
    <div
      style={{
        transform: `translateX(${slideX}px) translateY(${floatY}px)`,
        opacity: cardOpacity,
        display: "flex",
        alignItems: "center",
        gap: 24,
        background: color.bg,
        border: `2px solid ${color.border}`,
        borderRadius: 24,
        padding: "28px 36px",
        width: 900,
        boxShadow: `0 0 ${30 * glowIntensity}px ${color.glow}`,
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          fontSize: 64,
          flexShrink: 0,
          width: 90,
          height: 90,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,255,255,0.1)",
          borderRadius: 20,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: 38,
            fontWeight: 800,
            color: COLORS.white,
            fontFamily: "sans-serif",
            letterSpacing: 1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 26,
            color: "rgba(255,255,255,0.7)",
            fontFamily: "sans-serif",
            fontWeight: 400,
            marginTop: 4,
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
};

export const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title entrance
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  // Counter animation
  const counterValue = Math.min(8, Math.floor(frame / 5));

  return (
    <AbsoluteFill>
      {/* Background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${COLORS.deepBlue} 0%, #0d1f3c 50%, #130a2e 100%)`,
        }}
      />

      {/* Animated diagonal lines */}
      <AbsoluteFill
        style={{
          opacity: 0.04,
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 80px,
            rgba(245,166,35,0.5) 80px,
            rgba(245,166,35,0.5) 82px
          )`,
          transform: `translateY(${-frame * 0.8}px)`,
        }}
      />

      {/* Section title */}
      <div
        style={{
          position: "absolute",
          top: 80,
          width: "100%",
          textAlign: "center",
          transform: `scale(${titleSpring})`,
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: COLORS.gold,
            fontFamily: "sans-serif",
            letterSpacing: 8,
            textTransform: "uppercase",
          }}
        >
          Why Choose Us
        </div>
        <div
          style={{
            fontSize: 62,
            fontWeight: 900,
            color: COLORS.white,
            fontFamily: "sans-serif",
            letterSpacing: 2,
            marginTop: 8,
          }}
        >
          World-Class Features
        </div>
        <div
          style={{
            width: 200,
            height: 4,
            background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.warmOrange})`,
            margin: "15px auto",
            borderRadius: 2,
          }}
        />
      </div>

      {/* Feature cards */}
      <AbsoluteFill
        style={{
          top: 280,
          alignItems: "center",
          gap: 18,
          display: "flex",
          flexDirection: "column",
          paddingLeft: 90,
          paddingRight: 90,
        }}
      >
        {FEATURES.map((feature, i) => (
          <Sequence key={i} from={10 + i * 20} premountFor={15} layout="none">
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              subtitle={feature.subtitle}
              index={i}
            />
          </Sequence>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
