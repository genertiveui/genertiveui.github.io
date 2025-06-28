import React from 'react';
import { SuggestionItem } from './SuggestionItem';

interface Suggestion {
    id: number;
    title: string;
    description: string;
    activity: string;
    oursUrl: string;
    textUrl: string;
    interface: string;
    model: string;
    chats: Array<{
        role: string;
        message: string;
    }>;
}

interface SuggestionsPageProps {
    suggestionsData: Suggestion[];
    onExploreInterface: (suggestion: Suggestion) => void;
}

export function SuggestionsPage({ suggestionsData, onExploreInterface }: SuggestionsPageProps) {
    return (
        <div className="bg-card p-0 max-h-[500px] overflow-y-auto">
            {/* Title Section */}
            <div className="sticky top-0 bg-card z-10 pb-4 pt-8 px-[5%]">
                <h1 className="text-2xl font-bold ml-5 text-primary">
                    Interface Examples
                </h1>
            </div>

            {/* Suggestions List */}
            <div className="px-[7.5%] pb-6">
                <div className="space-y-5">
                    {suggestionsData.map((suggestion) => (
                        <SuggestionItem
                            key={suggestion.id}
                            suggestion={suggestion}
                            onExploreInterface={onExploreInterface}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
} 