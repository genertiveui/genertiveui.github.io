import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';

interface Suggestion {
    id: number;
    title: string;
    description: string;
    activity: string;
    gif: string;
    chats: Array<{
        role: string;
        message: string;
    }>;
}

interface ChatPageProps {
    suggestion: Suggestion;
    onBackToSuggestions: () => void;
}

export function ChatPage({ suggestion, onBackToSuggestions }: ChatPageProps) {
    const [iframeKey, setIframeKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const refreshIframe = () => {
        setIframeKey(prev => prev + 1);
        setIsLoading(true);
    };

    return (
        <div className="flex flex-col h-[500px] bg-card p-0">
            {/* Header */}
            <div className="p-4 pb-3 border-b flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBackToSuggestions}
                    className="h-8 w-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back to examples</span>
                </Button>
                <div className="flex-1">
                    <h2 className="text-lg font-semibold">{suggestion.activity}</h2>
                    <p className="text-xs text-muted-foreground">Interface Preview</p>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={refreshIframe}
                        className="h-7 px-2 text-xs"
                    >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Refresh
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(suggestion.gif, '_blank')}
                        className="h-7 px-2 text-xs"
                    >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        New Tab
                    </Button>
                </div>
            </div>

            {/* Interface Preview */}
            <div className="flex-1 p-4">
                <div className="relative w-full h-full bg-background rounded-lg overflow-hidden border">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
                            <div className="text-center text-muted-foreground">
                                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                                <p className="text-sm">Loading interface...</p>
                                <p className="text-xs mt-1">Connecting to evaluation server</p>
                            </div>
                        </div>
                    )}
                    <iframe
                        key={iframeKey}
                        src={suggestion.gif}
                        title={`Interface for ${suggestion.activity}`}
                        className="w-full h-full border-0"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                        onLoad={() => setIsLoading(false)}
                        onError={() => setIsLoading(false)}
                    />
                </div>
            </div>
        </div>
    );
} 