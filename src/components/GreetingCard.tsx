import { useState, useEffect, useCallback, useRef } from "react";
import lanternImg from "@/assets/lantern.png";
import { Volume2, VolumeX, Download } from "lucide-react";
import html2canvas from "html2canvas";

// Music configuration - adjust these values
const MUSIC_CONFIG = {
  startDelay: 0, // milliseconds before music starts (0 = immediate)
  volume: 0.3, // volume level (0 to 1)
  loop: true, // whether to loop the music
  autoPlay: true, // whether to auto-play when card opens
  loopStartTime: 28, // seconds to jump to when looping (0 = start from beginning)
  startTime: 28, // seconds to start playing from
};

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

const TapHint = ({ language }: { language: "en" | "ar" }) => {
  const text = language === "en" ? "Click" : "اضغط";
  return (
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
          direction: language === "ar" ? "rtl" : "ltr",
        }}
      >
        {text}
      </p>
    </div>
  );
};

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

const GreetingCardContent = ({ language, setLanguage, isMuted, toggleMute }: { language: "en" | "ar"; setLanguage: (lang: "en" | "ar") => void; isMuted: boolean; toggleMute: () => void }) => {
  const [visitorName, setVisitorName] = useState("");
  const [showGreeting, setShowGreeting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Check if name is "Ilyes" (case-insensitive)
  const isSpecialGuest = visitorName.toLowerCase() === "ilyes";

  const translations = {
    en: {
      welcome: "Welcome to Eid",
      enterName: "Enter your name...",
      celebrate: "Celebrate with Me",
      download: "Download Card",
      greetingTitle: "Eid Mubarak",
      greetingMessage: "Wishing you a blessed Eid filled with joy, peace, and prosperity.\nMay Allah accept your fasting and prayers 🤲",
      closing: "May Allah accept from us and from you 💚",
    },
    ar: {
      welcome: "أهلا وسهلا",
      enterName: "أدخل اسمك...",
      celebrate: "احتفل معي",
      download: "تحميل البطاقة",
      greetingTitle: "عيد مبارك",
      greetingMessage: "كل عام وأنتم بخير، أعاده الله عليكم بالخير واليُمن والبركات.\nتقبل الله صيامكم وقيامكم وصالح أعمالكم 🤲",
      closing: "تقبّل الله منا ومنكم 💚",
    },
  };

  const specialGreeting = {
    en: {
      title: "Dear Teacher",
      message: "Eid is an opportunity to thank hearts that give without return. May your Eid be blessed and may you have eternal years of joy.\nThank you for every letter you taught us and every advice you gave us from your heart.\nMay Allah bless your health and your family, and make all your days celebrations and happiness.",
      closing: "With deep respect and gratitude 🙏",
    },
    ar: {
      title: "أستاذي العزيز",
      message: "العيد فرصة لنشكر القلوب التي تعطي دون مقابل إن شاء الله عيدك مبروك وسنين دايمة.\nيعطيك الصحة على كل حرف علمتو لنا وكل نصيحة عطيتها لنا من قلبك.\nربي يبارك لك في صحتك وفي عائلتك ويجعل أيامك الكل أعياد ومسرات.",
      closing: "بكل احترام وتقدير 🙏",
    },
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (visitorName.trim()) {
      setShowGreeting(true);
    }
  };

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: "#ffffff",
          scale: 2,
        });
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `eid-card-${visitorName || "greeting"}.png`;
        link.click();
      } catch (error) {
        console.error("Error downloading card:", error);
      }
    }
  };

  return (
    <div
      ref={cardRef}
      className="relative rounded-3xl p-4 md:p-6 animate-card-expand max-w-xs w-full mx-4 backdrop-blur-sm"
      style={{
        background: isSpecialGuest 
          ? "linear-gradient(135deg, rgba(30, 64, 175, 0.15) 0%, rgba(59, 130, 246, 0.12) 25%, rgba(96, 165, 250, 0.15) 50%, rgba(147, 197, 253, 0.12) 75%, rgba(191, 219, 254, 0.15) 100%)"
          : "linear-gradient(135deg, rgba(255, 105, 180, 0.15) 0%, rgba(138, 43, 226, 0.12) 25%, rgba(30, 144, 255, 0.15) 50%, rgba(50, 205, 50, 0.12) 75%, rgba(255, 215, 0, 0.15) 100%)",
        boxShadow: isSpecialGuest
          ? "0 25px 60px -15px rgba(30, 64, 175, 0.4), inset 0 1px 0 rgba(255,255,255,0.8), 0 0 40px rgba(30, 64, 175, 0.2)"
          : "0 25px 60px -15px rgba(138, 43, 226, 0.4), inset 0 1px 0 rgba(255,255,255,0.8), 0 0 40px rgba(138, 43, 226, 0.2)",
        border: isSpecialGuest
          ? "2px solid rgba(30, 64, 175, 0.4)"
          : "2px solid rgba(138, 43, 226, 0.4)",
      }}
    >
      <div className="absolute top-3 left-3 text-2xl" style={{ animation: "sparkle 2s ease-in-out infinite" }}>✨</div>
      <div className="absolute top-3 right-3 text-2xl" style={{ animation: "sparkle 2s ease-in-out 0.5s infinite" }}>✨</div>
      <div className="absolute bottom-3 left-3 text-2xl" style={{ animation: "sparkle 2s ease-in-out 1s infinite" }}>🌟</div>
      <div className="absolute bottom-3 right-3 text-2xl" style={{ animation: "sparkle 2s ease-in-out 1.5s infinite" }}>🌟</div>

      {!showGreeting ? (
        <>
          <div className="text-center mb-3 animate-text-reveal" style={{ animationDelay: "0.3s", opacity: 0, animationFillMode: "forwards" }}>
            <span className="text-3xl">🌙</span>
          </div>

          <div className="flex justify-end mb-3">
            <button
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="px-2 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-105"
              style={{
                background: "rgba(138, 43, 226, 0.2)",
                color: "#8A2BE2",
                border: "1px solid rgba(138, 43, 226, 0.4)",
              }}
            >
              {language === "en" ? "العربية" : "English"}
            </button>
          </div>

          <h2
            className="text-center mb-3 animate-text-reveal"
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: "1.5rem",
              color: "#8A2BE2",
              animationDelay: "0.5s",
              opacity: 0,
              animationFillMode: "forwards",
              textShadow: "0 2px 14px rgba(138, 43, 226, 0.3)",
              direction: language === "ar" ? "rtl" : "ltr",
            }}
          >
            {translations[language].welcome}
          </h2>

          <form onSubmit={handleNameSubmit} className="animate-text-reveal" style={{ animationDelay: "0.7s", opacity: 0, animationFillMode: "forwards" }}>
            <input
              type="text"
              placeholder={translations[language].enterName}
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border-2 border-purple-300 focus:border-purple-500 focus:outline-none text-center mb-3 transition-all text-sm"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                fontFamily: "'Quicksand', sans-serif",
                color: "#333",
                direction: language === "ar" ? "rtl" : "ltr",
              }}
            />
            <button
              type="submit"
              className="w-full py-2 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 text-sm"
              style={{
                background: "linear-gradient(135deg, #FF69B4 0%, #8A2BE2 100%)",
                color: "white",
                fontFamily: "'Quicksand', sans-serif",
                boxShadow: "0 4px 15px rgba(138, 43, 226, 0.4)",
              }}
            >
              {translations[language].celebrate}
            </button>
          </form>
        </>
      ) : (
        <>
          <div className="text-center mb-2 animate-text-reveal" style={{ animationDelay: "0.3s", opacity: 0, animationFillMode: "forwards" }}>
            <span className="text-3xl">{isSpecialGuest ? "📚" : "🌙"}</span>
          </div>

          <h1
            className="text-center mb-1 animate-text-reveal"
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: "clamp(1.8rem, 6vw, 2.8rem)",
              color: isSpecialGuest ? "#1e40af" : "#FF69B4",
              animationDelay: "0.5s",
              opacity: 0,
              animationFillMode: "forwards",
              textShadow: isSpecialGuest ? "0 2px 14px rgba(30, 64, 175, 0.3)" : "0 2px 14px rgba(255,105,180,0.3)",
              direction: "rtl",
            }}
          >
            {isSpecialGuest ? (language === "en" ? specialGreeting.en.title : specialGreeting.ar.title) : "عيد مبارك"}
          </h1>

          <p
            className="text-center animate-text-reveal text-lg font-bold"
            style={{
              fontFamily: "'Dancing Script', cursive",
              color: isSpecialGuest ? "#1e40af" : "#8A2BE2",
              animationDelay: "0.55s",
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            {visitorName}
          </p>

          {!isSpecialGuest && (
            <p
              className="text-center animate-text-reveal text-sm"
              style={{
                fontFamily: "'Dancing Script', cursive",
                color: "#FF69B4",
                animationDelay: "0.6s",
                opacity: 0,
                animationFillMode: "forwards",
              }}
            >
              {language === "en" ? "Eid Mubarak" : "عيد مبارك"}
            </p>
          )}

          <div className="flex items-center justify-center gap-2 my-2 animate-text-reveal" style={{ animationDelay: "0.7s", opacity: 0, animationFillMode: "forwards" }}>
            <div className="h-px w-6" style={{ background: isSpecialGuest ? "linear-gradient(to right, transparent, #1e40af)" : "linear-gradient(to right, transparent, hsl(45, 80%, 55%))" }} />
            <span className="text-xl">{isSpecialGuest ? "📖✨📖" : "😊❤️❤️"}</span>
            <div className="h-px w-6" style={{ background: isSpecialGuest ? "linear-gradient(to left, transparent, #1e40af)" : "linear-gradient(to left, transparent, hsl(45, 80%, 55%))" }} />
          </div>

          <p
            className="text-center text-xs leading-relaxed animate-text-reveal whitespace-pre-line"
            style={{
              fontFamily: "'Quicksand', sans-serif",
              fontWeight: language === "ar" ? 700 : 500,
              color: isSpecialGuest ? "#1e40af" : "hsl(195, 80%, 38%)",
              animationDelay: "0.9s",
              opacity: 0,
              animationFillMode: "forwards",
              direction: language === "ar" ? "rtl" : "ltr",
            }}
          >
            {isSpecialGuest ? (language === "en" ? specialGreeting.en.message : specialGreeting.ar.message) : (language === "en" ? translations.en.greetingMessage : translations.ar.greetingMessage)}
          </p>

          <div className="flex justify-center gap-1 mt-2">
            {isSpecialGuest ? ["📚", "🎓", "✨", "🙏", "💙"].map((emoji, i) => (
              <span
                key={i}
                className="text-2xl animate-bounce-in"
                style={{ animationDelay: `${1.1 + i * 0.1}s`, opacity: 0, animationFillMode: "forwards" }}
              >
                {emoji}
              </span>
            )) : ["🌙", "⭐", "🕌", "🎊", "🤲"].map((emoji, i) => (
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
            className="text-center mt-2 animate-text-reveal text-xs"
            style={{
              fontFamily: "'Dancing Script', cursive",
              color: isSpecialGuest ? "#1e40af" : "hsl(280, 65%, 55%)",
              animationDelay: "1.6s",
              opacity: 0,
              animationFillMode: "forwards",
              direction: language === "ar" ? "rtl" : "ltr",
            }}
          >
            {isSpecialGuest ? (language === "en" ? specialGreeting.en.closing : specialGreeting.ar.closing) : (language === "en" ? translations.en.closing : translations.ar.closing)}
          </p>

          <button
            onClick={handleDownload}
            className="w-full mt-3 py-2 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 animate-text-reveal text-xs"
            style={{
              background: "linear-gradient(135deg, #FF69B4 0%, #8A2BE2 100%)",
              color: "white",
              fontFamily: "'Quicksand', sans-serif",
              boxShadow: "0 4px 15px rgba(138, 43, 226, 0.4)",
              animationDelay: "1.8s",
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            <Download size={16} />
            {translations[language].download}
          </button>

          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 transition-all hover:scale-110 active:scale-95 animate-text-reveal"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              animationDelay: "1.9s",
              opacity: 0,
              animationFillMode: "forwards",
            }}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={20} color="#ef4444" /> : <Volume2 size={20} color="#10b981" />}
          </button>
        </>
      )}
    </div>
  );
};

