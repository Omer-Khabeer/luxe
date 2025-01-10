"use client";
import React from "react";
import { motion } from "framer-motion";

const AnimatedSVG = () => {
  const svgVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.5, ease: "easeInOut" },
    },
  };

  const pathVariants = {
    initial: { pathLength: 0, fillOpacity: 0 },
    animate: {
      pathLength: 1,
      fillOpacity: 1,
      transition: { duration: 2, ease: "easeInOut", delay: 0.5 },
    },
  };

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 740 490"
      width="740"
      height="490"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Animated SVG Illustration"
      variants={svgVariants}
      initial="initial"
      animate="animate"
    >
      <defs>
        <radialGradient id="gradient1" cx="50%" cy="50%" r="50%">
          <stop offset="23%" stopColor="rgb(21,31,52)" />
          <stop offset="62%" stopColor="rgb(17,26,44)" />
          <stop offset="100%" stopColor="rgb(13,21,36)" />
        </radialGradient>
        <radialGradient id="gradient2" cx="50%" cy="50%" r="50%">
          <stop offset="23%" stopColor="rgb(0,245,115)" />
          <stop offset="99%" stopColor="rgb(60,161,94)" />
        </radialGradient>
      </defs>

      <motion.circle
        cx="200"
        cy="200"
        r="100"
        fill="url(#gradient1)"
        variants={pathVariants}
      />
      <motion.circle
        cx="500"
        cy="300"
        r="80"
        fill="url(#gradient2)"
        variants={pathVariants}
      />
      <motion.rect
        x="150"
        y="350"
        width="400"
        height="100"
        rx="20"
        fill="url(#gradient1)"
        variants={pathVariants}
      />
    </motion.svg>
  );
};

export default AnimatedSVG;
