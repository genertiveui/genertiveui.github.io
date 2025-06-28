import React from 'react';
import { SuggestionsPage } from './SuggestionsPage';

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

interface AppContentProps {
    suggestionsData: Suggestion[];
    onExploreInterface: (suggestion: Suggestion) => void;
}

export function AppContent({ suggestionsData, onExploreInterface }: AppContentProps) {
    return (
        <div className="h-[500px] bg-card rounded-lg border">
            <SuggestionsPage
                suggestionsData={suggestionsData}
                onExploreInterface={onExploreInterface}
            />
        </div>
    );
} 