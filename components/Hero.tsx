"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Sparkles,
  ChevronDown,
  ArrowRight,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { client } from "@/sanity/lib/backendClient";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 1.2,
        ease: "easeOut",
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.5,
      },
    },
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            initial={{
              x:
                typeof window !== "undefined"
                  ? Math.random() * window.innerWidth
                  : 0,
              y:
                typeof window !== "undefined"
                  ? Math.random() * window.innerHeight
                  : 0,
            }}
            animate={{
              y: [0, typeof window !== "undefined" ? window.innerHeight : 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <motion.div
            className="space-y-8"
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={textVariants}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm"
              animate={floatingAnimation}
            >
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium">
                The Future of Networking
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl lg:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-200"
              variants={textVariants}
            >
              Digital Business Cards
              <br />
              <span className="text-white">Reimagined</span>
            </motion.h1>

            <motion.p
              className="text-xl text-blue-200 max-w-xl"
              variants={textVariants}
            >
              Make a lasting impression with interactive digital business cards.
              Share your story, showcase your brand, and connect instantly with
              anyone, anywhere.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 pt-4"
              variants={textVariants}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-white gap-2 rounded-full relative overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 hover:from-cyan-500 hover:via-blue-600 hover:to-indigo-600"
              >
                <span className="relative z-10 flex items-center">
                  Create Your Card{" "}
                  <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-white/30 backdrop-blur-sm hover:bg-white/10 gap-2 bg-slate rounded-full relative overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
              >
                <span className="relative z-10 flex items-center">
                  View Gallery <CreditCard className="w-5 h-5 ml-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-600 opacity-0 hover:opacity-20 transition-opacity duration-300" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Right column - Animated card */}
          <motion.div
            className="relative perspective"
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={cardVariants}
          >
            <div className="relative w-full aspect-video max-w-lg mx-auto">
              {/* Main card */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-400 via-blue-500 to-indigo-600 rounded-2xl shadow-2xl"
                style={{ perspective: "1000px" }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 10,
                  transition: { duration: 0.3 },
                }}
              >
                <div className="p-8 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">Emad Khabeer</h3>
                      <p className="text-sm opacity-80">Product Designer</p>
                    </div>
                    <motion.div
                      className="w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm"
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="h-1 w-16 bg-white/30 rounded-full" />
                    <div className="flex items-center justify-between">
                      <div className="w-24 h-24 bg-white/20 rounded-lg backdrop-blur-sm p-2">
                        <QrCode className="w-full h-full text-white/90" />
                      </div>
                      <div className="space-y-2">
                        <div className="w-32 h-2 bg-white/20 rounded-full" />
                        <div className="w-24 h-2 bg-white/20 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating elements */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-16 h-16 bg-white/10 rounded-xl backdrop-blur-sm"
                  style={{
                    top: `${20 + i * 30}%`,
                    right: `-${20 + i * 10}%`,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="w-6 h-6 opacity-50" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
