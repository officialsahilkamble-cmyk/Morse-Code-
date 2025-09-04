import React from 'react';

export const OfflineWarning: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center flex-grow h-full animate-fade-in p-4">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-20 w-20 text-red-500 mb-6" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728m-12.728 0a9 9 0 010-12.728m12.728 0L5.636 18.364m0-12.728L18.364 18.364" />
    </svg>
    <h2 className="text-3xl font-bold text-red-400 mb-4">No Internet Connection</h2>
    <p className="text-gray-600 dark:text-slate-400 max-w-md">
      This application requires an internet connection to load levels and use AI features. 
      Please check your network settings and try again.
    </p>
  </div>
);