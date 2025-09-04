import React from 'react';
import ThemeToggleButton from './ThemeToggleButton';

interface SplashScreenProps {
  onStart: () => void;
  onShowAbout: () => void;
  onShowPrivacy: () => void;
  onShowTerms: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStart, onShowAbout, onShowPrivacy, onShowTerms, theme, toggleTheme }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full animate-fade-in p-4 bg-gray-100 dark:bg-slate-900 transition-colors duration-300 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
      </div>

      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold flex items-center flex-wrap justify-center">
            <span className="text-teal-400">Morse</span>
            <span className="text-yellow-400">Code</span>
            <span className="text-purple-400">Master</span>
            <span className="bg-slate-800 dark:bg-slate-200 w-2 md:w-3 h-12 md:h-16 ml-4 animate-blink"></span>
          </h1>
          <p className="text-gray-600 dark:text-slate-400 mt-4 text-lg md:text-xl">Your journey to mastering Morse code begins here.</p>
        </div>
        <button 
          onClick={onStart} 
          className="mt-12 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold py-3 px-8 rounded-lg text-xl transition transform hover:scale-105"
        >
          Start Learning
        </button>
      </div>
      <footer className="text-center py-4 text-gray-500 dark:text-slate-500 text-sm w-full max-w-4xl mx-auto">
        <div className="flex justify-center items-center gap-4 mt-2">
            <button onClick={onShowAbout} className="hover:text-gray-900 dark:hover:text-slate-300 transition-colors duration-200">About & Contact</button>
            <span className="text-gray-400 dark:text-slate-600">|</span>
            <button onClick={onShowPrivacy} className="hover:text-gray-900 dark:hover:text-slate-300 transition-colors duration-200">Privacy Policy</button>
            <span className="text-gray-400 dark:text-slate-600">|</span>
            <button onClick={onShowTerms} className="hover:text-gray-900 dark:hover:text-slate-300 transition-colors duration-200">Terms & Conditions</button>
        </div>
      </footer>
    </div>
  );
};

export default SplashScreen;