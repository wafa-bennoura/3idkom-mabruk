import { useState, useEffect, useCallback } from "react";
import lanternImg from "@/assets/lantern.png";

const BALLOON_COLORS = [
  "hsl(340, 82%, 52%)",
  "hsl(45, 93%, 58%)",
  "hsl(280, 60%, 65%)",
  "hsl(200, 80%, 60%)",
  "hsl(150, 60%, 50%)",
  "hsl(20, 90%, 60%)",
];

const Confetti = ({ count = 50 }: { count?: number }) => (
  <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
    {Array.from({ length: count }).map((_, i) => {
      const left = Math.random() * 100;
      const delay = Math.random() * 2;
      const duration = 2 + Math.random() * 3;
      const size = 6 + Math.random() * 8;
      const color = BALLOON_COLORS[i % BALLOON_COLORS.length];
      const shape = i % 3;
      return (
        <div
          key={i}
          className="absolute top-0"
          style={{
            left: `${left}%`,
            width: shape === 2 ? size : size / 2,
            height: shape === 2 ? size / 2 : size,
            backgroundColor: color,
            borderRadius: shape === 0 ? "50%" : shape === 1 ? "2px" : "50%",
            animation: `confetti-fall ${duration}s ease-in ${delay}s forwards`,
            opacity: 0,
            animationFillMode: "forwards",
          }}
        />
      );
    })}
  </div>
);

const Balloon = ({ color, style, delay }: { color: string; style: React.CSSProperties; delay: number }) => (
  <div
    className="absolute"
    style={{
      ...style,
      animation: `balloon-rise 1.5s ease-out ${delay}s forwards, balloon-float ${3 + Math.random() * 2}s ease-in-out ${delay + 1.5}s infinite`,
      opacity: 0,
    }}
  >
    <svg width="60" height="80" viewBox="0 0 60 80">
      <defs>
        <radialGradient id={`grad-${color.replace(/[^a-z0-9]/g, "")}`} cx="35%" cy="30%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
      </defs>
      <ellipse cx="30" cy="30" rx="25" ry="30" fill={`url(#grad-${color.replace(/[^a-z0-9]/g, "")})`} />
      <polygon points="25,58 30,65 35,58" fill={color} />
      <path d="M30,65 Q32,72 28,80" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  </div>
);

const Hearts = () => (
  <>
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="absolute text-2xl"
        style={{
          left: `${10 + Math.random() * 80}%`,
          top: `${10 + Math.random() * 80}%`,
          animation: `heart-pop 0.5s ease-out ${0.5 + i * 0.15}s forwards, float ${3 + Math.random() * 2}s ease-in-out ${1 + i * 0.15}s infinite`,
          opacity: 0,
          animationFillMode: "forwards",
          fontSize: `${16 + Math.random() * 20}px`,
        }}
      >
        {i % 3 === 0 ? "💖" : i % 3 === 1 ? "✨" : "🎉"}
      </div>
    ))}
  </>
);

/* Single purple bullet that traces: top→bottom→right→left→top */
const PurpleBullet = () => (
  <div
    className="absolute rounded-full z-30"
    style={{
      width: 32,
      height: 32,
      background: "radial-gradient(circle, hsl(280, 80%, 75%), hsl(280, 60%, 50%))",
      animation: "bullet-path 3s ease-in-out forwards, bullet-glow 0.5s ease-in-out infinite",
    }}
  />
);

/* Hanging lanterns that fade in after bullet animation */
const HangingLanterns = ({ delay }: { delay: number }) => {
  const positions = [12, 30, 50, 70, 88];
  const sizes = [75, 65, 85, 65, 75];
  const threadLengths = [200, 220, 180, 210, 190];

  return (
    <>
      {positions.map((left, i) => (
        <div
          key={i}
          className="absolute top-0 flex flex-col items-center"
          style={{
            left: `${left}%`,
            transform: "translateX(-50%)",
            animation: `lantern-fade-in 0.8s ease-out ${delay + i * 0.2}s forwards, lantern-swing ${3 + i * 0.5}s ease-in-out ${delay + 1 + i * 0.2}s infinite`,
            opacity: 0,
            transformOrigin: "top center",
          }}
        >
          <div
            style={{
              width: 5,
              height: threadLengths[i],
              background: "linear-gradient(to bottom, hsl(280, 60%, 55%), hsl(280, 50%, 70%))",
              borderRadius: 3,
            }}
          />
          <img
            src={lanternImg}
            alt="Eid lantern"
            style={{
              width: sizes[i],
              objectFit: "contain",
              filter: "drop-shadow(0 0 12px hsl(45, 90%, 55%))",
            }}
          />
        </div>
      ))}
    </>
  );
};

