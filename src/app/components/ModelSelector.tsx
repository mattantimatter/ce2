"use client";

import React, { useState } from "react";

interface Model {
    id: string;
    name: string;
    status: 'stable' | 'experimental';
}

const models: Model[] = [
    { id: "c1/openai/gpt-5/v-20250930", name: "GPT-5", status: "stable" },
    { id: "c1/anthropic/claude-3-7-sonnet", name: "Claude 3.7 Sonnet", status: "stable" },
    { id: "c1/anthropic/claude-sonnet-4/v-20250617", name: "Claude Sonnet 4", status: "stable" },
    { id: "c1/anthropic/claude-3-5-haiku", name: "Claude 3.5 Haiku", status: "experimental" },
];

export const ModelSelector = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState(models[0]);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 dark:bg-white/10 bg-gray-200 dark:text-white text-gray-900 rounded-lg dark:hover:bg-white/15 hover:bg-gray-300 transition-colors border dark:border-white/20 border-gray-300"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span className="font-medium">{selectedModel.name}</span>
                <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 mt-2 w-72 dark:bg-gray-900 bg-white rounded-lg shadow-2xl dark:border dark:border-white/10 border border-gray-200 overflow-hidden z-20">
                        {models.map((model) => (
                            <button
                                key={model.id}
                                onClick={() => {
                                    setSelectedModel(model);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center justify-between px-4 py-3 dark:hover:bg-white/5 hover:bg-gray-100 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 dark:text-white text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                                    </svg>
                                    <span className="font-medium dark:text-white text-gray-900">{model.name}</span>
                                </div>
                                <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                                    model.status === 'stable' 
                                        ? 'bg-green-500/20 text-green-500' 
                                        : 'bg-yellow-500/20 text-yellow-500'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                        model.status === 'stable' ? 'bg-green-500' : 'bg-yellow-500'
                                    }`} />
                                    {model.status === 'stable' ? 'Stable' : 'Experimental'}
                                </span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

