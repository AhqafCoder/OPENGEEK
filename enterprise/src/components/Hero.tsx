"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
// import { Cover } from "@/components/ui/cover";
// import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import Squares from "@/components/ui/Squares";

export function Hero() {
  return (
    <section className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-black antialiased relative overflow-hidden py-12 sm:py-20 md:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Base black background */}
        <div className="absolute inset-0 bg-black" />
        
        {/* Interactive squares layer */}
        <div className="absolute inset-0">
          <Squares 
            speed={0.5} 
            squareSize={50}
            direction='diagonal'
            borderColor='rgba(255, 255, 255, 0.1)'
            hoverFillColor='rgba(0, 0, 0, 0.3)'
          />
        </div>

        {/* Edge fade gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_70%,rgba(0,0,0,0.95)_100%)]" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-6 sm:mb-8 flex justify-center"
        >
          <div className="relative rounded-full px-3 py-1 text-xs sm:text-sm leading-6 text-white/80 ring-1 ring-white/20 hover:ring-white/30 backdrop-blur-sm">
            Start earning while learning{" "}
            <a href="#" className="font-semibold text-white hover:text-white/80">
               Join now <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mx-auto text-center mt-4 sm:mt-6 relative z-20 py-4 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/80"
        >
          Enterprise Solutions<br/>
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-white/90 to-blue-500">
            Elevate Your Business
          </span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-4 bg-transparent sm:mt-6 mb-6 sm:mb-10 text-sm sm:text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed px-4 backdrop-blur-sm"
        >
          Transform your business with cutting-edge web development, mobile applications, and comprehensive IT solutions that drive growth and innovation.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 px-4"
        >
          <Link href="/chat" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              className="w-full sm:w-auto group relative text-sm sm:text-base font-medium bg-gradient-to-r from-white/90 via-white/90 to-white/90 text-black hover:from-white hover:via-white hover:to-white transition-all duration-300 h-10 sm:h-12 px-4 sm:px-8 overflow-hidden rounded-lg shadow-[0_0_0_1px_rgba(255,255,255,0.2)] hover:shadow-[0_0_0_2px_rgba(255,255,255,0.4),0_4px_6px_-1px_rgba(255,255,255,0.1),0_2px_4px_-1px_rgba(255,255,255,0.06)] backdrop-blur-sm"
            >
              <span className="relative z-10 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Live Chat
                </div>
                <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </Link>
          <Link href="/join" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto text-sm sm:text-base font-medium bg-black/30 text-white hover:text-white hover:bg-black/50 transition-all duration-300 h-10 sm:h-12 px-4 sm:px-8 overflow-hidden rounded-lg border border-white/20 hover:border-white/40 backdrop-blur-sm shadow-[0_0_0_1px_rgba(255,255,255,0.1)] hover:shadow-[0_0_0_2px_rgba(255,255,255,0.2),0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]"
            >
              Join Community
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}