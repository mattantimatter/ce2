"use client";

import { C1Chat, ThemeProvider } from "@thesysai/genui-sdk";
import "@crayonai/react-ui/styles/index.css";
import clsx from "clsx";
import styles from "./page.module.scss";
import { useTheme } from "@crayonai/react-ui/ThemeProvider";
import { theme, darkTheme } from "@/theme";
import { useState } from "react";

import { SamplePrompts } from "./components/SamplePrompts";
import { SignupModal } from "./components/SignupModal";
import { ModelSelector } from "./components/ModelSelector";
import { ArtifactButtons } from "./components/ArtifactButtons";

const ChatInternal = () => {
  const { portalThemeClassName } = useTheme();

  return (
    <>
      <style>{`
      .${portalThemeClassName} .crayon-chart-tooltip,
      .${portalThemeClassName} .crayon-chart-tooltip-content {
        backdrop-filter: blur(16px);
      }
    `}</style>
      <C1Chat 
        apiUrl="/api/chat" 
        disableThemeProvider 
      />
    </>
  );
};

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(newTheme);
    
    // Also update the root element class for better theme propagation
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
    }
  };

  return (
    <div className={clsx("!h-full !w-full relative", styles["chat-theme"])}>
      {/* Sidebar fade overlay when modal is open */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm pointer-events-none" />
      )}
      
      {/* Top Right - Theme Toggle and Login */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        {/* Theme Toggle Button - PROMINENT */}
        <button
          onClick={toggleTheme}
          className="p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl hover:bg-white/30 hover:scale-110 transition-all duration-200 shadow-xl"
          aria-label="Toggle theme"
          title={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {currentTheme === 'dark' ? (
            // Sun icon for light mode
            <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            // Moon icon for dark mode  
            <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm shadow-lg"
        >
          Login
        </button>
      </div>

      <ThemeProvider theme={theme} darkTheme={darkTheme} mode={currentTheme}>
        <SamplePrompts currentTheme={currentTheme} />
        <div className="relative h-full w-full">
          {/* Model Selector - Inside main chat area */}
          <div className="absolute top-4 left-4 z-10">
            <ModelSelector />
          </div>
          <ChatInternal />
        </div>
      </ThemeProvider>

      <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
