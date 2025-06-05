import { Dice5 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Logo() {
  const [showBubble, setShowBubble] = useState(false);
  const [hovering, setHovering] = useState(false);

  const toggleBubble = () => setShowBubble((prev) => !prev);
  const showOnHover = () => {
    setHovering(true);
    setShowBubble(true);
  };
  const hideOnLeave = () => {
    setHovering(false);
    setShowBubble(false);
  };

  return (
    <div
      className="relative flex items-center justify-center flex-col cursor-pointer select-none"
      onClick={toggleBubble}
      onMouseEnter={showOnHover}
      onMouseLeave={hideOnLeave}
    >
      {/* Ícone e título */}
      <div className="flex items-center gap-4">
        <motion.div
          animate={hovering ? { rotate: 360 } : { rotate: 0 }}
          transition={{ repeat: hovering ? Infinity : 0, duration: 2, ease: "linear" }}
        >
          <Dice5 className="w-16 h-16 md:w-24 md:h-24 text-white drop-shadow" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-extrabold text-white tracking-widest drop-shadow-xl"
        >
          Life Randomizer
        </motion.h1>
      </div>

      {/* Balão da frase */}
      <AnimatePresence>
        {showBubble && (
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
