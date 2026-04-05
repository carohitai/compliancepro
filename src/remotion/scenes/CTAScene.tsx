import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
} from "remotion";
import { COLORS } from "../constants";

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background animation
  const bgShift = interpolate(frame, [0, 90], [0, 30]);

  // Main CTA entrance
  const ctaSpring = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 120 },
  });

  // Button pulse
  const buttonPulse = interpolate(
    frame % 24,
    [0, 12, 24],
    [1, 1.08, 1],
  );
  const buttonGlow = interpolate(
    frame % 24,
    [0, 12, 24],
    [20, 40, 20],
  );

  // Website URL entrance
  const urlSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 200 },
  });

  // QR/social hints
  const socialSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 200 },
  });

  // Arrow animation
  const arrowBounce = interpolate(
    frame % 20,
    [0, 10, 20],
    [0, -15, 0],
  );

  // Floating elements
  const float1 = interpolate(frame % 50, [0, 25, 50], [-10, 10, -10]);
  const float2 = interpolate(frame % 40, [0, 20, 40], [8, -8, 8]);

  return (
    <AbsoluteFill>
      {/* Rich gradient background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${150 + bgShift}deg, ${COLORS.deepBlue} 0%, #1a0a3e 40%, #0f2847 100%)`,
        }}
      />

      {/* Animated radial glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 60%, rgba(245,166,35,0.12) 0%, transparent 50%)`,
        }}
      />

      {/* Floating decorative elements */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 80,
          fontSize: 80,
          opacity: 0.15,
          transform: `translateY(${float1}px) rotate(${frame * 0.5}deg)`,
        }}
      >
        ✦
      </div>
      <div
        style={{
          position: "absolute",
          top: 400,
          right: 100,
          fontSize: 60,
          opacity: 0.12,
          transform: `translateY(${float2}px) rotate(${-frame * 0.3}deg)`,
        }}
      >
        ✧
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 300,
          left: 120,
          fontSize: 50,
          opacity: 0.1,
          transform: `translateY(${float2}px)`,
        }}
      >
        🎓
      </div>

      {/* Main content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 60px",
        }}
      >
        <div
          style={{
            transform: `scale(${ctaSpring})`,
            textAlign: "center",
          }}
        >
          {/* Limited seats badge */}
          <div
            style={{
              background: `linear-gradient(135deg, ${COLORS.crimson}, #b91c1c)`,
              borderRadius: 50,
              padding: "14px 50px",
              display: "inline-block",
              marginBottom: 40,
              boxShadow: "0 4px 20px rgba(220,38,38,0.4)",
            }}
          >
            <span
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: COLORS.white,
                fontFamily: "sans-serif",
                letterSpacing: 4,
              }}
            >
              ⚡ LIMITED SEATS ⚡
            </span>
          </div>

          {/* Main CTA text */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: COLORS.white,
              fontFamily: "sans-serif",
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            Enroll Your
            <br />
            Child{" "}
            <span
              style={{
                background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.warmOrange})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Today!
            </span>
          </div>

          {/* Animated down arrow */}
          <div
            style={{
              fontSize: 50,
              transform: `translateY(${arrowBounce}px)`,
              marginBottom: 30,
            }}
          >
            👇
          </div>

          {/* CTA Button */}
          <div
            style={{
              background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.warmOrange})`,
              borderRadius: 25,
              padding: "28px 70px",
              display: "inline-block",
              transform: `scale(${buttonPulse})`,
              boxShadow: `0 0 ${buttonGlow}px rgba(245,166,35,0.6), 0 8px 30px rgba(0,0,0,0.3)`,
            }}
          >
            <span
              style={{
                fontSize: 42,
                fontWeight: 900,
                color: COLORS.deepBlue,
                fontFamily: "sans-serif",
                letterSpacing: 3,
              }}
            >
              APPLY NOW →
            </span>
          </div>
        </div>

        {/* Website URL */}
        <div
          style={{
            marginTop: 50,
            opacity: urlSpring,
            transform: `translateY(${interpolate(urlSpring, [0, 1], [30, 0])}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: "rgba(255,255,255,0.5)",
              fontFamily: "sans-serif",
              letterSpacing: 3,
              marginBottom: 10,
            }}
          >
            VISIT US AT
          </div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: COLORS.cyan,
              fontFamily: "sans-serif",
              letterSpacing: 1,
              textShadow: `0 0 20px rgba(6,182,212,0.4)`,
            }}
          >
            🌐 www.kolteworldschool.com
          </div>
        </div>

        {/* Social media / contact */}
        <div
          style={{
            marginTop: 50,
            opacity: socialSpring,
            transform: `translateY(${interpolate(socialSpring, [0, 1], [20, 0])}px)`,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 30,
            }}
          >
            {["📞", "📧", "📍"].map((emoji, i) => (
              <div
                key={i}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                }}
              >
                {emoji}
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: 24,
              color: "rgba(255,255,255,0.5)",
              fontFamily: "sans-serif",
              letterSpacing: 4,
              marginTop: 10,
            }}
          >
            KOLTE WORLD SCHOOL
          </div>
        </div>
      </AbsoluteFill>

      {/* Bottom gradient fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: 100,
          background: `linear-gradient(transparent, ${COLORS.deepBlue})`,
        }}
      />
    </AbsoluteFill>
  );
};
