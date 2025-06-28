import React from 'react';
import { Card, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Maximize, ExternalLink, Sparkles, MessageSquare } from 'lucide-react';

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

interface SuggestionItemProps {
    suggestion: Suggestion;
    onExploreInterface: (suggestion: Suggestion) => void;
}

export function SuggestionItem({ suggestion, onExploreInterface }: SuggestionItemProps) {
    const handleFullscreenInterface = () => {
        onExploreInterface(suggestion);
    };

    const handleNewWindowInterface = () => {
        window.open(suggestion.oursUrl, '_blank');
    };

    const handleTextInterface = () => {
        window.open(suggestion.textUrl, '_blank');
    };

    return (
        <Card className="bg-card border-border hover:border-primary/70 hover:shadow-sm transition-all duration-200">
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-base text-card-foreground flex-1 mr-2">{suggestion.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md flex-shrink-0">
                        <Sparkles className="h-3 w-3" />
                        {suggestion.interface}
                    </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{suggestion.description}</p>

                {/* Comparison Section */}
                <div className="bg-muted/30 rounded-lg p-3 mb-3">
                    <div className="text-xs font-medium text-muted-foreground mb-2">Compare Interface Types:</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Generative UI (Ours)</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                            <span>Traditional Text Chat</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    {/* Generative UI Buttons */}
                    <div className="flex gap-2">
                        {/* <Button
                            variant="default"
                            size="sm"
                            className="flex items-center gap-2 flex-1"
                            onClick={handleFullscreenInterface}
                        >
                            <Maximize className="h-3 w-3" />
                            View Generative UI
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={handleNewWindowInterface}
                        >
                            <ExternalLink className="h-3 w-3" />
                        </Button> */}

                        <Button
                            variant="default"
                            size="sm"
                            className="flex items-center gap-2 flex-1"
                            onClick={handleNewWindowInterface}
                        >
                            <ExternalLink className="h-3 w-3" />
                            Open Generative UI
                        </Button>
                    </div>

                    {/* Text Interface Button */}
                    <Button
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-2 w-full"
                        onClick={handleTextInterface}
                    >
                        <MessageSquare className="h-3 w-3" />
                        Compare with Text Chat
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
} 