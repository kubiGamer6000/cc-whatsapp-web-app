import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import { Check, X } from 'lucide-react';
import { Task } from '../types';

interface SwipeableTaskCardProps {
  task: Task;
  onComplete: () => void;
  onCancel: () => void;
  children: React.ReactNode;
}

const SwipeableTaskCard = forwardRef<HTMLDivElement, SwipeableTaskCardProps>(({
  task,
  onComplete,
  onCancel,
  children
}, ref) => {
  const controls = useAnimation();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const bind = useDrag(({ movement: [x], direction: [xDir], active, cancel, tap }) => {
    // Don't handle swipes on desktop or for non-pending tasks
    if (!isMobile || task.status !== 'pending') {
      cancel();
      return;
    }

    if (tap) {
      cancel();
      return;
    }

    setIsDragging(active);
    
    // Calculate the drag percentage (0-1)
    const dragPercentage = Math.min(Math.abs(x) / (cardRef.current?.offsetWidth || 300), 1);
    
    if (active) {
      // While dragging
      controls.start({
        x,
        opacity: 1 - dragPercentage * 0.5,
        transition: { duration: 0 }
      });
    } else {
      // On release
      const threshold = 0.4; // 40% of the card width
      if (dragPercentage > threshold) {
        // Complete the swipe animation
        const finalX = xDir > 0 ? 300 : -300;
        controls.start({
          x: finalX,
          opacity: 0,
          transition: { duration: 0.2 }
        }).then(() => {
          // Execute the appropriate action
          if (xDir > 0) {
            onComplete();
          } else {
            onCancel();
          }
        });
      } else {
        // Return to original position
        controls.start({
          x: 0,
          opacity: 1,
          transition: { type: "spring", stiffness: 500, damping: 30 }
        });
      }
    }
  }, {
    axis: 'x',
    filterTaps: true,
    bounds: { left: -200, right: 200 },
  });

  if (!isMobile || task.status !== 'pending') {
    return <div ref={ref}>{children}</div>;
  }

  return (
    <div className="relative touch-pan-y" ref={ref}>
      {/* Action Indicators */}
      <AnimatePresence>
        {isDragging && (
          <>
            {/* Cancel Indicator (Left) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-red-400"
            >
              <X className="w-6 h-6 mr-2" />
              <span className="text-sm font-medium">Cancel</span>
            </motion.div>
            
            {/* Complete Indicator (Right) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center text-green-400"
            >
              <span className="text-sm font-medium">Complete</span>
              <Check className="w-6 h-6 ml-2" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Swipeable Card */}
      <motion.div
        ref={cardRef}
        {...bind()}
        animate={controls}
        className="touch-pan-y"
        style={{ touchAction: 'pan-y' }}
      >
        {children}
      </motion.div>
    </div>
  );
});

SwipeableTaskCard.displayName = 'SwipeableTaskCard';

export default SwipeableTaskCard;