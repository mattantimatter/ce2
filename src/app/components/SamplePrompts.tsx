"use client";

import React from "react";

export const SamplePrompts = () => {
    const handlePromptClick = (prompt: string) => {
        // Try to find the chat input
        const input = document.querySelector('textarea, input[type="text"]') as HTMLInputElement | HTMLTextAreaElement;
        if (input) {
            // Set the value
            input.value = prompt;
            input.focus();
            
            // Trigger all necessary events
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            
            // Try to find and click the submit button
            setTimeout(() => {
                const submitButton = document.querySelector('button[type="submit"], button[aria-label*="send" i], button[aria-label*="submit" i]') as HTMLButtonElement;
                if (submitButton) {
                    submitButton.click();
                } else {
                    // Try to trigger Enter key press as fallback
                    const enterEvent = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true
                    });
                    input.dispatchEvent(enterEvent);
                }
            }, 100);
        }
    };

    const samplePrompts = [
        { text: "Exciting stocks to look out for this year", emoji: "📈" },
        { text: "Hidden travel gems to explore", emoji: "✈️" },
        { text: "Greatest blockbusters of all time", emoji: "🎬" },
        { text: "Tell me about global street food", emoji: "🍜" },
    ];

    const artifacts = [
        { text: "Generate a slide on coffee culture", emoji: "📊" },
        { text: "Generate a report on electric vehicles", emoji: "📄" },
    ];

    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-8 pointer-events-none max-w-4xl w-full px-4">
            <div className="flex flex-col items-center gap-3">
                <h1 className="text-5xl font-semibold text-white">
                    Chat with C1
                </h1>
                <p className="text-gray-400 text-lg">
                    Experience Generative UI
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl pointer-events-auto">
                {samplePrompts.map((prompt, index) => (
                    <button
                        key={index}
                        onClick={() => handlePromptClick(prompt.text)}
                        className="flex items-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-left text-white/90 hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
                    >
                        <span className="text-2xl">{prompt.emoji}</span>
                        <span className="text-sm">{prompt.text}</span>
                    </button>
                ))}
            </div>

            <div className="flex flex-col items-center gap-4 w-full max-w-2xl pointer-events-auto">
                <div className="flex items-center gap-2">
                    <span className="text-white/70 text-sm font-medium">Generate Artifacts</span>
                    <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-xs font-medium">NEW</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    {artifacts.map((artifact, index) => (
                        <button
                            key={index}
                            onClick={() => handlePromptClick(artifact.text)}
                            className="flex items-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-left text-white/90 hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
                        >
                            <span className="text-2xl">{artifact.emoji}</span>
                            <span className="text-sm">{artifact.text}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
