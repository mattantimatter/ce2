"use client";

import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Chip } from "@heroui/react";

interface SamplePromptsProps {
    currentTheme?: 'light' | 'dark';
}

// Icons as components for better reusability
const ChartLineIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);

const ChartPieIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
    </svg>
);

const SlidesIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
    </svg>
);

const DocumentIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);

export const SamplePrompts: React.FC<SamplePromptsProps> = ({ currentTheme = 'dark' }) => {
    const [isVisible, setIsVisible] = useState(true);
    const isLight = currentTheme === 'light';

    useEffect(() => {
        const checkForMessages = () => {
            const messagesExist = document.querySelector(
                '[role="log"] [data-message], ' +
                '[class*="message-list"] [class*="message"], ' +
                '[class*="conversation"] [class*="message"], ' +
                '.crayon-message:not(:empty)'
            );
            
            if (messagesExist && messagesExist.textContent && messagesExist.textContent.trim().length > 0) {
                setIsVisible(false);
            }
        };

        const timeoutId = setTimeout(checkForMessages, 500);

        const observer = new MutationObserver(() => {
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
        setIsVisible(false);
        const input = document.querySelector('textarea, input[type="text"]') as HTMLInputElement | HTMLTextAreaElement;
        if (input) {
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
            const inputEvent = new Event('input', { bubbles: true });
            input.dispatchEvent(inputEvent);
            
            setTimeout(() => {
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
                    const enterEvent = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true,
                        cancelable: true
                    });
                    input.dispatchEvent(enterEvent);
                    input.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', keyCode: 13, bubbles: true }));
                    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', keyCode: 13, bubbles: true }));
                }
            }, 150);
        }
    };

    // Sample prompts for display
    const samplePrompts = [
        { text: "Show me a line chart of stock price trends for Apple over the past year", icon: <ChartLineIcon /> },
        { text: "Create an area chart showing website traffic growth over 6 months", icon: <ChartLineIcon /> },
        { text: "Display a bar chart comparing quarterly sales by region", icon: <ChartLineIcon /> },
        { text: "Generate a pie chart of market share by smartphone brand", icon: <ChartPieIcon /> },
    ];

    if (!isVisible) return null;

    return (
        <div 
            className="fixed top-0 bottom-0 z-10 flex flex-col items-center justify-center gap-8 pointer-events-none px-4 transition-all duration-300"
            style={{ 
                left: '280px', // Start after sidebar
                right: '0',     // Extend to right edge
            }}
        >
            {/* Header */}
            <div className="flex flex-col items-center gap-2">
                <h1 className={`text-4xl md:text-5xl font-bold tracking-tight ${isLight ? 'text-gray-900' : 'text-white'}`}>
                    Chat with C1
                </h1>
                <p className={`text-base md:text-lg ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                    Experience Generative UI
                </p>
            </div>

            {/* Prompt Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl pointer-events-auto">
                {samplePrompts.map((prompt, index) => (
                    <Card 
                        key={index}
                        isPressable
                        disableAnimation
                        disableRipple
                        onPress={() => handlePromptClick(prompt.text)}
                        className={`cursor-pointer transition-all duration-150 ${
                            isLight 
                                ? 'bg-white/90 border border-gray-200 hover:bg-white hover:border-gray-300 hover:shadow-sm' 
                                : 'bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20'
                        }`}
                    >
                        <CardBody className="flex flex-row items-start gap-3 p-4">
                            <div className={`p-2 rounded-lg flex-shrink-0 ${isLight ? 'bg-gray-100 text-gray-600' : 'bg-white/10 text-white/70'}`}>
                                {prompt.icon}
                            </div>
                            <p className={`text-sm leading-relaxed ${isLight ? 'text-gray-700' : 'text-white/90'}`}>
                                {prompt.text}
                            </p>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Artifacts Section */}
            <div className="flex flex-col items-center gap-3 w-full max-w-2xl pointer-events-auto">
                <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${isLight ? 'text-gray-600' : 'text-white/70'}`}>
                        Generate Artifacts
                    </span>
                    <Chip size="sm" color="primary" variant="flat">NEW</Chip>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                    <Button
                        variant="flat"
                        startContent={<SlidesIcon />}
                        onPress={() => handlePromptClick("Generate a slide presentation on coffee culture around the world")}
                        disableAnimation
                        className={`justify-start h-auto py-3 px-4 transition-colors duration-150 ${
                            isLight 
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                                : 'bg-white/5 text-white/80 hover:bg-white/10'
                        }`}
                    >
                        <span className="text-left text-sm">Generate a slide on coffee culture</span>
                    </Button>
                    <Button
                        variant="flat"
                        startContent={<DocumentIcon />}
                        onPress={() => handlePromptClick("Generate a comprehensive report on electric vehicles and their impact")}
                        disableAnimation
                        className={`justify-start h-auto py-3 px-4 transition-colors duration-150 ${
                            isLight 
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                                : 'bg-white/5 text-white/80 hover:bg-white/10'
                        }`}
                    >
                        <span className="text-left text-sm">Generate a report on electric vehicles</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};
