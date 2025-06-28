import React from 'react';
import { X } from 'lucide-react';
import { Button } from '~/components/ui/button';

interface FullscreenModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    title: string;
}

export function FullscreenModal({ isOpen, onClose, url, title }: FullscreenModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-background">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold truncate flex-1 mr-4">{title}</h2>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="flex-shrink-0"
                >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                </Button>
            </div>

            {/* Content */}
            <div className="h-[calc(100vh-5rem)] w-full">
                <iframe
                    src={url}
                    className="w-full h-full border-0"
                    title={title}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                />
            </div>
        </div>
    );
} 