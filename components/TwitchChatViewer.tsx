'use client'

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import AnimatedGradientText from '@/components/ui/animated-gradient-text';
import ShinyButton from '@/components/ui/shimmer-button';

// WebSocket connection singleton
class TwitchWebSocket {
    private static instance: TwitchWebSocket | null = null;
    private ws: WebSocket | null = null;
    private currentChannel: string = '';
    private pingInterval: NodeJS.Timeout | null = null;
    private listeners: Set<(data: string) => void> = new Set();
    private statusListeners: Set<(status: boolean) => void> = new Set();

    private constructor() { }

    static getInstance(): TwitchWebSocket {
        if (!TwitchWebSocket.instance) {
            TwitchWebSocket.instance = new TwitchWebSocket();
        }
        return TwitchWebSocket.instance;
    }

    addListener(callback: (data: string) => void) {
        this.listeners.add(callback);
    }

    removeListener(callback: (data: string) => void) {
        this.listeners.delete(callback);
    }

    addStatusListener(callback: (status: boolean) => void) {
        this.statusListeners.add(callback);
        if (this.ws) {
            callback(this.ws.readyState === WebSocket.OPEN);
        }
    }

    removeStatusListener(callback: (status: boolean) => void) {
        this.statusListeners.delete(callback);
    }

    private notifyListeners(data: string) {
        this.listeners.forEach(listener => listener(data));
    }

    private updateStatus(status: boolean) {
        this.statusListeners.forEach(listener => listener(status));
    }

    connect(channel: string) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            if (this.currentChannel) {
                this.ws.send(`PART #${this.currentChannel}`);
            }
            this.ws.send(`JOIN #${channel}`);
            this.currentChannel = channel;
            return;
        }

        if (this.ws) {
            this.ws.close();
        }

        if (this.pingInterval) {
            clearInterval(this.pingInterval);
        }

        this.ws = new WebSocket('wss://irc-ws.chat.twitch.tv');
        this.currentChannel = channel;

        this.ws.onopen = () => {
            if (!this.ws) return;

            this.updateStatus(true);
            this.ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
            this.ws.send('PASS SCHMOOPIIE');
            this.ws.send('NICK justinfan19922');
            this.ws.send('USER justinfan19922 8 * :justinfan19922');
            this.ws.send(`JOIN #${channel}`);

            this.pingInterval = setInterval(() => {
                if (this.ws?.readyState === WebSocket.OPEN) {
                    this.ws.send('PING');
                }
            }, 20000);
        };

        this.ws.onmessage = (event) => {
            if (event.data.startsWith('PING')) {
                this.ws?.send('PONG');
                return;
            }
            this.notifyListeners(event.data);
        };

        this.ws.onclose = () => {
            this.updateStatus(false);
            if (this.pingInterval) {
                clearInterval(this.pingInterval);
            }
        };

        this.ws.onerror = () => {
            this.updateStatus(false);
        };
    }

    disconnect() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
        }
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.currentChannel = '';
        this.updateStatus(false);
    }
}

interface EmotePosition {
    start: number;
    end: number;
}

interface Emote {
    id: string;
    positions: EmotePosition[];
}

interface Message {
    id: string;
    user: string;
    color: string;
    badges: string;
    message: string;
    emotes: Emote[];
    timestamp: Date;
}

// Badge URL mapping
const BADGE_URLS: Record<string, string> = {
    'broadcaster/1': 'https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/2',
    'moderator/1': 'https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/1',
    'vip/1': 'https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/1',
    'partner/1': 'https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/1',
    'premium/1': 'https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/1',
    'turbo/1': 'https://static-cdn.jtvnw.net/badges/v1/bd444ec6-8f34-4bf9-91f4-af1e3428d80f/1',
    'sub-gifter/1': 'https://static-cdn.jtvnw.net/badges/v1/a5ef6c17-2e5b-4d8f-9b80-2779fd722414/1',
    'sub-gifter/50': 'https://static-cdn.jtvnw.net/badges/v1/c4a29737-e8a5-4420-917a-314a447f083e/1',
    'sub-gifter/100': 'https://static-cdn.jtvnw.net/badges/v1/8343ada7-3451-434e-91c4-e82bdcf54460/1',
    'bits/1': 'https://static-cdn.jtvnw.net/badges/v1/73b5c3fb-24f9-4a82-a852-2f475b59411c/1',
};

const parseTags = (tagString: string) => {
    if (!tagString) return {};
    return tagString.split(';').reduce((acc: Record<string, string>, tag: string) => {
        const [key, value] = tag.split('=');
        acc[key] = value;
        return acc;
    }, {});
};

const parseEmotes = (emoteString: string): Emote[] => {
    if (!emoteString) return [];
    return emoteString.split('/').map(emote => {
        const [id, positions] = emote.split(':');
        return {
            id,
            positions: positions.split(',').map(pos => {
                const [start, end] = pos.split('-');
                return { start: parseInt(start), end: parseInt(end) };
            })
        };
    });
};

export default function TwitchChatViewer() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [channel, setChannel] = useState('sodapoppin');
    const [inputChannel, setInputChannel] = useState('');
    const [autoScroll, setAutoScroll] = useState(true);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const chatRef = useRef<HTMLDivElement | null>(null);
    const twitchWS = useRef<TwitchWebSocket>(TwitchWebSocket.getInstance());

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

    useEffect(() => {
        const ws = twitchWS.current;

        const handleMessage = (message: string) => {
            if (!message.includes('PRIVMSG')) return;

            const messageParts = message.split(' ');
            const tags = messageParts[0];
            const messageText = messageParts.slice(4).join(' ').slice(1);
            const parsedTags = parseTags(tags.slice(1));

            setMessages(prev => [...prev, {
                id: parsedTags['id'],
                user: parsedTags['display-name'],
                color: parsedTags['color'] || '#FFFFFF',
                badges: parsedTags['badges'],
                message: messageText,
                emotes: parseEmotes(parsedTags['emotes']),
                timestamp: new Date(parseInt(parsedTags['tmi-sent-ts']))
            }]);
        };

        const handleStatus = (status: boolean) => {
            setConnected(status);
            if (!status) {
                setError('Disconnected from chat');
            } else {
                setError(null);
            }
        };

        ws.addListener(handleMessage);
        ws.addStatusListener(handleStatus);
        ws.connect(channel);

        return () => {
            ws.removeListener(handleMessage);
            ws.removeStatusListener(handleStatus);
        };
    }, [channel]);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputChannel.trim()) {
            setMessages([]);
            setChannel(inputChannel.trim().toLowerCase());
            setInputChannel('');
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#0a0a0a]">
            <div className="p-4 border-b border-gray-800 bg-[#0f0f0f]">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={inputChannel}
                            onChange={(e) => setInputChannel(e.target.value)}
                            placeholder="Enter channel name"
                            className="flex-1 px-3 py-2 rounded bg-[#1a1a1a] border border-gray-700 text-white focus:outline-none focus:border-blue-500"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                        >
                            Join Channel
                        </button>
                    </form>
                </div>
            </div>

            {error && (
                <Alert variant="destructive" className="m-2 bg-red-950 border-red-900">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

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
            shimmerSize='1.5px'
            borderRadius='12px'
        >
            Resume Scroll
        </ShinyButton>
    </div>
)}
            </div>

            <div className="p-2 border-t border-gray-800 bg-[#0f0f0f]">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-sm text-gray-400">
                            {connected ? 'Connected to chat' : 'Disconnected'}
                        </span>
                    </div>
                    <div className="text-sm text-gray-400">
                        Watching: {channel}
                    </div>
                </div>
            </div>
        </div>
    );
}