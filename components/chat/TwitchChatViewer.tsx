// components/chat/TwitchChatViewer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// Import chat-specific components from the same directory
import ChannelSearch from '@/components/chat/channel-search';
import ChatMessages from '@/components/chat/chat-messages';
import StatusBar from '@/components/chat/status-bar';

// Import types and services from their new locations
import { Message } from '@/lib/types';
import { TwitchWebSocket, parseTags, parseEmotes } from '@/services/twitch-websocket';

export default function TwitchChatViewer() {
    // State management for chat functionality
    const [messages, setMessages] = useState<Message[]>([]);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [channel, setChannel] = useState('sodapoppin');
    const twitchWS = React.useRef<TwitchWebSocket>(TwitchWebSocket.getInstance());

    // Set up WebSocket connection and message handling
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

        // Set up event listeners
        ws.addMessageListener(handleMessage);
        ws.addStatusListener(handleStatus);
        ws.connect(channel);

        // Cleanup function to remove listeners
        return () => {
            ws.removeMessageListener(handleMessage);
            ws.removeStatusListener(handleStatus);
        };
    }, [channel]);

    const handleChannelChange = (newChannel: string) => {
        setMessages([]);
        setChannel(newChannel);
    };

    return (
        <div className="flex flex-col h-screen bg-[#0a0a0a]">
            <ChannelSearch onChannelChange={handleChannelChange} />

            {error && (
                <Alert variant="destructive" className="m-2 bg-red-950 border-red-900">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <ChatMessages messages={messages} />
            
            <StatusBar connected={connected} currentChannel={channel} />
        </div>
    );
}