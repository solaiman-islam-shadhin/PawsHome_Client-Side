import React from 'react';
import { Dog, PawPrint } from 'lucide-react'; // Using Dog and PawPrint icons

// --- Custom Loader Animation Component ---

const PetLoaderAnimation = () => {
  return (
    <>
      {/* Custom CSS for the animation */}
      <style>{`
        .pet-walk {
          animation: walk 1.5s ease-in-out infinite;
          transform-origin: bottom center;
        }
        .paw-print-bounce {
          animation: bounce 1.5s ease-in-out infinite;
        }

        @keyframes walk {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-5px) rotate(5deg);
          }
          50% {
            transform: translateY(0) rotate(-5deg);
          }
          75% {
            transform: translateY(-5px) rotate(5deg);
          }
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }
      `}</style>
      <div className="flex flex-col items-center">
        {/* Main animated element: Dog icon */}
        <Dog size={64} className="text-blue-600 pet-walk" />
        
        {/* Secondary animated element: Paw Print */}
        <div className="flex space-x-2 mt-2">
          <PawPrint size={16} className="text-gray-400 paw-print-bounce delay-100" />
          <PawPrint size={16} className="text-gray-400 paw-print-bounce delay-300" />
          <PawPrint size={16} className="text-gray-400 paw-print-bounce delay-500" />
        </div>
      </div>
    </>
  );
};

// --- Full Page Loader (Fixed Overlay) ---

export const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 z-50 transition-opacity duration-300">
      <div className="flex flex-col items-center space-y-6 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
        <PetLoaderAnimation />
        <p className="text-xl font-semibold text-gray-800 dark:text-gray-200 tracking-wider">
          Finding Furry Friends...
        </p>
      </div>
    </div>
  );
};

// --- Page Loader (Takes up a block of space) ---

export const PageLoader = () => {
  return (
    <div className="flex items-center justify-center w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="flex flex-col items-center space-y-4">
        <PetLoaderAnimation />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Loading PawsHome Data...
        </p>
      </div>
    </div>
  );
};

// --- Inline Loader (Small, simple text + spinner) ---

export const InlineLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex items-center space-x-2 text-blue-600">
      <PawPrint size={16} className="animate-spin" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{text}</span>
    </div>
  );
};