import React from 'react';
import ThemeToggleButton from './ThemeToggleButton';

interface HeaderProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="text-center w-full max-w-4xl mx-auto flex justify-between items-center">
        <div className="w-12"></div> {/* Spacer */}
        <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="text-teal-400">Morse</span>
            <span className="text-yellow-400">Code</span>
            <span className="text-purple-400">Master</span>
        </h1>
        <div className="w-12 flex justify-end">
            <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
        </div>
    </header>
  );
};

export default Header;