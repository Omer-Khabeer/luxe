"use client";
import React from "react";

const CompanyLogoSlider = () => {
  // Sample company data - replace with your actual logos
  const companies = [
    { id: 1, name: "TechCo", logo: "/techco.svg" },
    { id: 2, name: "GreenEco", logo: "/greeneco.svg" },
    { id: 3, name: "DataSphere", logo: "/datasphere.svg" },
    { id: 4, name: "Nova Systems", logo: "/novasystems.svg" },
    { id: 5, name: "Quantum Labs", logo: "/quantumlabs.svg" },
    { id: 6, name: "Infinite Solutions", logo: "/infinitesolutions.svg" },
    { id: 7, name: "Fusion Dynamics", logo: "/fusiondynamics.svg" },
    { id: 8, name: "CyberShield", logo: "/cybershield.svg" },
  ];

  // Duplicate the companies array to create seamless loop
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <div className="w-full bg-white py-16 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">
          Trusted by Leading Companies
        </h2> */}

        <h2 className="text-center text-3xl md:text-5xl font-bold  mb-8">
          Trusted by Leading{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Companies
          </span>{" "}
        </h2>

        {/* Logo slider container */}
        <div className="relative w-full">
          {/* Gradient overlay for fade effect on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

          {/* Infinite scroll container */}
          <div className="relative whitespace-nowrap flex items-center">
            {/* First set of logos */}
            <div className="animate-infinite-scroll inline-flex items-center">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="mx-8 w-48 h-24 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300 transform hover:scale-110"
                >
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ))}
            </div>

            {/* Duplicated set of logos for seamless loop */}
            <div className="animate-infinite-scroll inline-flex items-center">
              {companies.map((company) => (
                <div
                  key={`${company.id}-duplicate`}
                  className="mx-8 w-48 h-24 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300 transform hover:scale-110"
                >
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add custom styles for the animation */}
      <style jsx global>{`
        @keyframes infinite-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }

        .animate-infinite-scroll {
          animation: infinite-scroll 30s linear infinite;
        }

        /* Pause animation on hover */
        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default CompanyLogoSlider;
