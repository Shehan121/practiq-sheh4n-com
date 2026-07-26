import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import { useRef, type ReactNode } from "react";

const RANGE = 340; // px of travel at speed=1; higher = more pronounced parallax

export function Parallax({
  children,
  speed = 0.3,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rawY = useTransform(scrollYProgress, [0, 1], [RANGE * speed, -RANGE * speed]);
  // Spring-smooth the raw scroll-driven value so parallax settles with a
  // touch of inertia instead of tracking scroll position 1:1 — reads as
  // silkier when paired with Lenis's smoothed scroll.
  const y = useSpring(rawY, { stiffness: 120, damping: 24, mass: 0.5 });
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

export function useParallaxY(scroll: MotionValue<number>, distance = 100) {
  return useTransform(scroll, [0, 1], [0, -distance]);
}