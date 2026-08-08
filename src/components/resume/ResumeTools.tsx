"use client";

import { motion } from 'framer-motion';
import type { Node } from '@/data/nodes';

export default function ResumeTools({ tools }: { tools: NonNullable<Node['tools']> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="w-full mb-12 space-y-6"
    >
      <div>
        <p className="text-xs tracking-widest uppercase text-burgundy mb-3 text-center">Desarrollo</p>
        <div className="flex flex-wrap justify-center gap-2">
          {tools.digital.map(tool => (
            <span key={tool} className="px-3 py-1 border border-gold/20 text-gold/70 text-sm tracking-wide rounded-lg">
              {tool}
            </span>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs tracking-widest uppercase text-burgundy mb-3 text-center">Diseño de Modas</p>
        <div className="flex flex-wrap justify-center gap-2">
          {tools.diseno.map(tool => (
            <span key={tool} className="px-3 py-1 border border-burgundy/40 text-gold/70 text-sm tracking-wide rounded-lg">
              {tool}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