/* Envelope that drops from top with thread after bullet finishes */
const DroppingEnvelope = ({ onClick, isShaking }: { onClick: () => void; isShaking: boolean }) => (
  <div
    className="absolute flex flex-col items-center z-20 cursor-pointer"
    onClick={onClick}
    style={{
      top: "25%",
      left: "50%",
      transform: "translateX(-50%)",
      animation: "envelope-drop 1s cubic-bezier(0.34, 1.56, 0.64, 1) 3.2s forwards",
      opacity: 0,
    }}
  >
    {/* Purple thread from top */}
    <div
      style={{
        width: 5,
        height: 200,
        background: "linear-gradient(to bottom, hsl(280, 60%, 55%), hsl(280, 70%, 75%))",
        borderRadius: 3,
        position: "absolute",
        top: -200,
        left: "50%",
        transform: "translateX(-50%)",
      }}
    />
    {/* Envelope SVG */}
    <div className={`transition-transform duration-300 hover:scale-110 ${isShaking ? "animate-envelope-shake" : ""}`}>
      <svg width="160" height="120" viewBox="0 0 160 120">
        <rect x="5" y="25" width="150" height="90" rx="8" fill="#fcdce1" stroke="hsl(20, 50%, 40%)" strokeWidth="2" />
        <path d="M5,25 L80,80 L155,25" fill="#fcdce1" stroke="hsl(20, 50%, 40%)" strokeWidth="2" />
        <path d="M5,115 L60,70" stroke="hsl(20, 50%, 40%)" strokeWidth="1" opacity="0.3" />
        <path d="M155,115 L100,70" stroke="hsl(20, 50%, 40%)" strokeWidth="1" opacity="0.3" />
        <circle cx="80" cy="75" r="14" fill="hsl(340, 82%, 52%)" />
      </svg>
    </div>
  </div>
);

const TapHint = () => (
  <div
    className="absolute z-20 text-center"
    style={{
      top: "calc(25% + 140px)",
      left: "50%",
      transform: "translateX(-50%)",
      animation: "envelope-drop 0.6s ease-out 4.5s forwards",
      opacity: 0,
    }}
  >
    <p
      className="text-base tracking-widest"
      style={{
        color: "hsl(280, 60%, 55%)",
        fontFamily: "'Quicksand', sans-serif",
        fontWeight: 700,
        direction: "rtl",
      }}
    >
      اضغط
    </p>
  </div>
);

const OpeningEnvelope = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative">
      <svg width="280" height="300" viewBox="0 0 280 300">
        <g className="animate-card-rise">
          <rect x="50" y="100" width="180" height="130" rx="6" fill="white" stroke="hsl(340, 82%, 52%)" strokeWidth="1.5" />
          <text x="140" y="165" textAnchor="middle" fontSize="14" fill="hsl(340, 82%, 52%)" fontFamily="Dancing Script" fontWeight="700">
            عيد مبارك
          </text>
        </g>
        <rect x="10" y="140" width="260" height="150" rx="8" fill="#fcdce1" stroke="hsl(20, 50%, 40%)" strokeWidth="2" />
        <g style={{ transformOrigin: "140px 140px" }} className="animate-flap-open">
          <path d="M10,140 L140,220 L270,140" fill="#fcdce1" stroke="hsl(20, 50%, 40%)" strokeWidth="2" />
        </g>
        <path d="M10,290 L110,210" stroke="hsl(20, 50%, 40%)" strokeWidth="1" opacity="0.3" />
        <path d="M270,290 L170,210" stroke="hsl(20, 50%, 40%)" strokeWidth="1" opacity="0.3" />
      </svg>
    </div>
  );
};

