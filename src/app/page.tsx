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
  const { portalThemeClassName } = useTheme();

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
      <C1Chat apiUrl="/api/chat" disableThemeProvider />
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