type Step = "envelope" | "opening" | "card";

const GreetingCard = () => {
  const [step, setStep] = useState<Step>("envelope");
  const [isShaking, setIsShaking] = useState(false);
  const [language, setLanguage] = useState<"en" | "ar">("en");

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
    setStep("card");
  }, []);

  const handleOpeningComplete = useCallback(() => {
    setStep("card");
  }, []);

  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (step === "card" && !isMuted && MUSIC_CONFIG.autoPlay) {
      const timer = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.volume = MUSIC_CONFIG.volume;
          audioRef.current.currentTime = MUSIC_CONFIG.startTime;
          audioRef.current.play().catch(e => console.log("Audio play failed:", e));
          setIsPlaying(true);
        }
      }, MUSIC_CONFIG.startDelay);
      return () => clearTimeout(timer);
    }
  }, [step, isMuted]);

  // Handle music loop point
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (MUSIC_CONFIG.loop && MUSIC_CONFIG.loopStartTime > 0) {
        // Check if we've reached near the end and loop back
        if (audio.duration && audio.currentTime >= audio.duration - 0.5) {
          audio.currentTime = MUSIC_CONFIG.loopStartTime;
        }
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = MUSIC_CONFIG.volume;
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      setIsMuted(!isMuted);
    }
  };

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
          : step === "envelope"
          ? "linear-gradient(-45deg, hsl(280, 60%, 70%), hsl(340, 70%, 75%), hsl(45, 80%, 70%), hsl(200, 70%, 75%))"
          : "white",
        backgroundSize: step === "envelope" ? "400% 400%" : "100% 100%",
        animation: step === "envelope" ? "gradient-shift 15s ease infinite" : "none",
        transition: "background 1.5s ease",
      }}
    >
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      {step === "envelope" && (
        <>
          <PurpleBullet />
          <HangingLanterns delay={3.4} />
          <DroppingEnvelope onClick={handleEnvelopeClick} isShaking={isShaking} />
          <TapHint language={language} />
        </>
      )}

      {step === "card" && (
        <>
          <audio
            ref={audioRef}
            src="/اغنية_العيد_اتانا_بالفرحة(48k).m4a"
            loop={MUSIC_CONFIG.loop}
            preload="auto"
          />
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
          <GreetingCardContent language={language} setLanguage={setLanguage} isMuted={isMuted} toggleMute={toggleMute} />
        </>
      )}
    </div>
  );
};

export default GreetingCard;
