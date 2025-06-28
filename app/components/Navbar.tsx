import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '~/components/ui/button';

interface Suggestion {
    id: number;
    title: string;
    description: string;
    chats: Array<{
        role: string;
        message: string;
    }>;
}

interface NavbarProps {
    activeChats: Suggestion[];
    isMobile: boolean;
    onClose: () => void;
    onSwitchToChat: (suggestion: Suggestion) => void;
    onBackToSuggestions: () => void;
    currentView: 'suggestions' | 'chat';
}

export function Navbar({
    activeChats,
    isMobile,
    onClose,
    onSwitchToChat,
    onBackToSuggestions,
    currentView
}: NavbarProps) {
    const [sidebarWidth, setSidebarWidth] = useState(250);
    const [isResizing, setIsResizing] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startWidth, setStartWidth] = useState(0);

    const MIN_WIDTH = 180;
    const MAX_WIDTH = 400;

    const resizeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;

            const deltaX = e.clientX - startX;
            const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidth + deltaX));
            setSidebarWidth(newWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, startX, startWidth]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsResizing(true);
        setStartX(e.clientX);
        setStartWidth(sidebarWidth);
    };

    return (
        <div
            className="bg-muted/30 flex flex-col p-5 relative"
            style={{
                width: isMobile ? '100%' : sidebarWidth,
                minWidth: isMobile ? 'auto' : MIN_WIDTH
            }}
        >
            {!isMobile && (
                <div
                    ref={resizeRef}
                    className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-border/50 transition-colors"
                    onMouseDown={handleMouseDown}
                />
            )}

            {isMobile && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute top-2 right-2 h-6 w-6"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close sidebar</span>
                </Button>
            )}

            <h2 className="text-lg font-semibold mb-5 text-foreground">
                GUMBO
            </h2>

            <nav className="flex flex-col gap-1">
                <button
                    onClick={onBackToSuggestions}
                    className={`text-left px-2.5 py-1.5 rounded text-sm hover:bg-muted/50 transition-colors ${currentView === 'suggestions' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                >
                    Suggestions
                </button>

                {activeChats.length > 0 && (
                    <>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide mt-4 mb-2 px-2.5">
                            Active Chats
                        </div>
                        {activeChats.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => onSwitchToChat(chat)}
                                className="text-left px-2.5 py-1.5 rounded text-sm hover:bg-muted/50 transition-colors text-muted-foreground truncate"
                                title={chat.title}
                            >
                                {chat.title}
                            </button>
                        ))}
                    </>
                )}
            </nav>
        </div>
    );
} 