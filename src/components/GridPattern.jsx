import React from 'react';
import { motion } from 'framer-motion';

const GridPattern = ({ width = 40, height = 40, x = -1, y = -1, color = 'rgba(139, 92, 246, 0.1)' }) => {
  return (
    <motion.svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <defs>
        <pattern
          id="grid-pattern"
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 .5H${width - 0.5}V${height - 0.5}H.5z`} fill="none" stroke={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill="url(#grid-pattern)" />
    </motion.svg>
  );
};

export default GridPattern;