"use client";

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { useUIStore } from '@/store/useUIStore';

type Props = {
  id: string;
  title: string;
  text: string;
  children?: React.ReactNode;
  theme?: 'dark' | 'light' | 'accent';
  height?: 'screen' | 'double' | 'triple';
};

export default function ChapterSection({ 
  id, 
  title, 
  text, 
  children, 
  theme = 'dark',
  height = 'screen'
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { 
    margin: "-20% 0px -20% 0px",
    amount: 0.3
  });
  
  const { setCurrentChapter, reducedMotion } = useUIStore();

  useEffect(() => {
    if (inView) {
      setCurrentChapter(id);
    }
  }, [inView, id, setCurrentChapter]);

  const heightClasses = {
    screen: 'min-h-screen',
    double: 'min-h-[200vh]',
    triple: 'min-h-[300vh]',
  };

  const themeClasses = {
    dark: 'bg-[#0b0b0b] text-[#f5f5f5]',
    light: 'bg-[#f5f5f5] text-[#0b0b0b]',
    accent: 'bg-[#e8cfc4] text-[#0b0b0b]',
  };

  const variants = {
    hidden: { 
      opacity: 0, 
      y: 40, 
      filter: reducedMotion ? 'none' : 'blur(8px)' 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: {
        duration: reducedMotion ? 0 : 1,
        ease: [0.25, 0.1, 0.25, 1] as const,
        staggerChildren: 0.15
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: reducedMotion ? 0 : 0.6,
        ease: [0.25, 0.1, 0.25, 1] as const
      }
    }
  };

  return (
    <section 
      id={id} 
      ref={ref} 
      className={`relative ${heightClasses[height]} ${themeClasses[theme]} flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20`}
    >
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={variants}
        className="relative z-10 max-w-4xl w-full text-center"
      >
        <motion.h2 
          variants={childVariants}
          className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 md:mb-8 leading-[1.1]"
        >
          {title}
        </motion.h2>
        
        <motion.p 
          variants={childVariants}
          className="font-serif text-lg sm:text-xl md:text-2xl opacity-90 leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12 italic"
        >
          {text}
        </motion.p>
        
        {children && (
          <motion.div 
            variants={childVariants}
            className="mt-8 sm:mt-10 md:mt-12"
          >
            {children}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