const GreetingCardContent = () => (
  <div
    className="relative rounded-2xl p-8 md:p-12 animate-card-expand max-w-md w-full mx-4"
    style={{
      background: "linear-gradient(145deg, hsl(160, 40%, 97%), hsl(45, 60%, 95%), hsl(160, 30%, 97%))",
      boxShadow: "0 25px 60px -15px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.6)",
      border: "2px solid hsl(45, 70%, 75%)",
    }}
  >
    <div className="absolute top-3 left-3 text-2xl" style={{ animation: "sparkle 2s ease-in-out infinite" }}>✨</div>
    <div className="absolute top-3 right-3 text-2xl" style={{ animation: "sparkle 2s ease-in-out 0.5s infinite" }}>✨</div>
    <div className="absolute bottom-3 left-3 text-2xl" style={{ animation: "sparkle 2s ease-in-out 1s infinite" }}>🌟</div>
    <div className="absolute bottom-3 right-3 text-2xl" style={{ animation: "sparkle 2s ease-in-out 1.5s infinite" }}>🌟</div>

    <div className="text-center mb-4 animate-text-reveal" style={{ animationDelay: "0.3s", opacity: 0, animationFillMode: "forwards" }}>
      <span className="text-4xl">🌙</span>
    </div>

    <h1
      className="text-center mb-1 animate-text-reveal"
      style={{
        fontFamily: "'Dancing Script', cursive",
        fontSize: "clamp(2rem, 6vw, 3rem)",
        color: "#FF69B4",
        animationDelay: "0.5s",
        opacity: 0,
        animationFillMode: "forwards",
        textShadow: "0 2px 14px rgba(255,105,180,0.3)",
        direction: "rtl",
      }}
    >
      عيد مبارك
    </h1>

    <p
      className="text-center animate-text-reveal"
      style={{
        fontFamily: "'Dancing Script', cursive",
        fontSize: "1.2rem",
        color: "#FF69B4",
        animationDelay: "0.55s",
        opacity: 0,
        animationFillMode: "forwards",
      }}
    >
      Eid Mubarak
    </p>

    <div className="flex items-center justify-center gap-2 my-4 animate-text-reveal" style={{ animationDelay: "0.7s", opacity: 0, animationFillMode: "forwards" }}>
      <div className="h-px w-12" style={{ background: "linear-gradient(to right, transparent, hsl(45, 80%, 55%))" }} />
      <span className="text-lg">😊❤️❤️</span>
      <div className="h-px w-12" style={{ background: "linear-gradient(to left, transparent, hsl(45, 80%, 55%))" }} />
    </div>

    <p
      className="text-center text-base md:text-lg leading-relaxed animate-text-reveal"
      style={{
        fontFamily: "'Quicksand', sans-serif",
        fontWeight: 500,
        color: "hsl(195, 80%, 38%)",
        animationDelay: "0.9s",
        opacity: 0,
        animationFillMode: "forwards",
        direction: "rtl",
      }}
    >
      كل عام وأنتم بخير، أعاده الله عليكم بالخير واليُمن والبركات.
      تقبل الله صيامكم وقيامكم وصالح أعمالكم 🤲
    </p>

    <div className="flex justify-center gap-3 mt-6">
      {["🌙", "⭐", "🕌", "🎊", "🤲"].map((emoji, i) => (
        <span
          key={i}
          className="text-2xl animate-bounce-in"
          style={{ animationDelay: `${1.1 + i * 0.1}s`, opacity: 0, animationFillMode: "forwards" }}
        >
          {emoji}
        </span>
      ))}
    </div>

    <p
      className="text-center mt-6 animate-text-reveal"
      style={{
        fontFamily: "'Dancing Script', cursive",
        fontSize: "1.3rem",
        color: "hsl(280, 65%, 55%)",
        animationDelay: "1.6s",
        opacity: 0,
        animationFillMode: "forwards",
        direction: "rtl",
      }}
    >
      تقبّل الله منا ومنكم 💚
    </p>
  </div>
);

type Step = "envelope" | "opening" | "card";

const GreetingCard = () => {
  const [step, setStep] = useState<Step>("envelope");
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (step !== "envelope") return;
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      }, 3000);
      return () => clearInterval(interval);
    }, 4500);
    return () => clearTimeout(startDelay);
  }, [step]);

  const handleEnvelopeClick = useCallback(() => {
    setStep("opening");
  }, []);

  const handleOpeningComplete = useCallback(() => {
    setStep("card");
  }, []);

  const balloonPositions = [
    { left: "5%", top: "10%" },
    { left: "85%", top: "5%" },
    { left: "15%", top: "25%" },
    { left: "75%", top: "20%" },
    { left: "0%", top: "40%" },
    { left: "90%", top: "35%" },
    { left: "10%", top: "55%" },
    { left: "80%", top: "50%" },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center overflow-hidden relative"
      style={{
        background: step === "card"
          ? "linear-gradient(135deg, hsl(280, 40%, 95%) 0%, hsl(340, 50%, 95%) 30%, hsl(45, 60%, 95%) 60%, hsl(200, 50%, 95%) 100%)"
          : "white",
        transition: "background 1.5s ease",
      }}
    >
      {step === "envelope" && (
        <>
          <PurpleBullet />
          <HangingLanterns delay={3.4} />
          <DroppingEnvelope onClick={handleEnvelopeClick} isShaking={isShaking} />
          <TapHint />
        </>
      )}

      {step === "opening" && (
        <OpeningEnvelope onComplete={handleOpeningComplete} />
      )}

      {step === "card" && (
        <>
          <Confetti count={60} />
          {balloonPositions.map((pos, i) => (
            <Balloon
              key={i}
              color={BALLOON_COLORS[i % BALLOON_COLORS.length]}
              style={{ left: pos.left, top: pos.top }}
              delay={0.2 + i * 0.15}
            />
          ))}
          <Hearts />
          <GreetingCardContent />
        </>
      )}
    </div>
  );
};

export default GreetingCard;
