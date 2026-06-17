import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { Adda247Logo } from './Adda247Logo';

interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-2xl w-full mx-auto p-6 md:p-12 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-red-100 text-center relative overflow-hidden"
    >
      {/* Decorative background elements inside the card */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-50/50 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-50/50 rounded-full blur-2xl"></div>

      <div className="relative z-10">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
          className="flex justify-center mb-4 sm:mb-6"
        >
          <div className="bg-white/80 p-3 sm:p-4 rounded-2xl shadow-sm border border-slate-100">
            <Adda247Logo className="scale-110 sm:scale-125 origin-center" />
          </div>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-3xl font-serif font-semibold text-slate-800 mb-4 sm:mb-6 leading-relaxed sm:leading-relaxed tracking-tight"
        >
          Dad has always believed in us... now it's our turn to make him proud of our success. ❤️
        </motion.h2>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <p className="text-base md:text-xl text-slate-700 font-sans leading-relaxed max-w-lg mx-auto">
            Let's take a pledge this Father's Day — <br className="hidden md:block"/>
            <strong className="text-[#EB3237] block mt-2 text-lg sm:text-xl md:text-2xl font-serif">We will make Dad's dreams come true through our hard work. 📚✨</strong>
          </p>
          <span className="inline-block mt-3 sm:mt-4 text-[10px] sm:text-sm font-medium text-slate-400 tracking-widest uppercase">— Adda247</span>
        </motion.div>
        
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          onClick={onStart}
          className="group relative inline-flex justify-center items-center py-4 px-10 border border-transparent rounded-full shadow-xl text-lg font-medium text-white bg-[#EB3237] hover:bg-[#D32F2F] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all active:scale-95 overflow-hidden"
        >
          <span className="relative z-10">Take the Pledge</span>
          <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
        </motion.button>
      </div>
    </motion.div>
  );
}
