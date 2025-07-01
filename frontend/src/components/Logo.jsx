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

    hoverTimerRef.current = setTimeout(() => {
      setEasterEggActive(true);
      resetTimerRef.current = setTimeout(() => {
        setEasterEggActive(false);
      }, 30000);
    }, 20000);
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
          <motion.div
            key="easter-egg"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-4 select-none whitespace-nowrap drop-shadow-xl"
            aria-label="Easter egg ativado: Mychelly coração"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "linear",
              }}
            >
              <Dice5 className="w-16 h-16 md:w-24 md:h-24 text-white" />
            </motion.div>

            <motion.h1
              className="text-7xl md:text-9xl font-extrabold text-white"
              style={{
                WebkitTextStroke: "1.5px black",
                textStroke: "1.5px black",
                textShadow:
                  "0 1px 3px rgba(0, 0, 0, 0.15)", // sombra leve sutil
              }}
            >
              Mychelly
            </motion.h1>

            <span
              role="img"
              aria-label="coração"
              className="text-16 md:text-24" // para ficar do tamanho do dado
              style={{ lineHeight: 1 }}
            >
              ❤️
            </span>
          </motion.div>
        )}
      </AnimatePresence>

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
