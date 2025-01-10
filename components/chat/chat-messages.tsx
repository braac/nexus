// components/chat/chat-messages.tsx
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

const MESSAGE_LIMIT = 200;
const SCROLL_THRESHOLD = 100;

export default function ChatMessages({ messages }: ChatMessagesProps) {
    // State management for the chat interface
    const [autoScroll, setAutoScroll] = useState(true);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
    const [pendingMessages, setPendingMessages] = useState<Message[]>([]);

    // Refs for managing scroll behavior and message processing
    const chatRef = useRef<HTMLDivElement | null>(null);
    const scrollLockRef = useRef(false);
    const buttonTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastProcessedMessageRef = useRef<string | null>(null);

    // Main message processing effect
    useEffect(() => {
        console.log('Message processing started:', {
            totalMessages: messages.length,
            autoScroll,
            currentUnreadCount: unreadCount
        });

        if (messages.length === 0) return;

        const lastProcessedIndex = lastProcessedMessageRef.current 
            ? messages.findIndex(m => m.id === lastProcessedMessageRef.current)
            : -1;

        console.log('Finding new messages:', {
            lastProcessedId: lastProcessedMessageRef.current,
            lastProcessedIndex,
            autoScrollState: autoScroll
        });

        const newMessages = lastProcessedIndex === -1 
            ? [messages[messages.length - 1]]
            : messages.slice(lastProcessedIndex + 1);

        console.log('New messages to process:', {
            count: newMessages.length,
            messageIds: newMessages.map(m => m.id)
        });

        if (newMessages.length === 0) return;

        lastProcessedMessageRef.current = messages[messages.length - 1].id;

        if (autoScroll) {
            console.log('Updating displayed messages (auto-scroll)');
            setDisplayedMessages(prev => {
                const combined = [...prev, ...newMessages];
                return combined.slice(-MESSAGE_LIMIT);
            });
        } else {
            console.log('Updating pending messages and count (scrolled up)');
            setPendingMessages(prev => [...prev, ...newMessages]);
            setUnreadCount(prev => {
                const newCount = prev + newMessages.length;
                console.log('Updating unread count:', { prevCount: prev, newCount });
                return newCount;
            });
        }
    }, [messages, autoScroll, unreadCount]);

    // Auto-scroll effect
    useEffect(() => {
        if (chatRef.current && autoScroll) {
            scrollLockRef.current = true;
            
            if (buttonTimeoutRef.current) {
                clearTimeout(buttonTimeoutRef.current);
                buttonTimeoutRef.current = null;
            }

            const smooth = displayedMessages.length < 50;
            chatRef.current.scrollTo({
                top: chatRef.current.scrollHeight,
                behavior: smooth ? 'smooth' : 'auto'
            });
            
            setUnreadCount(0);
            setShowScrollButton(false);

            setTimeout(() => {
                scrollLockRef.current = false;
            }, smooth ? 300 : 50);
        }
    }, [displayedMessages, autoScroll]);

    // Scroll event handler
    const handleScroll = useCallback(() => {
        if (!chatRef.current || scrollLockRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        const isNearBottom = distanceFromBottom < SCROLL_THRESHOLD;

        console.log('Scroll event:', {
            isNearBottom,
            distanceFromBottom,
            previousAutoScroll: autoScroll
        });

        setAutoScroll(isNearBottom);
        
        if (buttonTimeoutRef.current) {
            clearTimeout(buttonTimeoutRef.current);
            buttonTimeoutRef.current = null;
        }

        if (!isNearBottom) {
            buttonTimeoutRef.current = setTimeout(() => {
                if (!scrollLockRef.current) {
                    setShowScrollButton(true);
                }
            }, 150);
        } else {
            setShowScrollButton(false);
            setUnreadCount(0);
        }
    }, [autoScroll]);

    // Resume chat handler
    const scrollToBottom = useCallback(() => {
        if (!chatRef.current) return;

        console.log('Resuming chat:', {
            pendingMessageCount: pendingMessages.length,
            currentUnreadCount: unreadCount
        });

        if (pendingMessages.length > 0) {
            setDisplayedMessages(prev => {
                const combined = [...prev, ...pendingMessages];
                return combined.slice(-MESSAGE_LIMIT);
            });
            setPendingMessages([]);
        }

        setTimeout(() => {
            if (chatRef.current) {
                chatRef.current.scrollTo({
                    top: chatRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }, 50);

        setAutoScroll(true);
        setShowScrollButton(false);
        setUnreadCount(0);
    }, [pendingMessages, unreadCount]);

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
                        <div className="bg-purple-600/10 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs border border-white/10 shadow-lg transition-all duration-200 hover:bg-purple-700/30">
                            {unreadCount} new messages
                        </div>
                    )}
                    <ShinyButton
                        onClick={scrollToBottom}
                        className="dark:bg-[#1a1a1a] dark:text-white border border-gray-900 px-6 py-2 rounded-sm flex items-center gap-2 shadow-lg"
                        shimmerSize="1.5px"
                        borderRadius="12px"
                    >
                        <ArrowDown className="w-4 h-4" />
                        Resume Chat
                    </ShinyButton>
                </div>
            )}
        </div>
    );
}