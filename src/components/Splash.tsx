import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function Splash() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1900);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "var(--lime)" }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-baseline"
          >
            <span
              className="uppercase leading-none text-black"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3.5rem, 18vw, 7rem)",
                letterSpacing: "-0.04em",
              }}
            >
              Practiq
            </span>
            <motion.span
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 18 }}
              className="ml-1"
              style={{
                fontFamily: "var(--font-serif-italic)",
                fontStyle: "italic",
                fontSize: "clamp(3.5rem, 18vw, 7rem)",
                lineHeight: 1,
                color: "black",
              }}
            >
              .
            </motion.span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="mt-4 italic text-black/70"
            style={{ fontFamily: "var(--font-serif-italic)", fontSize: "1.25rem" }}
          >
            learn / grow / achieve
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-16 h-[3px] w-40 origin-left bg-black"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}