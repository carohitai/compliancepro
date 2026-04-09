import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
} from "remotion";
import { COLORS } from "../constants";

export const SchoolRevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background zoom
  const bgScale = interpolate(frame, [0, 80], [1.2, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Shield/crest animation
  const crestSpring = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 100 },
  });
  const crestScale = interpolate(crestSpring, [0, 1], [0, 1]);

  // School name reveal - left to right wipe
  const nameReveal = interpolate(frame, [15, 40], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Tagline fade in
  const taglineSpring = spring({
    frame: frame - 35,
    fps,
    config: { damping: 200 },
  });

  // Decorative lines
  const lineWidth = interpolate(frame, [20, 50], [0, 400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Sparkle particles
  const particles = Array.from({ length: 15 }, (_, i) => ({
    x: (i * 137.5) % 1080,
    y: (i * 234.7) % 1920,
    delay: i * 3,
    size: 4 + (i % 3) * 3,
  }));

  return (
    <AbsoluteFill>
      {/* Rich gradient background */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, ${COLORS.royalBlue} 0%, ${COLORS.deepBlue} 70%)`,
          transform: `scale(${bgScale})`,
        }}
      />

      {/* Radial light burst */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 45%, rgba(245,166,35,0.15) 0%, transparent 50%)`,
        }}
      />

      {/* Sparkle particles */}
      {particles.map((p, i) => {
        const sparkleOpacity = interpolate(
          (frame - p.delay) % 30,
          [0, 15, 30],
          [0, 0.8, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: COLORS.gold,
              opacity: frame > p.delay ? sparkleOpacity : 0,
              boxShadow: `0 0 ${p.size * 2}px ${COLORS.gold}`,
            }}
          />
        );
      })}

      {/* Content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* School Crest / Shield */}
        <div
          style={{
            transform: `scale(${crestScale})`,
            marginBottom: 40,
            width: 200,
            height: 220,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Shield shape */}
          <svg width="200" height="220" viewBox="0 0 200 220">
            <defs>
              <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={COLORS.gold} />
                <stop offset="100%" stopColor={COLORS.warmOrange} />
              </linearGradient>
            </defs>
            <path
              d="M100 10 L185 55 L185 130 Q185 190 100 210 Q15 190 15 130 L15 55 Z"
              fill="url(#shieldGrad)"
              stroke={COLORS.brightGold}
              strokeWidth="3"
            />
            <text
              x="100"
              y="105"
              textAnchor="middle"
              fontSize="60"
              fontWeight="900"
              fill={COLORS.deepBlue}
              fontFamily="sans-serif"
            >
              KW
            </text>
            <text
              x="100"
              y="150"
              textAnchor="middle"
              fontSize="20"
              fontWeight="700"
              fill={COLORS.deepBlue}
              fontFamily="sans-serif"
            >
              EST. 2024
            </text>
          </svg>
        </div>

        {/* Decorative line top */}
        <div
          style={{
            width: lineWidth,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
            marginBottom: 30,
          }}
        />

        {/* School Name */}
        <div
          style={{
            overflow: "hidden",
            textAlign: "center",
          }}
        >
          <div
            style={{
              clipPath: `inset(0 ${100 - nameReveal}% 0 0)`,
            }}
          >
            <div
              style={{
                fontSize: 78,
                fontWeight: 900,
                color: COLORS.white,
                fontFamily: "sans-serif",
                letterSpacing: 6,
                textTransform: "uppercase",
                lineHeight: 1.2,
              }}
            >
              KOLTE
            </div>
            <div
              style={{
                fontSize: 58,
                fontWeight: 300,
                color: COLORS.gold,
                fontFamily: "sans-serif",
                letterSpacing: 18,
                textTransform: "uppercase",
              }}
            >
              WORLD
            </div>
            <div
              style={{
                fontSize: 78,
                fontWeight: 900,
                color: COLORS.white,
                fontFamily: "sans-serif",
                letterSpacing: 6,
                textTransform: "uppercase",
              }}
            >
              SCHOOL
            </div>
          </div>
        </div>

        {/* Decorative line bottom */}
        <div
          style={{
            width: lineWidth,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
            marginTop: 30,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            opacity: taglineSpring,
            transform: `translateY(${interpolate(taglineSpring, [0, 1], [20, 0])}px)`,
            marginTop: 35,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 32,
              color: "rgba(255,255,255,0.85)",
              fontFamily: "sans-serif",
              letterSpacing: 6,
              fontWeight: 300,
              textTransform: "uppercase",
            }}
          >
            Where Excellence Meets
          </div>
          <div
            style={{
              fontSize: 40,
              color: COLORS.gold,
              fontFamily: "sans-serif",
              letterSpacing: 4,
              fontWeight: 700,
              marginTop: 5,
            }}
          >
            Innovation ✨
          </div>
        </div>

        {/* ICSE Badge */}
        <div
          style={{
            marginTop: 50,
            opacity: taglineSpring,
            transform: `scale(${taglineSpring})`,
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, rgba(245,166,35,0.2), rgba(255,107,53,0.2))`,
              border: `2px solid ${COLORS.gold}`,
              borderRadius: 50,
              padding: "12px 40px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 28 }}>🏅</span>
            <span
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: COLORS.gold,
                fontFamily: "sans-serif",
                letterSpacing: 4,
              }}
            >
              ICSE AFFILIATED
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
