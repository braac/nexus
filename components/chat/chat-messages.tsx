// components/ChatMessages.tsx
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { Message, BADGE_URLS } from '@/lib/types';
import ShinyButton from '@/components/ui/shimmer-button';
import AnimatedGradientText from '@/components/ui/animated-gradient-text';
import { ArrowDown } from 'lucide-react';

interface ChatMessagesProps {
    messages: Message[];
}

const MESSAGE_LIMIT = 200; // Maximum number of messages to keep in state
const SCROLL_THRESHOLD = 100; // Pixels from bottom to trigger auto-scroll
const BATCH_INTERVAL = 250; // Milliseconds to wait before processing next batch

export default function ChatMessages({ messages }: ChatMessagesProps) {
    // State for scroll management
    const [autoScroll, setAutoScroll] = useState(true);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const scrollLockRef = useRef(false);
    const buttonTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
    
    // Refs for DOM elements and timers
    const chatRef = useRef<HTMLDivElement | null>(null);
    const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastProcessedMessageRef = useRef<string | null>(null);

    // Batch process new messages
    useEffect(() => {
        if (messages.length === 0) return;
        
        // Get only new messages since last process
        const lastProcessedIndex = lastProcessedMessageRef.current 
            ? messages.findIndex(m => m.id === lastProcessedMessageRef.current)
            : -1;
        const newMessages = lastProcessedIndex === -1 
            ? messages 
            : messages.slice(lastProcessedIndex + 1);

        if (newMessages.length === 0) return;

        // Clear existing timeout if it exists
        if (batchTimeoutRef.current) {
            clearTimeout(batchTimeoutRef.current);
        }

        // Set timeout to process messages
        batchTimeoutRef.current = setTimeout(() => {
            setDisplayedMessages(prev => {
                const combined = [...prev, ...newMessages];
                // Keep only the most recent messages up to the limit
                return combined.slice(-MESSAGE_LIMIT);
            });

            // Update unread count if not auto-scrolling
            if (!autoScroll) {
                setUnreadCount(prev => prev + newMessages.length);
            }

            // Update last processed message
            lastProcessedMessageRef.current = newMessages[newMessages.length - 1].id;
        }, BATCH_INTERVAL);

        return () => {
            if (batchTimeoutRef.current) {
                clearTimeout(batchTimeoutRef.current);
            }
        };
    }, [messages, autoScroll]);

    // Scroll management
    useEffect(() => {
        if (chatRef.current && autoScroll) {
            // Set scroll lock to prevent button flicker
            scrollLockRef.current = true;
            
            // Clear any pending button show timeout
            if (buttonTimeoutRef.current) {
                clearTimeout(buttonTimeoutRef.current);
                buttonTimeoutRef.current = null;
            }

            const smooth = displayedMessages.length < 50; // Only smooth scroll for small message counts
            chatRef.current.scrollTo({
                top: chatRef.current.scrollHeight,
                behavior: smooth ? 'smooth' : 'auto'
            });
            
            setUnreadCount(0);
            setShowScrollButton(false);

            // Release scroll lock after scrolling completes
            setTimeout(() => {
                scrollLockRef.current = false;
            }, smooth ? 300 : 50); // Longer delay for smooth scroll
        }
    }, [displayedMessages, autoScroll]);

    // Debounced scroll handler
    const handleScroll = useCallback(() => {
        if (!chatRef.current || scrollLockRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        const isNearBottom = distanceFromBottom < SCROLL_THRESHOLD;

        setAutoScroll(isNearBottom);
        
        // Clear any existing button show timeout
        if (buttonTimeoutRef.current) {
            clearTimeout(buttonTimeoutRef.current);
            buttonTimeoutRef.current = null;
        }

        if (!isNearBottom) {
            // Add a small delay before showing the button to prevent flickering
            buttonTimeoutRef.current = setTimeout(() => {
                if (!scrollLockRef.current) {
                    setShowScrollButton(true);
                }
            }, 150);
        } else {
            setShowScrollButton(false);
            setUnreadCount(0);
        }
    }, []);

    // Scroll to bottom function
    const scrollToBottom = useCallback(() => {
        if (chatRef.current) {
            chatRef.current.scrollTo({
                top: chatRef.current.scrollHeight,
                behavior: 'smooth'
            });
            setAutoScroll(true);
            setShowScrollButton(false);
            setUnreadCount(0);
        }
    }, []);

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
        <div 
            className="flex-1 overflow-y-auto p-4 relative scroll-smooth" 
            ref={chatRef} 
            onScroll={handleScroll}
        >
            <div className="max-w-4xl mx-auto space-y-2">
                {displayedMessages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className="rounded p-2 bg-[#111111] hover:bg-[#1a1a1a] transition-colors"
                    >
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
                <div className="fixed bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ zIndex: 50 }}>
                    {unreadCount > 0 && (
                        <div className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs">
                            {unreadCount} new messages
                        </div>
                    )}
                    <ShinyButton
                        onClick={scrollToBottom}
                        className="dark:bg-[#1a1a1a] dark:text-white border border-gray-900 px-6 py-2 rounded-sm flex items-center gap-2"
                        shimmerSize="1.5px"
                        borderRadius="12px"
                    >
                        <ArrowDown className="w-4 h-4" />
                        Resume Scroll
                    </ShinyButton>
                </div>
            )}
        </div>
    );
}