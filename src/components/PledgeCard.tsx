import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { toPng } from 'html-to-image';
import { Download, Share2, ArrowLeft, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PledgeData } from '../types';
import { Adda247Logo } from './Adda247Logo';

interface PledgeCardProps {
  data: PledgeData;
  onReset: () => void;
}

export function PledgeCard({ data, onReset }: PledgeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Fire confetti when the pledge card is successfully generated/shown
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#EB3237', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#EB3237', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      setIsGenerating(true);
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        style: {
           transform: 'none',
           borderRadius: '0',
           boxShadow: 'none'
        }
      });
      const link = document.createElement('a');
      link.download = `First_Salary_Pledge_${data.candidateName.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    const shareText = `Dear Dad,\nMy Father's Day gift is slightly delayed this year. I promise to hand over my first ${data.targetExam} salary to you this year.\n\nWith love & dedication,\n${data.candidateName}\n\n#FathersDay #Adda247`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My First Salary Pledge',
          text: shareText,
        });
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Share failed', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Pledge copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy text', err);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
      className="w-full max-w-2xl mx-auto flex flex-col items-center"
    >
      <div className="relative p-4 md:p-8 w-full">
        <div
          ref={cardRef}
          className="relative bg-[#ffffff] overflow-hidden shadow-2xl rounded-sm w-full max-w-[650px] mx-auto border-4 sm:border-8 border-double border-[#EB3237]/10 p-1 sm:p-2"
        >
          <div className="relative border border-[#EB3237]/20 h-full p-5 sm:p-8 md:p-10 min-h-[380px] md:min-h-[420px] flex flex-col justify-between"
             style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.96)), url("https://www.transparenttextures.com/patterns/rice-paper-2.png")' }}
          >
            {/* Top Logo and Stampp */}
            <div className="flex justify-between items-start mb-6 md:mb-10 w-full relative z-10">
              <Adda247Logo />
              <div className="border border-[#EB3237]/40 text-[#EB3237] px-2 py-0.5 rotate-3 text-[10px] font-bold uppercase tracking-wider bg-[#EB3237]/5">
                First Salary Pledge
              </div>
            </div>

            {/* Faint watermark circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] border border-[#EB3237]/5 rounded-full pointer-events-none flex items-center justify-center">
              <div className="w-[180px] sm:w-[250px] h-[180px] sm:h-[250px] border border-[#EB3237]/5 rounded-full"></div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row gap-5 md:gap-8 min-h-[160px] md:min-h-[220px]">
              <div className="space-y-4 md:space-y-6 flex-1">
                <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-slate-800 italic">
                  Dear Dad,
                </h3>
                
                <div className="font-serif text-lg sm:text-xl md:text-2xl text-slate-700 leading-relaxed md:leading-loose max-w-[95%] md:max-w-[90%]">
                  My Father's Day gift is slightly delayed this year.
                </div>

                <div className="font-serif text-lg sm:text-xl md:text-2xl text-slate-700 leading-relaxed md:leading-loose">
                  I promise to hand over my first{' '}
                  <strong className="text-[#EB3237] font-semibold border-b border-[#EB3237]/30 pb-0.5 px-1 bg-[#EB3237]/5 mx-1">
                    {data.targetExam}
                  </strong>
                  salary to you this year.
                </div>
              </div>

              {data.photoUrl && (
                <div className="hidden md:block w-36 sm:w-48 shrink-0 rotate-3 transition-transform hover:rotate-0 origin-center self-start mt-4">
                  <div className="bg-white p-2 pb-8 shadow-md border border-slate-200 w-full relative">
                    <div className="w-full aspect-square bg-slate-100 overflow-hidden break-inside-avoid">
                      <img src={data.photoUrl} alt="Memory with Dad" className="w-full h-full object-cover" crossOrigin="anonymous" />
                    </div>
                    {/* Simulated Tape */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-yellow-100/80 rotate-2 border border-yellow-200/50 shadow-sm"></div>
                  </div>
                </div>
              )}
            </div>

            {data.photoUrl && (
                <div className="md:hidden mt-6 w-36 shrink-0 -rotate-2 origin-center self-center sm:self-start">
                  <div className="bg-white p-2 pb-6 shadow-md border border-slate-200 w-full relative">
                    <div className="w-full aspect-square bg-slate-100 overflow-hidden break-inside-avoid">
                      <img src={data.photoUrl} alt="Memory with Dad" className="w-full h-full object-cover" crossOrigin="anonymous" />
                    </div>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-5 bg-yellow-100/80 -rotate-2 border border-yellow-200/50 shadow-sm"></div>
                  </div>
                </div>
            )}

            <div className="mt-6 md:mt-10 flex flex-col items-end w-full relative z-10 pr-2">
              <span className="text-slate-500 font-serif text-base md:text-lg mb-1 md:mb-2 italic">With love & dedication,</span>
              <span className="font-handwriting text-3xl sm:text-4xl md:text-5xl text-[#EB3237] -rotate-2">
                {data.candidateName}
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-3 md:mt-4">RECORDED: {data.pledgeDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 md:mt-6 flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4 w-full max-w-[280px] sm:max-w-none px-4 sm:px-0">
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#EB3237] text-white rounded-lg hover:bg-[#D32F2F] transition-all shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {isGenerating ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          <span className="font-medium">{isGenerating ? 'Generating...' : 'Download Card'}</span>
        </button>
        
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all shadow-lg active:scale-95 w-full sm:w-auto"
        >
          <Share2 className="w-5 h-5" />
          <span className="font-medium">Share</span>
        </button>

        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95 w-full sm:w-auto"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Create Another</span>
        </button>
      </div>
    </motion.div>
  );
}
