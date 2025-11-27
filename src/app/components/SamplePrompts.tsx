import React from "react";
import { SAMPLE_PROMPTS } from "../api/chat/systemPrompts";

export const SamplePrompts = () => {
    const handlePromptClick = (prompt: string) => {
        // Since we don't have direct access to the chat input via the SDK yet,
        // we'll copy to clipboard and alert the user for now, or just show it.
        // Ideally, this would inject into the chat.
        // For this template, we will just display them.
        navigator.clipboard.writeText(prompt);
        alert(`Copied to clipboard: "${prompt}"\nPaste it into the chat to start!`);
    };

    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 flex flex-col items-center gap-4 pointer-events-none">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent drop-shadow-sm pb-2">
                Curiosity Engine 2.0
            </h1>
            <div className="flex flex-wrap justify-center gap-4 pointer-events-auto">
                {SAMPLE_PROMPTS.map((prompt, index) => (
                    <button
                        key={index}
                        onClick={() => handlePromptClick(prompt)}
                        className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm text-white hover:bg-white/20 transition-all cursor-pointer"
                    >
                        {prompt}
                    </button>
                ))}
            </div>
        </div>
    );
};
