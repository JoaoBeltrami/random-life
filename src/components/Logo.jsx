import { Dice5 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Logo() {
  const [showBubble, setShowBubble] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [easterEggActive, setEasterEggActive] = useState(false);
  const hoverTimerRef = useRef(null);
  const resetTimerRef = useRef(null);

  const toggleBubble = () => setShowBubble((prev) => !prev);

  const showOnHover = () => {
    setHovering(true);
    setShowBubble(true);

    // Inicia o temporizador do easter egg
    hoverTimerRef.current = setTimeout(() => {
      setEasterEggActive(true);
      resetTimerRef.current = setTimeout(() => {
        setEasterEggActive(false);
      }, 30000); // Dura 30 segundos
    }, 20000); // Ativa após 20 segundos de hover
  };

  const hideOnLeave = () => {
    setHovering(false);
    setShowBubble(false);
    clearTimeout(hoverTimerRef.current);
  };

  useEffect(() => {
    return () => {
      clearTimeout(hoverTimerRef.current);
      clearTimeout(resetTimerRef.current);
    };
  }, []);

  return (
    <div
      className="relative flex flex-col items-center justify-center cursor-pointer select-none"
      onClick={toggleBubble}
      onMouseEnter={showOnHover}
      onMouseLeave={hideOnLeave}
      aria-label="Logo com easter egg"
    >
      <AnimatePresence mode="wait">
        {!easterEggActive && (
          <motion.div
            key="normal-logo"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <motion.div
              animate={hovering ? { rotate: 360 } : { rotate: 0 }}
              transition={{
                repeat: hovering ? Infinity : 0,
                duration: 2,
                ease: "linear",
              }}
            >
              <Dice5 className="w-16 h-16 md:w-24 md:h-24 text-white drop-shadow" />
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-widest drop-shadow-xl whitespace-nowrap">
              Life Randomizer
            </h1>
          </motion.div>
        )}

        {easterEggActive && (
          <motion.h1
            key="easter-egg"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-7xl md:text-9xl font-extrabold text-pink-500 drop-shadow-xl flex items-center justify-center select-none whitespace-nowrap"
            aria-label="Easter egg ativado: Mychelly coração"
          >
            Mychelly <span role="img" aria-label="coração">❤️</span>
          </motion.h1>
        )}
      </AnimatePresence>

      {/* Balão da frase */}
      <AnimatePresence>
        {showBubble && !easterEggActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full mt-4 bg-white text-black px-6 py-3 rounded-xl shadow-xl text-base md:text-lg font-semibold z-20"
          >
            <div className="relative">
              <span>O que você está afim de...?</span>
              <div className="absolute -top-2 left-6 w-3 h-3 bg-white rotate-45 shadow-md"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
