"use client";

import { C1Chat, ThemeProvider } from "@thesysai/genui-sdk";
import "@crayonai/react-ui/styles/index.css";
import clsx from "clsx";
import styles from "./page.module.scss";
import { useTheme } from "@crayonai/react-ui/ThemeProvider";
import { theme, darkTheme, themeMode } from "@/theme";
import { useState } from "react";

import { SamplePrompts } from "./components/SamplePrompts";
import { SignupModal } from "./components/SignupModal";

const ChatInternal = () => {
  const { portalThemeClassName, themeMode, setThemeMode } = useTheme();

  return (
    <>
      <style>{`
      .${portalThemeClassName} > div,
      .${portalThemeClassName} > div > *,
      .crayon-chart-tooltip,
      .crayon-chart-tooltip-content {
        backdrop-filter: blur(16px);
        background: transparent !important;
      }
    `}</style>
      {/* Theme Toggle Button */}
      <button
        onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
        className="fixed top-4 left-4 z-50 p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
        aria-label="Toggle theme"
        title={`Switch to ${themeMode === 'dark' ? 'light' : 'dark'} mode`}
      >
        {themeMode === 'dark' ? (
          // Sun icon for light mode
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          // Moon icon for dark mode
          <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
      <C1Chat 
        apiUrl="/api/chat" 
        disableThemeProvider 
      />
    </>
  );
};

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={clsx("!h-full !w-full relative", styles["chat-theme"])}>
      {/* Header with Docs and Login */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        <a 
          href="https://docs.thesys.dev" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-4 py-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
        >
          Docs
        </a>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm shadow-lg"
        >
          Login
        </button>
      </div>

      <SamplePrompts />
      <ThemeProvider theme={theme} darkTheme={darkTheme} mode={themeMode}>
        <ChatInternal />
      </ThemeProvider>

      <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
