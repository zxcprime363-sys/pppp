"use client";

import { motion } from "framer-motion";

export default function EqBars() {
  const bars = [1, 1.5, 0.8, 1.2];

  return (
    <div className="flex gap-0.5 items-end h-4">
      {bars.map((scale, i) => (
        <motion.span
          key={i}
          className="w-1 bg-white rounded-t-xs origin-bottom"
          style={{ height: `${scale * 12}px` }}
          animate={{
            scaleY: [0.2, 1, 0.2], // up & down
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}
