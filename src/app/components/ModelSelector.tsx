"use client";

import React, { useState } from "react";
import { 
    Dropdown, 
    DropdownTrigger, 
    DropdownMenu, 
    DropdownItem, 
    Button,
    Chip
} from "@heroui/react";

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

const ModelIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
);

export const ModelSelector = () => {
    const [selectedModel, setSelectedModel] = useState(models[0]);

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button 
                    variant="flat" 
                    startContent={<ModelIcon />}
                    endContent={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    }
                    className="bg-white/10 text-white hover:bg-white/15 border border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15 dark:border-white/20"
                >
                    {selectedModel.name}
                </Button>
            </DropdownTrigger>
            <DropdownMenu 
                aria-label="Model selection"
                selectionMode="single"
                selectedKeys={new Set([selectedModel.id])}
                onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    const model = models.find(m => m.id === selectedKey);
                    if (model) setSelectedModel(model);
                }}
            >
                {models.map((model) => (
                    <DropdownItem
                        key={model.id}
                        startContent={<ModelIcon />}
                        endContent={
                            <Chip 
                                size="sm" 
                                variant="flat"
                                color={model.status === 'stable' ? 'success' : 'warning'}
                                classNames={{
                                    base: "h-5",
                                    content: "text-xs px-1"
                                }}
                            >
                                {model.status === 'stable' ? 'Stable' : 'Exp'}
                            </Chip>
                        }
                    >
                        {model.name}
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
};
