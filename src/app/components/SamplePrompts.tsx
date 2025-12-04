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

const TableIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
    </svg>
);

const FormIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
);

const CardIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
);

const ImageIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
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

const RadarIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
);

export const SamplePrompts: React.FC<SamplePromptsProps> = ({ currentTheme = 'dark' }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>("charts");
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

    // Organized prompts by category based on Thesys Component Library
    const categories = {
        charts: {
            label: "Charts",
            icon: <ChartLineIcon />,
            prompts: [
                { text: "Show me a line chart of stock price trends for Apple over the past year", icon: <ChartLineIcon /> },
                { text: "Create an area chart showing website traffic growth over 6 months", icon: <ChartLineIcon /> },
                { text: "Display a bar chart comparing quarterly sales by region", icon: <ChartLineIcon /> },
                { text: "Generate a pie chart of market share by smartphone brand", icon: <ChartPieIcon /> },
                { text: "Show a radar chart comparing laptop features across brands", icon: <RadarIcon /> },
                { text: "Create a radial chart showing my weekly fitness goal progress", icon: <ChartPieIcon /> },
            ]
        },
        tables: {
            label: "Tables & Data",
            icon: <TableIcon />,
            prompts: [
                { text: "Create a table of the top 10 highest-grossing movies of all time", icon: <TableIcon /> },
                { text: "Show me a comparison table of electric vehicle specs", icon: <TableIcon /> },
                { text: "Generate a table of programming language popularity rankings", icon: <TableIcon /> },
                { text: "Display a sortable table of world countries by population", icon: <TableIcon /> },
            ]
        },
        cards: {
            label: "Cards & Display",
            icon: <CardIcon />,
            prompts: [
                { text: "Show me cards with information about popular travel destinations", icon: <CardIcon /> },
                { text: "Create recipe cards for 5 easy dinner ideas", icon: <CardIcon /> },
                { text: "Display product cards for the latest smartphones", icon: <CardIcon /> },
                { text: "Generate profile cards for famous scientists", icon: <CardIcon /> },
            ]
        },
        images: {
            label: "Images",
            icon: <ImageIcon />,
            prompts: [
                { text: "Show me beautiful images of the Northern Lights", icon: <ImageIcon /> },
                { text: "Display images of modern architecture around the world", icon: <ImageIcon /> },
                { text: "Find images of exotic tropical beaches", icon: <ImageIcon /> },
                { text: "Show me pictures of cute puppies", icon: <ImageIcon /> },
            ]
        },
        forms: {
            label: "Forms & Input",
            icon: <FormIcon />,
            prompts: [
                { text: "Create a contact form with name, email, and message fields", icon: <FormIcon /> },
                { text: "Generate a survey form about user preferences", icon: <FormIcon /> },
                { text: "Build a registration form with validation", icon: <FormIcon /> },
                { text: "Design a feedback form with rating options", icon: <FormIcon /> },
            ]
        },
        artifacts: {
            label: "Artifacts",
            icon: <SlidesIcon />,
            prompts: [
                { text: "Generate a slide presentation about artificial intelligence trends", icon: <SlidesIcon /> },
                { text: "Create a comprehensive report on renewable energy", icon: <DocumentIcon /> },
                { text: "Generate slides on the future of remote work", icon: <SlidesIcon /> },
                { text: "Create a business report analyzing e-commerce growth", icon: <DocumentIcon /> },
            ]
        },
    };

    if (!isVisible) return null;

    const activePrompts = categories[activeCategory as keyof typeof categories]?.prompts || [];

    return (
        <div 
            className="fixed top-1/2 z-10 flex flex-col items-center gap-6 pointer-events-none px-4 transition-all duration-300"
            style={{ 
                left: 'calc(280px + (100vw - 280px) / 2)', // Sidebar + half of remaining space
                transform: 'translate(-50%, -50%)', // Center horizontally and vertically
                maxWidth: 'calc(100vw - 320px)' // Account for sidebar + padding
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

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-2 pointer-events-auto">
                {Object.entries(categories).map(([key, category]) => (
                    <Button
                        key={key}
                        size="sm"
                        variant={activeCategory === key ? "solid" : "flat"}
                        color={activeCategory === key ? "primary" : "default"}
                        startContent={category.icon}
                        onPress={() => setActiveCategory(key)}
                        disableAnimation
                        className={`transition-colors duration-150 ${
                            activeCategory === key 
                                ? '' 
                                : isLight 
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                                    : 'bg-white/5 text-white/80 hover:bg-white/10'
                        }`}
                    >
                        {category.label}
                    </Button>
                ))}
            </div>

            {/* Prompt Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-3xl pointer-events-auto">
                {activePrompts.slice(0, 4).map((prompt, index) => (
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
            <div className="flex flex-col items-center gap-3 w-full max-w-3xl pointer-events-auto mt-2">
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
