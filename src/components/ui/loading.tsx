import React from 'react';
import { motion } from 'framer-motion';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  fullscreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'md',
  fullscreen = false
}) => {
  const sizes = {
    sm: {
      logo: 'w-12 h-12',
      glow: 'w-32 h-32',
      secondaryGlow: 'w-24 h-24'
    },
    md: {
      logo: 'w-16 h-16',
      glow: 'w-48 h-48',
      secondaryGlow: 'w-32 h-32'
    },
    lg: {
      logo: 'w-24 h-24',
      glow: 'w-64 h-64',
      secondaryGlow: 'w-48 h-48'
    }
  };

  const Container = fullscreen ? 'div' : motion.div;
  const containerProps = fullscreen ? {
    className: "fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50"
  } : {
    className: "flex flex-col items-center justify-center min-h-[200px] relative"
  };

  return (
    <Container {...containerProps}>
      <div className="relative">
        {/* Primary glow */}
        <motion.div
          className={`absolute ${sizes[size].glow} bg-white rounded-full filter blur-[100px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2`}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.15, 0.25, 0.15],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Secondary glow */}
        <motion.div
          className={`absolute ${sizes[size].secondaryGlow} bg-white rounded-full filter blur-[50px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2`}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0.7 }}
          animate={{ 
            scale: [0.9, 1, 0.9],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative"
        >
          <img 
            src="/icon_512x512_transparent.png" 
            alt="Loading"
            className={`${sizes[size].logo} relative z-10`}
          />
        </motion.div>
      </div>
    </Container>
  );
};

export default Loading;