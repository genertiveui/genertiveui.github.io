import React, { useEffect, useLayoutEffect, useRef, useState, forwardRef } from 'react';
import { Card, CardContent } from "~/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { cn } from "~/lib/utils";

interface CarouselItem {
    id: number;
    text: string;
    value: string;
}

interface CarouselProps {
    carouselData: CarouselItem[][];
}

interface AnimatedRowProps {
    row: CarouselItem[];
    rowIndex: number;
}

interface CarouselCardProps {
    card: CarouselItem;
    keyPrefix?: string;
    isFirstCardInSecondRow?: boolean;
}

const CarouselCard = ({ card, keyPrefix = '', isFirstCardInSecondRow = false }: CarouselCardProps) => (
    <div
        key={`${card.id}${keyPrefix}`}
        className={cn(
            "relative mr-5 flex-none w-[275px]",
            isFirstCardInSecondRow && "ml-[132px]"
        )}
    >
        <div className="flex justify-between mb-1 text-xs mx-1.5 text-foreground/70">
            <span>Comment</span>
            <span>Win Rate</span>
        </div>

        <Card className="p-3 bg-secondary/80 border-border/50 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center px-2 py-1 min-h-[32px]">
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="w-[210px] text-secondary-foreground text-sm cursor-pointer hover:text-primary transition-colors">
                            <div className="carousel-text-truncate">
                                {card.text}
                            </div>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Comment Text</DialogTitle>
                        </DialogHeader>
                        <div className="text-sm text-foreground leading-relaxed">
                            {card.text}
                        </div>
                    </DialogContent>
                </Dialog>
                <div className="w-px bg-border/60 h-5 mx-2" />
                <div className="flex-1 font-bold text-base text-secondary-foreground text-center">
                    {card.value}
                </div>
            </CardContent>
        </Card>
    </div>
);

const AnimatedRow = forwardRef<HTMLDivElement, AnimatedRowProps>(({ row, rowIndex }, rowContainerRef) => (
    <div className="relative overflow-hidden mb-4">
        <div
            ref={rowContainerRef}
            className="flex animate-marquee"
            style={{
                animation: 'marquee var(--animation-duration) linear infinite',
            }}
        >
            {/* ORIGINAL SET */}
            {row.map((card, i) => (
                <CarouselCard
                    key={card.id}
                    card={card}
                    isFirstCardInSecondRow={rowIndex === 1 && i === 0}
                />
            ))}

            {/* DUPLICATE SET (for seamless loop) */}
            {row.map((card) => (
                <CarouselCard
                    key={`${card.id}-dup`}
                    card={card}
                    keyPrefix="-dup"
                />
            ))}
        </div>
    </div>
));

AnimatedRow.displayName = 'AnimatedRow';

export function Carousel({ carouselData }: CarouselProps) {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [startOffset, setStartOffset] = useState('-50%');
    const [rowWidth, setRowWidth] = useState<number | null>(null);
    const firstRowRef = useRef<HTMLDivElement>(null);

    /* Handle viewport resize */
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /* Compute offset + remember real row width for small screens */
    useLayoutEffect(() => {
        if (screenWidth < 1000 && firstRowRef.current) {
            const totalTrackWidth = firstRowRef.current.scrollWidth;
            const singleSetWidth = totalTrackWidth / 2;
            setRowWidth(singleSetWidth);
            const px = Math.max(singleSetWidth - screenWidth, 0);
            setStartOffset(`-${px}px`);
        } else {
            setRowWidth(null);
            setStartOffset('-50%');
        }
    }, [screenWidth, carouselData]);

    /* Duration: unchanged for >1000 px; slower formula for <1000 px */
    let animationDuration = Math.max(8, screenWidth / 80);
    if (screenWidth < 1000 && rowWidth) {
        animationDuration = Math.max(20, rowWidth / 80);
    }

    return (
        <div
            className="w-full h-full overflow-hidden p-0"
            style={{
                ['--animation-duration' as any]: `${animationDuration}s`,
                ['--marquee-start' as any]: startOffset,
            }}
        >
            <style>{`
                @keyframes marquee {
                    0%   { transform: translateX(var(--marquee-start)); }
                    100% { transform: translateX(0); }
                }
            `}</style>

            <h3 className="text-foreground text-left mb-3 text-2xl font-medium">
                Generative UIs demonstrate superior performance across diverse tasks
            </h3>

            {carouselData.map((row, idx) => (
                <AnimatedRow
                    key={idx}
                    row={row}
                    rowIndex={idx}
                    ref={idx === 0 ? firstRowRef : null}
                />
            ))}
        </div>
    );
} 