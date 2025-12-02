"use client";

import React, { useState } from "react";

export const ComponentTabs = () => {
    const [activeTab, setActiveTab] = useState("Charts");

    const tabs = [
        "Charts",
        "Forms",
        "Cards",
        "Lists",
        "Tables",
        "Slides",
        "Reports"
    ];

    return (
        <div className="w-full border-b border-white/10 dark:border-white/10 border-gray-300 bg-transparent">
            <div className="flex items-center justify-center gap-1 px-4 py-2">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                            activeTab === tab
                                ? 'dark:bg-white/10 bg-gray-200 dark:text-white text-gray-900 border-b-2 dark:border-white border-gray-900'
                                : 'dark:text-gray-400 text-gray-600 dark:hover:text-white hover:text-gray-900 dark:hover:bg-white/5 hover:bg-gray-100'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    );
};

