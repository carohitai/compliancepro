import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
  Easing,
} from "remotion";
import { COLORS, ICSE_POINTS } from "../constants";

const CheckItem: React.FC<{ text: string; index: number }> = ({ text, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 130 },
  });

  const checkScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 8 },
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        opacity: entrance,
        transform: `translateX(${interpolate(entrance, [0, 1], [-200, 0])}px)`,
      }}
    >
      {/* Animated checkmark */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: `linear-gradient(135deg, ${COLORS.emerald}, #059669)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${checkScale})`,
          boxShadow: `0 0 20px rgba(16,185,129,0.4)`,
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 32, color: COLORS.white }}>✓</span>
      </div>
      <span
        style={{
          fontSize: 34,
          fontWeight: 600,
          color: COLORS.white,
          fontFamily: "sans-serif",
          lineHeight: 1.3,
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const ICSEScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Badge entrance
  const badgeSpring = spring({
    frame,
    fps,
    config: { damping: 10 },
  });

  // Rotating glow
  const glowAngle = frame * 3;

  // Title entrance
  const titleSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 200 },
  });

  // Importance text
  const importanceSpring = spring({
    frame: frame - 70,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill>
      {/* Background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(170deg, #0a0f1e 0%, ${COLORS.deepBlue} 40%, #1a0a3e 100%)`,
        }}
      />

      {/* Rotating gradient ring */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 120,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: `conic-gradient(from ${glowAngle}deg, ${COLORS.gold}, transparent, ${COLORS.warmOrange}, transparent, ${COLORS.gold})`,
            opacity: 0.2,
            filter: "blur(40px)",
          }}
        />
      </AbsoluteFill>

      {/* Content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 70px",
        }}
      >
        {/* ICSE Badge - large */}
        <div
          style={{
            transform: `scale(${badgeSpring}) translateY(-120px)`,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.warmOrange})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              boxShadow: `0 0 60px rgba(245,166,35,0.5), 0 0 120px rgba(245,166,35,0.2)`,
              border: `4px solid rgba(255,255,255,0.3)`,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 52,
                  fontWeight: 900,
                  color: COLORS.deepBlue,
                  fontFamily: "sans-serif",
                  lineHeight: 1,
                }}
              >
                ICSE
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: COLORS.deepBlue,
                  fontFamily: "sans-serif",
                  letterSpacing: 2,
                }}
              >
                AFFILIATED
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 50,
            marginTop: -80,
            opacity: titleSpring,
            transform: `translateY(${interpolate(titleSpring, [0, 1], [30, 0])}px)`,
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: COLORS.white,
              fontFamily: "sans-serif",
              letterSpacing: 2,
            }}
          >
            Why <span style={{ color: COLORS.gold }}>ICSE</span> Matters
          </div>
          <div
            style={{
              width: 250,
              height: 3,
              background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
              margin: "15px auto",
            }}
          />
        </div>

        {/* Check items */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 30,
            width: "100%",
          }}
        >
          {ICSE_POINTS.map((point, i) => (
            <Sequence key={i} from={20 + i * 15} premountFor={10} layout="none">
              <CheckItem text={point} index={i} />
            </Sequence>
          ))}
        </div>

        {/* Bottom importance callout */}
        <Sequence from={70} premountFor={15} layout="none">
          <div
            style={{
              marginTop: 60,
              opacity: importanceSpring,
              transform: `scale(${importanceSpring})`,
              textAlign: "center",
              background: `linear-gradient(135deg, rgba(245,166,35,0.15), rgba(255,107,53,0.15))`,
              border: `2px solid rgba(245,166,35,0.4)`,
              borderRadius: 20,
              padding: "25px 40px",
              width: "100%",
            }}
          >
            <div
              style={{
                fontSize: 30,
                fontWeight: 700,
                color: COLORS.gold,
                fontFamily: "sans-serif",
                lineHeight: 1.5,
              }}
            >
              🌟 India's Most Prestigious Board
            </div>
            <div
              style={{
                fontSize: 24,
                color: "rgba(255,255,255,0.7)",
                fontFamily: "sans-serif",
                marginTop: 8,
              }}
            >
              Trusted by top universities worldwide
            </div>
          </div>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
