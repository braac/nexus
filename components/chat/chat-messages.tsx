// components/ChatMessages.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Message, BADGE_URLS } from '@/lib/types';
import ShinyButton from '@/components/ui/shimmer-button';
import AnimatedGradientText from '@/components/ui/animated-gradient-text';

interface ChatMessagesProps {
    messages: Message[];
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
    const [autoScroll, setAutoScroll] = useState(true);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const chatRef = useRef<HTMLDivElement | null>(null);

    // Auto-scroll effect
    useEffect(() => {
        if (chatRef.current && autoScroll) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages, autoScroll]);

    // Handle scroll events
    const handleScroll = () => {
        if (!chatRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

        setAutoScroll(isAtBottom);
        setShowScrollButton(!isAtBottom);
    };

    // Scroll to bottom function
    const scrollToBottom = () => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
            setAutoScroll(true);
            setShowScrollButton(false);
        }
    };

    const renderBadges = (badgeString: string) => {
        if (!badgeString) return null;
        return badgeString.split(',').map((badge, index) => {
            const [badgeType] = badge.split('/');

            if (badgeType === 'subscriber') {
                return (
                    <div key={`${badge}-${index}`} className="inline-flex items-center mt-1.5">
                        <AnimatedGradientText className="mr-2 text-xs !rounded-sm h-[20px] w-[30px] flex items-center justify-center">
                            <span className="inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent">
                                Sub
                            </span>
                        </AnimatedGradientText>
                    </div>
                );
            }

            const badgeUrl = BADGE_URLS[badge];
            if (!badgeUrl) return null;

            return (
                <div key={`${badge}-${index}`} className="inline-block mr-1">
                    <Image
                        src={badgeUrl}
                        alt={badgeType}
                        width={20}
                        height={20}
                        className="inline-block"
                        unoptimized
                    />
                </div>
            );
        });
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 relative" ref={chatRef} onScroll={handleScroll}>
            <div className="max-w-4xl mx-auto space-y-2">
                {messages.map((msg) => (
                    <div key={msg.id} className="rounded p-2 bg-[#111111] hover:bg-[#1a1a1a] transition-colors">
                        <div className="flex items-center space-x-2">
                            <div className="flex-shrink-0 flex items-center">
                                {renderBadges(msg.badges)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="font-bold" style={{ color: msg.color }}>
                                    {msg.user}:
                                </span>
                                <span className="text-gray-400 ml-2">
                                    {msg.message}
                                </span>
                                <span className="text-gray-600 text-xs ml-2">
                                    {msg.timestamp.toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showScrollButton && (
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2" style={{ zIndex: 50 }}>
                    <ShinyButton
                        onClick={scrollToBottom}
                        className="dark:bg-[#1a1a1a] dark:text-white border border-gray-900 px-6 py-2 rounded-sm"
                        shimmerSize="1.5px"
                        borderRadius="12px"
                    >
                        Resume Scroll
                    </ShinyButton>
                </div>
            )}
        </div>
    );
}
