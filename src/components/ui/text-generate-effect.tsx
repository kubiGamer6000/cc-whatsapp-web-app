"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  onComplete,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  onComplete?: () => void;
}) => {
  const [scope, animate] = useAnimate();
  let wordsArray = words.split(" ").filter(word => word.length > 0);

  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(0.1),
      }
    ).then(() => {
      if (onComplete) {
        onComplete();
      }
    });
  }, [scope.current, animate, duration, filter, onComplete]);

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="leading-relaxed">
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            className="text-white opacity-0"
            style={{
              filter: filter ? "blur(4px)" : "none",
              marginRight: idx === wordsArray.length - 1 ? 0 : "0.4em",
              display: "inline-block",
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  return (
    <div className={cn("text-base font-normal", className)}>
      {renderWords()}
    </div>
  );
};