import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface CarouselItem {
    id: number;
    text: string;
    value: string;
}

interface Suggestion {
    id: number;
    title: string;
    description: string;
    chats: Array<{
        role: string;
        message: string;
    }>;
}

interface Example {
    query: string;
    url: string;
    comment: string;
    interface: string;
}

interface DynamicData {
    activity: string;
    gif: string;
    carousel: CarouselItem[][];
    examples: Example[];
    textUrls: Example[];
    suggestions: Suggestion[];
}

interface DynamicDataContextType {
    selectedHour: number;
    currentData: DynamicData;
}

const DynamicDataContext = createContext<DynamicDataContextType | undefined>(undefined);

export const DynamicDataProvider: React.FC<{
    selectedHour: number;
    currentData: DynamicData;
    children: ReactNode;
}> = ({ selectedHour, currentData, children }) => {
    return (
        <DynamicDataContext.Provider value={{ selectedHour, currentData }}>
            {children}
        </DynamicDataContext.Provider>
    );
};

export const useDynamicData = () => {
    const context = useContext(DynamicDataContext);
    if (!context) {
        throw new Error('useDynamicData must be used within DynamicDataProvider');
    }
    return context;
};
