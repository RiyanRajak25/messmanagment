import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  isHoverable?: boolean;
  className?: string;
  badge?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  isHoverable = false,
  className = '',
  badge,
  ...props
}) => {
  return (
    <motion.div
      whileHover={
        isHoverable
          ? {
              y: -2,
              boxShadow: '0 4px 12px rgba(20, 28, 16, 0.06)',
            }
          : undefined
      }
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={`relative bg-white border border-sand rounded-card p-6 shadow-subtle ${className}`}
      {...props}
    >
      {badge && <div className="absolute -top-3 right-6 z-10">{badge}</div>}
      {children}
    </motion.div>
  );
};

export default Card;
