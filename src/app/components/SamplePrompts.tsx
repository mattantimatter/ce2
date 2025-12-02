"use client";

import React, { useEffect, useState } from "react";

export const SamplePrompts = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Hide prompts when conversation messages appear
        const checkForMessages = () => {
            // Look for actual conversation messages, not just any elements
            const messagesExist = document.querySelector(
                '[role="log"] [data-message], ' +
                '[class*="message-list"] [class*="message"], ' +
                '[class*="conversation"] [class*="message"], ' +
                '.crayon-message:not(:empty)'
            );
            
            // Only hide if we find real messages with content
            if (messagesExist && messagesExist.textContent && messagesExist.textContent.trim().length > 0) {
                setIsVisible(false);
            }
        };

        // Don't check immediately - wait for actual content
        const timeoutId = setTimeout(checkForMessages, 500);

        // Set up observer to watch for new messages
        const observer = new MutationObserver(() => {
            // Debounce the check
            clearTimeout(timeoutId);
            setTimeout(checkForMessages, 300);
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return () => {
            clearTimeout(timeoutId);
            observer.disconnect();
        };
    }, []);

    const handlePromptClick = (prompt: string) => {
        // Hide prompts immediately when clicked
        setIsVisible(false);
        // Find the chat input
        const input = document.querySelector('textarea, input[type="text"]') as HTMLInputElement | HTMLTextAreaElement;
        if (input) {
            // Use React's native setter to properly update the value
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLTextAreaElement.prototype,
                'value'
            )?.set || Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                'value'
            )?.set;
            
            if (nativeInputValueSetter) {
                nativeInputValueSetter.call(input, prompt);
            } else {
                input.value = prompt;
            }
            
            input.focus();
            
            // Trigger React's onChange
            const inputEvent = new Event('input', { bubbles: true });
            input.dispatchEvent(inputEvent);
            
            // Wait a bit then trigger submission
            setTimeout(() => {
                // Try multiple selectors for the submit button
                const submitButton = document.querySelector(
                    'button[type="submit"], ' +
                    'button[aria-label*="send"], ' +
                    'button[aria-label*="Send"], ' +
                    'form button:last-of-type, ' +
                    'button svg[class*="send"], ' +
                    'button[class*="send"]'
                ) as HTMLButtonElement;
                
                if (submitButton && !submitButton.disabled) {
                    submitButton.click();
                } else {
                    // Fallback: trigger Enter key
                    const enterEvent = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true,
                        cancelable: true
                    });
                    input.dispatchEvent(enterEvent);
                    
                    // Also try keypress and keyup
                    input.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', keyCode: 13, bubbles: true }));
                    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', keyCode: 13, bubbles: true }));
                }
            }, 150);
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

    // Don't render if not visible
    if (!isVisible) return null;

    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-8 pointer-events-none max-w-4xl w-full px-4 transition-opacity duration-300">
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
                        <span className="text-sm text-white">{prompt.text}</span>
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
                            <span className="text-sm text-white">{artifact.text}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
