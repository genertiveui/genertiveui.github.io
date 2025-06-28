import React, { useEffect, useRef, useState } from 'react';
import {
    FaCode,
    FaGlobe,
    FaCloud,
    FaRobot,
    FaBullhorn,
    FaGraduationCap,
    FaPen,
    FaChartBar,
    FaBriefcase,
    FaSearch,
} from 'react-icons/fa';

interface LeftPaneProps {
    selectedHour: number;
    onTimeChange: (hour: number) => void;
    activity: string;
    gif: string;
}

interface SliderIcon {
    icon: React.ComponentType;
    value: number;
    key: string;
    label: string;
}

const sliderIcons: SliderIcon[] = [
    { icon: FaCode, value: 1, key: 'web-mobile', label: 'Web & Mobile App Development' },
    { icon: FaGlobe, value: 2, key: 'translation', label: 'Language Translation' },
    { icon: FaCloud, value: 3, key: 'devops', label: 'DevOps & Cloud Infrastructure' },
    { icon: FaRobot, value: 4, key: 'ai-ml', label: 'Advanced AI/ML Applications' },
    { icon: FaBullhorn, value: 5, key: 'marketing', label: 'Digital Marketing & SEO' },
    { icon: FaGraduationCap, value: 6, key: 'education', label: 'Education & Career Development' },
    { icon: FaPen, value: 7, key: 'content', label: 'Content Creation & Communication' },
    { icon: FaChartBar, value: 8, key: 'data-analysis', label: 'Data Analysis & Visualization' },
    { icon: FaBriefcase, value: 9, key: 'business', label: 'Business Strategy & Operations' },
    { icon: FaSearch, value: 10, key: 'research', label: 'Academic Research & Writing' },
];

interface FancySliderProps {
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (value: number) => void;
    icons: SliderIcon[];
}

function FancySlider({ min, max, step, value, onChange, icons }: FancySliderProps) {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const lastUpdateRef = useRef(0);
    const THROTTLE_MS = 120;

    useEffect(() => {
        const maybeUpdate = (newVal: number, force = false) => {
            if (newVal === value) return;
            const now = Date.now();
            if (force || now - lastUpdateRef.current > THROTTLE_MS) {
                lastUpdateRef.current = now;
                onChange(newVal);
            }
        };

        const handleMove = (clientX: number) => {
            if (!isDragging || !sliderRef.current) return;
            const { left, width } = sliderRef.current.getBoundingClientRect();
            const clampedX = Math.max(0, Math.min(clientX - left, width));
            const ratio = clampedX / width;
            const newValue = Math.round((min + ratio * (max - min)) / step) * step;
            maybeUpdate(newValue);
        };

        const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
        const handleTouchMove = (e: TouchEvent) => {
            if (isDragging) e.preventDefault();
            if (e.touches[0]) handleMove(e.touches[0].clientX);
        };

        const endDrag = (e: MouseEvent | TouchEvent) => {
            if (!sliderRef.current) return;
            const finalX = 'changedTouches' in e ? e.changedTouches[0]?.clientX : e.clientX;
            if (finalX) handleMove(finalX);
            maybeUpdate(value, true);
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', endDrag);
            window.addEventListener('touchmove', handleTouchMove, { passive: false });
            window.addEventListener('touchend', endDrag);
            window.addEventListener('touchcancel', endDrag);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', endDrag);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', endDrag);
            window.removeEventListener('touchcancel', endDrag);
        };
    }, [isDragging, min, max, step, value, onChange]);

    const ratio = (value - min) / (max - min);
    const iconSize = 18;

    return (
        <div className="relative w-full h-16">
            {/* Icons */}
            <div className="absolute top-0 w-full h-6">
                {icons.map(({ icon: IconComponent, value: v, key, label }) => {
                    const iconRatio = (v - min) / (max - min);
                    const isActive = v === value;
                    return (
                        <div
                            key={key}
                            onClick={() => onChange(v)}
                            className={`absolute top-1/2 transform -translate-y-1/2 cursor-pointer z-20 transition-colors duration-200 ${isActive
                                ? 'text-primary drop-shadow-sm'
                                : 'text-muted-foreground/60 hover:text-muted-foreground'
                                }`}
                            style={{
                                left: `calc(${iconRatio * 100}% - ${iconSize / 2}px)`,
                                fontSize: `${iconSize}px`,
                            }}
                            title={label}
                        >
                            <IconComponent />
                        </div>
                    );
                })}
            </div>

            {/* Slider Track */}
            <div
                ref={sliderRef}
                className="absolute bottom-0 w-full h-5"
            >
                {/* Background track */}
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-1 bg-border rounded-sm" />

                {/* Progress track */}
                <div
                    className="absolute top-1/2 left-0 transform -translate-y-1/2 h-1 bg-primary rounded-sm shadow-sm"
                    style={{ width: `${ratio * 100}%` }}
                />

                {/* Slider handle */}
                <div
                    onMouseDown={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onTouchStart={() => setIsDragging(true)}
                    className="absolute top-1/2 w-5 h-5 rounded-full bg-primary shadow-md cursor-pointer z-10 transform -translate-y-1/2 ring-2 ring-background transition-shadow hover:shadow-lg"
                    style={{ left: `calc(${ratio * 100}% - 10px)` }}
                />
            </div>
        </div>
    );
}

export function LeftPane({ selectedHour, onTimeChange, activity, gif }: LeftPaneProps) {
    return (
        <div className="leftpane-container">
            {/* Activity clip */}
            {gif && (
                <div style={{ width: '100%' }}>
                    <img
                        src={`/images/gifs/${gif}`}
                        alt={activity}
                        style={{
                            width: '100%',
                            height: 'auto',
                            objectFit: 'contain',
                            display: 'block',
                            margin: '0 auto',
                        }}
                    />
                    <p style={{ margin: '15px 0', fontSize: 16 }}>
                        <b>{activity}</b>
                    </p>
                </div>
            )}

            {/* Category selector */}
            <div style={{ width: 320, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <FancySlider
                        min={1}
                        max={10}
                        step={1}
                        value={selectedHour}
                        onChange={onTimeChange}
                        icons={sliderIcons}
                    />
                </div>
            </div>
        </div>
    );
} 