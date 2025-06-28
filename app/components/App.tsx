import React from 'react';
import { AppContent } from './AppContent';
import { Carousel } from './Carousel';

interface CarouselItem {
    id: number;
    text: string;
    value: string;
}

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

interface AppProps {
    carouselData: CarouselItem[][];
    suggestionsData: Suggestion[];
    onExploreInterface: (suggestion: Suggestion) => void;
}

export function App({ carouselData, suggestionsData, onExploreInterface }: AppProps) {
    return (
        <div className="bg-background">
            {/* Carousel Section */}
            <h2 className="text-xl font-semibold text-foreground text-left mb-5">
                Explore generative interfaces that adapt to different query types
            </h2>

            {/* App Section */}
            <div className="mt-0">
                <AppContent
                    suggestionsData={suggestionsData}
                    onExploreInterface={onExploreInterface}
                />
            </div>
        </div>
    );
} 