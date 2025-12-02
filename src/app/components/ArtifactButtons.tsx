"use client";

import React, { useEffect, useState } from "react";

export const ArtifactButtons = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        
        // Inject the buttons into the chat input container
        const injectButtons = () => {
            const inputContainer = document.querySelector('[class*="input-container"], form, [class*="ChatInput"]');
            if (inputContainer && !document.getElementById('artifact-buttons-injected')) {
                const buttonContainer = document.createElement('div');
                buttonContainer.id = 'artifact-buttons-injected';
                buttonContainer.className = 'flex items-center gap-2 mb-2';
                
                // Create Slides button
                const slidesBtn = document.createElement('button');
                slidesBtn.className = 'flex items-center gap-2 px-3 py-1.5 bg-white/5 text-white/80 rounded-lg hover:bg-white/10 transition-colors text-sm border border-white/10';
                slidesBtn.innerHTML = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h10M7 12h10M7 17h7"/></svg><span>Slides</span>';
                slidesBtn.onclick = () => {
                    const input = document.querySelector('textarea, input[type="text"]') as HTMLInputElement | HTMLTextAreaElement;
                    if (input) {
                        input.value = "Generate a slide presentation";
                        input.focus();
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                };
                
                // Create Report button
                const reportBtn = document.createElement('button');
                reportBtn.className = 'flex items-center gap-2 px-3 py-1.5 bg-white/5 text-white/80 rounded-lg hover:bg-white/10 transition-colors text-sm border border-white/10';
                reportBtn.innerHTML = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg><span>Report</span>';
                reportBtn.onclick = () => {
                    const input = document.querySelector('textarea, input[type="text"]') as HTMLInputElement | HTMLTextAreaElement;
                    if (input) {
                        input.value = "Generate a comprehensive report";
                        input.focus();
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                };
                
                buttonContainer.appendChild(slidesBtn);
                buttonContainer.appendChild(reportBtn);
                inputContainer.prepend(buttonContainer);
            }
        };

        // Try injection multiple times
        const attempts = [100, 500, 1000, 2000];
        attempts.forEach(delay => setTimeout(injectButtons, delay));
        
    }, []);

    return null; // Component injects itself into DOM
};

