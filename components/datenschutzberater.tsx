"use client";
import React, { useState, useEffect } from "react";
import {
  Shield,
  Lock,
  FileText,
  AlertCircle,
  Check,
  Eye,
  Server,
  ChevronRight,
} from "lucide-react";

const DatenschutzHeroV2 = () => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [hoveredButton, setHoveredButton] = useState(null);

  useEffect(() => {
    // Start animations after a short delay
    const timer = setTimeout(() => {
      setAnimationStarted(true);
    }, 300);

    // Cycle through features
    const featureInterval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(featureInterval);
    };
  }, []);

  const features = [
    {
      icon: <Shield size={24} />,
      title: "DSGVO-Compliance",
      description: "Vollständige Einhaltung der EU-Datenschutzgrundverordnung",
    },
    {
      icon: <Lock size={24} />,
      title: "Datensicherheit",
      description: "Implementierung robuster Sicherheitsmaßnahmen",
    },
    {
      icon: <FileText size={24} />,
      title: "Dokumentation",
      description: "Rechtssichere Verfahrensverzeichnisse und Richtlinien",
    },
    {
      icon: <AlertCircle size={24} />,
      title: "Risikoanalyse",
      description: "Identifikation und Bewertung von Datenschutzrisiken",
    },
  ];

  // Binary animation strings
  const generateRandomBinary = (length) => {
    return Array.from({ length }, () => (Math.random() > 0.5 ? "1" : "0")).join(
      ""
    );
  };

  const binaryStrings = [
    generateRandomBinary(16),
    generateRandomBinary(12),
    generateRandomBinary(14),
    generateRandomBinary(18),
    generateRandomBinary(10),
  ];

  return (
    <div className="relative w-full overflow-hidden bg-slate-900 text-white">
      {/* Abstract animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute h-px w-full bg-blue-400"
              style={{
                top: `${(i + 1) * 10}%`,
                transform: `translateX(${animationStarted ? "0" : "-100%"})`,
                transition: `transform 1.5s ease-out ${i * 0.1}s`,
              }}
            />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute w-px h-full bg-blue-400"
              style={{
                left: `${(i + 1) * 10}%`,
                transform: `translateY(${animationStarted ? "0" : "-100%"})`,
                transition: `transform 1.5s ease-out ${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        {/* Binary code animations */}
        <div className="absolute left-0 top-0 w-full h-full opacity-30">
          {binaryStrings.map((binary, i) => (
            <div
              key={`binary-${i}`}
              className="absolute text-xs text-blue-400 font-mono whitespace-nowrap"
              style={{
                left: `${Math.random() * 90}%`,
                top: `${Math.random() * 90}%`,
                opacity: animationStarted ? 0.3 + Math.random() * 0.4 : 0,
                transform: `translateY(${animationStarted ? "0" : "-20px"})`,
                transition: `all 0.8s ease-out ${0.5 + i * 0.2}s`,
                animation: `float-y ${2 + Math.random() * 3}s infinite ease-in-out ${Math.random() * 2}s`,
              }}
            >
              {binary}
            </div>
          ))}
        </div>

        {/* Circular elements */}
        <div
          className="absolute right-0 bottom-0 w-96 h-96 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 opacity-10"
          style={{
            transform: `translate(30%, 30%) ${animationStarted ? "scale(1)" : "scale(0)"}`,
            transition: "transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        />
        <div
          className="absolute left-0 top-0 w-64 h-64 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 opacity-10"
          style={{
            transform: `translate(-30%, -30%) ${animationStarted ? "scale(1)" : "scale(0)"}`,
            transition: "transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s",
          }}
        />
      </div>

      {/* Main content container */}
      <div className="relative container mx-auto px-6 py-16 md:py-28">
        <div className="flex flex-col md:flex-row gap-16">
          {/* Left column */}
          <div className="md:w-3/5">
            <div
              className="mb-4 inline-block bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent text-lg font-semibold tracking-wider"
              style={{
                opacity: animationStarted ? 1 : 0,
                transform: `translateY(${animationStarted ? "0" : "10px"})`,
                transition: "all 0.6s ease-out",
              }}
            >
              DATENSCHUTZ EXPERTISE
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              style={{
                opacity: animationStarted ? 1 : 0,
                transform: `translateY(${animationStarted ? "0" : "20px"})`,
                transition: "all 0.6s ease-out 0.1s",
              }}
            >
              Ihr Partner für <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                intelligenten Datenschutz
              </span>
            </h1>

            <p
              className="text-slate-300 text-lg mb-8 max-w-xl"
              style={{
                opacity: animationStarted ? 1 : 0,
                transform: `translateY(${animationStarted ? "0" : "20px"})`,
                transition: "all 0.6s ease-out 0.2s",
              }}
            >
              Wir bieten maßgeschneiderte Lösungen für die Herausforderungen der
              digitalen Welt. Professionelle Beratung für den gesetzeskonformen
              Umgang mit personenbezogenen Daten.
            </p>

            {/* CTA buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 mb-12"
              style={{
                opacity: animationStarted ? 1 : 0,
                transform: `translateY(${animationStarted ? "0" : "20px"})`,
                transition: "all 0.6s ease-out 0.3s",
              }}
            >
              <button
                className="relative px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-md font-medium text-white overflow-hidden group"
                onMouseEnter={() => setHoveredButton(0)}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <span className="relative z-10 flex items-center">
                  Kostenlose Erstberatung
                  <ChevronRight
                    size={16}
                    className="ml-2 transition-transform duration-300"
                    style={{
                      transform:
                        hoveredButton === 0
                          ? "translateX(4px)"
                          : "translateX(0)",
                    }}
                  />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button
                className="px-6 py-3 border border-blue-500 text-blue-400 hover:text-blue-300 rounded-md font-medium transition-colors duration-300 flex items-center"
                onMouseEnter={() => setHoveredButton(1)}
                onMouseLeave={() => setHoveredButton(null)}
              >
                Leistungen entdecken
                <ChevronRight
                  size={16}
                  className="ml-2 transition-transform duration-300"
                  style={{
                    transform:
                      hoveredButton === 1 ? "translateX(4px)" : "translateX(0)",
                  }}
                />
              </button>
            </div>

            {/* Features list */}
            <div>
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-start p-4 rounded-lg mb-3 relative overflow-hidden`}
                  style={{
                    opacity: animationStarted ? 1 : 0,
                    transform: `translateY(${animationStarted ? "0" : "20px"})`,
                    transition: `all 0.6s ease-out ${0.4 + index * 0.1}s`,
                  }}
                >
                  {/* Animated background that slides in smoothly */}
                  <div
                    className="absolute inset-0 bg-slate-800/50 transition-all duration-700 ease-in-out"
                    style={{
                      opacity: activeFeature === index ? 1 : 0,
                      transform:
                        activeFeature === index
                          ? "translateX(0)"
                          : "translateX(-100%)",
                    }}
                  />

                  {/* Animated left border */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 to-cyan-500 transition-all duration-700 ease-in-out"
                    style={{
                      opacity: activeFeature === index ? 1 : 0,
                      transform:
                        activeFeature === index ? "scaleY(1)" : "scaleY(0)",
                      transformOrigin: "top",
                    }}
                  />

                  <div
                    className={`relative z-10 mr-4 p-2 rounded-lg transition-all duration-700 ease-in-out ${
                      activeFeature === index
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white scale-110"
                        : "bg-slate-800 text-blue-400"
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <div className="relative z-10">
                    <h3
                      className={`font-semibold text-lg mb-1 transition-all duration-700 ${
                        activeFeature === index ? "text-blue-300" : "text-white"
                      }`}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - animated visualization */}
          <div className="md:w-2/5 flex items-center justify-center md:justify-end">
            <div
              className="relative w-72 h-72 md:w-80 md:h-80"
              style={{
                opacity: animationStarted ? 1 : 0,
                transform: `scale(${animationStarted ? "1" : "0.8"})`,
                transition: "all 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s",
              }}
            >
              {/* Circular rings */}
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-blue-400/30 animate-spin-slow"></div>
              <div className="absolute inset-8 rounded-full border-2 border-cyan-500/40 animate-reverse-spin"></div>
              <div className="absolute inset-16 rounded-full border border-indigo-500/20 animate-spin-slow"></div>

              {/* Center shield */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-full shadow-lg shadow-blue-900/50">
                  <div className="absolute inset-2 rounded-full bg-slate-900/70 flex items-center justify-center">
                    <Shield className="text-blue-400 w-12 h-12" />
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              {["DSGVO", "Audit", "TOM", "DSFA"].map((text, i) => (
                <div
                  key={`floating-${i}`}
                  className="absolute flex items-center justify-center bg-slate-800/90 text-blue-300 font-medium text-sm py-1 px-3 rounded-full"
                  style={{
                    top: `${20 + (Math.sin(i * 1.5) * 30 + 50)}%`,
                    left: `${20 + (Math.cos(i * 1.5) * 30 + 50)}%`,
                    transform: "translate(-50%, -50%)",
                    animation: `float-orbit ${5 + i}s infinite ease-in-out ${i * 0.5}s`,
                  }}
                >
                  {text}
                </div>
              ))}

              {/* Connection lines */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 200 200"
              >
                <defs>
                  <linearGradient
                    id="lineGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
                  </linearGradient>
                </defs>

                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i * Math.PI * 2) / 8;
                  const innerX = 100 + Math.cos(angle) * 30;
                  const innerY = 100 + Math.sin(angle) * 30;
                  const outerX = 100 + Math.cos(angle) * 80;
                  const outerY = 100 + Math.sin(angle) * 80;

                  return (
                    <line
                      key={`line-${i}`}
                      x1={innerX}
                      y1={innerY}
                      x2={outerX}
                      y2={outerY}
                      stroke="url(#lineGradient)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      className="animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  );
                })}

                {/* Animated data points */}
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i * Math.PI * 2) / 8;
                  const pathId = `data-path-${i}`;

                  return (
                    <g key={`data-point-${i}`}>
                      <path
                        id={pathId}
                        d={`M ${100 + Math.cos(angle) * 30} ${100 + Math.sin(angle) * 30} L ${100 + Math.cos(angle) * 80} ${100 + Math.sin(angle) * 80}`}
                        stroke="none"
                        fill="none"
                      />
                      <circle r="3" fill="#22d3ee" className="animate-pulse">
                        <animateMotion
                          dur={`${3 + (i % 3)}s`}
                          repeatCount="indefinite"
                          path={`M ${100 + Math.cos(angle) * 30} ${100 + Math.sin(angle) * 30} L ${100 + Math.cos(angle) * 80} ${100 + Math.sin(angle) * 80}`}
                        />
                      </circle>
                    </g>
                  );
                })}
              </svg>

              {/* Lock icon overlay */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                <Lock size={28} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom keyframes for animations */}
      <style jsx>{`
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes reverse-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(-360deg);
          }
        }

        @keyframes float-y {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes float-orbit {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) translateX(20px)
              rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) translateX(20px)
              rotate(-360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }

        .animate-reverse-spin {
          animation: reverse-spin 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default DatenschutzHeroV2;
