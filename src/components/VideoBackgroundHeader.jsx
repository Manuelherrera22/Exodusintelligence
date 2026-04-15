import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const VideoBackgroundHeader = ({
  videoUrl,
  posterUrl,
  overlayColor = 'rgba(14, 24, 44, 0.7)',
  title,
  subtitle,
  ctaText,
  onCtaClick,
}) => {
  return (
    <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden flex items-center justify-center text-center text-white rounded-b-3xl shadow-2xl">
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={posterUrl}
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div
        className="absolute inset-0 z-10"
        style={{ backgroundColor: overlayColor }}
      ></div>
      <div className="relative z-20 p-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
        >
          {subtitle}
        </motion.p>
        {ctaText && onCtaClick && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              onClick={onCtaClick}
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-lg px-8 py-6 rounded-full shadow-lg shadow-amber-500/30 transform hover:scale-105 transition-all"
            >
              {ctaText}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VideoBackgroundHeader;