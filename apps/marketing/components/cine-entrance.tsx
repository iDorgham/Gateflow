'use client';

import * as React from 'react';
import { motion, useInView } from 'framer-motion';

interface CineEntranceProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  className?: string;
}

export function CineEntrance({
  children,
  delay = 0,
  duration = 0.8,
  direction = 'up',
  distance = 30,
  className = '',
}: CineEntranceProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  const getInitial = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance };
      case 'down':
        return { opacity: 0, y: -distance };
      case 'left':
        return { opacity: 0, x: distance };
      case 'right':
        return { opacity: 0, x: -distance };
      case 'none':
        return { opacity: 0 };
      default:
        return { opacity: 0, y: distance };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitial()}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : getInitial()}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Cine-Serious easing
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = '',
}: {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            delay: (child.props.delay || 0) + index * staggerDelay,
          });
        }
        return child;
      })}
    </div>
  );
}
