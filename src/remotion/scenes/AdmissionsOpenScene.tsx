import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
} from "remotion";
import { COLORS } from "../constants";

export const AdmissionsOpenScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Grand entrance - doors opening effect
  const doorProgress = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const leftDoor = interpolate(doorProgress, [0, 1], [0, -540]);
  const rightDoor = interpolate(doorProgress, [0, 1], [0, 540]);

  // "ADMISSIONS" text spring
  const admSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  // "OPEN" slam
  const openSlam = spring({
    frame: frame - 20,
    fps,
    config: { damping: 8, stiffness: 250 },
  });

  // Year badge
  const yearSpring = spring({
    frame: frame - 35,
    fps,
    config: { damping: 15 },
  });

  // Confetti particles
  const confettiColors = [COLORS.gold, COLORS.warmOrange, COLORS.cyan, COLORS.pink, COLORS.emerald];

  // Pulsing ring
  const ringScale = interpolate(frame % 30, [0, 15, 30], [1, 1.15, 1]);
  const ringOpacity = interpolate(frame, [30, 45], [0, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(160deg, ${COLORS.deepBlue} 0%, #0f2847 50%, #1a0a3e 100%)`,
        }}
      />

      {/* Doors effect */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 540,
          height: 1920,
          backgroundColor: COLORS.royalBlue,
          transform: `translateX(${leftDoor}px)`,
          zIndex: 10,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: 540,
          height: 1920,
          backgroundColor: COLORS.royalBlue,
          transform: `translateX(${rightDoor}px)`,
          zIndex: 10,
        }}
      />

      {/* Pulsing background rings */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: ringOpacity,
        }}
      >
        {[1, 1.5, 2].map((mult, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 600 * mult,
              height: 600 * mult,
              borderRadius: "50%",
              border: `2px solid ${COLORS.gold}`,
              opacity: 0.3 - i * 0.08,
              transform: `scale(${ringScale + i * 0.05})`,
            }}
          />
        ))}
      </AbsoluteFill>

      {/* Confetti */}
      {frame > 20 &&
        Array.from({ length: 25 }, (_, i) => {
          const confettiFrame = frame - 20;
          const x = ((i * 173) % 1080);
          const fallSpeed = 3 + (i % 5) * 1.5;
          const y = (confettiFrame * fallSpeed + i * 80) % 2200 - 200;
          const rotate = confettiFrame * (3 + (i % 4)) + i * 45;
          const confettiOpacity = interpolate(y, [-200, 0, 1800, 2000], [0, 1, 1, 0]);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: 12,
                height: 20,
                backgroundColor: confettiColors[i % confettiColors.length],
                borderRadius: 2,
                transform: `rotate(${rotate}deg)`,
                opacity: confettiOpacity * 0.8,
              }}
            />
          );
        })}

      {/* Main content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Decorative star burst */}
        <div
          style={{
            position: "absolute",
            top: "35%",
            fontSize: 120,
            opacity: interpolate(admSpring, [0, 1], [0, 0.15]),
            transform: `scale(${2 + admSpring * 0.5}) rotate(${frame * 0.5}deg)`,
          }}
        >
          ✦
        </div>

        <div
          style={{
            textAlign: "center",
            transform: `translateY(-80px)`,
          }}
        >
          {/* "ADMISSIONS" */}
          <div
            style={{
              fontSize: 82,
              fontWeight: 900,
              color: COLORS.white,
              fontFamily: "sans-serif",
              letterSpacing: 10,
              transform: `scale(${admSpring})`,
              textShadow: "0 4px 30px rgba(0,0,0,0.5)",
            }}
          >
            ADMISSIONS
          </div>

          {/* "OPEN" with slam effect */}
          <div
            style={{
              fontSize: 160,
              fontWeight: 900,
              fontFamily: "sans-serif",
              letterSpacing: 8,
              transform: `scale(${openSlam})`,
              background: `linear-gradient(180deg, ${COLORS.brightGold} 0%, ${COLORS.warmOrange} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: `drop-shadow(0 0 30px rgba(245,166,35,0.5))`,
              lineHeight: 1,
            }}
          >
            OPEN
          </div>

          {/* Decorative divider */}
          <div
            style={{
              width: interpolate(yearSpring, [0, 1], [0, 500]),
              height: 3,
              background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
              margin: "30px auto",
            }}
          />

          {/* Year badge */}
          <div
            style={{
              transform: `scale(${yearSpring})`,
              display: "inline-block",
            }}
          >
            <div
              style={{
                background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.warmOrange})`,
                borderRadius: 20,
                padding: "20px 60px",
                boxShadow: `0 10px 40px rgba(245,166,35,0.4), inset 0 1px 0 rgba(255,255,255,0.3)`,
              }}
            >
              <span
                style={{
                  fontSize: 72,
                  fontWeight: 900,
                  color: COLORS.deepBlue,
                  fontFamily: "sans-serif",
                  letterSpacing: 4,
                }}
              >
                2026-27
              </span>
            </div>
          </div>

          {/* Subtext */}
          <div
            style={{
              marginTop: 40,
              opacity: interpolate(yearSpring, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(yearSpring, [0, 1], [30, 0])}px)`,
            }}
          >
            <div
              style={{
                fontSize: 34,
                color: "rgba(255,255,255,0.8)",
                fontFamily: "sans-serif",
                letterSpacing: 6,
                fontWeight: 300,
              }}
            >
              NURSERY TO CLASS X
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
