"use client";

import React from "react";
import { SAMPLE_PROMPTS } from "../api/chat/systemPrompts";

export const SamplePrompts = () => {
    const handlePromptClick = (prompt: string) => {
        // Copy to clipboard and provide feedback
        navigator.clipboard.writeText(prompt);
        
        // Try to find and focus the chat input
        const input = document.querySelector('textarea, input[type="text"]') as HTMLInputElement | HTMLTextAreaElement;
        if (input) {
            input.value = prompt;
            input.focus();
            // Trigger input event to notify the component
            const event = new Event('input', { bubbles: true });
            input.dispatchEvent(event);
        }
    };

    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-6 pointer-events-none max-w-4xl w-full px-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
                Curiosity Engine 2.0
            </h1>
            <p className="text-white/70 text-center text-lg pointer-events-none">
                Ask me anything - I can search the web, check weather, and find images
            </p>
            <div className="flex flex-wrap justify-center gap-3 pointer-events-auto">
                {SAMPLE_PROMPTS.map((prompt, index) => (
                    <button
                        key={index}
                        onClick={() => handlePromptClick(prompt)}
                        className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-xl text-sm text-white/90 hover:bg-white/20 hover:border-white/50 hover:scale-105 transition-all duration-200 cursor-pointer shadow-lg"
                    >
                        {prompt}
                    </button>
                ))}
            </div>
        </div>
    );
};
