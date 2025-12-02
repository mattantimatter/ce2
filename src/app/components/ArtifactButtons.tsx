"use client";

import React from "react";

export const ArtifactButtons = () => {
    const handleSlides = () => {
        const input = document.querySelector('textarea, input[type="text"]') as HTMLInputElement | HTMLTextAreaElement;
        if (input) {
            input.value = "Generate a slide presentation";
            input.focus();
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    };

    const handleReport = () => {
        const input = document.querySelector('textarea, input[type="text"]') as HTMLInputElement | HTMLTextAreaElement;
        if (input) {
            input.value = "Generate a comprehensive report";
            input.focus();
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleSlides}
                className="flex items-center gap-2 px-3 py-1.5 dark:bg-white/5 bg-gray-100 dark:text-white/80 text-gray-700 rounded-lg dark:hover:bg-white/10 hover:bg-gray-200 transition-colors text-sm border dark:border-white/10 border-gray-300"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M7 7h10M7 12h10M7 17h7"/>
                </svg>
                Slides
            </button>
            <button
                onClick={handleReport}
                className="flex items-center gap-2 px-3 py-1.5 dark:bg-white/5 bg-gray-100 dark:text-white/80 text-gray-700 rounded-lg dark:hover:bg-white/10 hover:bg-gray-200 transition-colors text-sm border dark:border-white/10 border-gray-300"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
                </svg>
                Report
            </button>
        </div>
    );
};

