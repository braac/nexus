'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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

// Parse Twitch IRC tags into an object
const parseTags = (tagString: string) => {
  if (!tagString) return {};
  return tagString.split(';').reduce((acc: Record<string, string>, tag: string) => {
    const [key, value] = tag.split('=');
    acc[key] = value;
    return acc;
  }, {});
};

// Parse Twitch emotes string into an array of emote objects
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
  const [channel, setChannel] = useState('hamy');
  const [inputChannel, setInputChannel] = useState('');
  const ws = useRef<WebSocket | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const connectToChannel = useCallback((channelName: string) => {
    if (ws.current) {
      ws.current.close();
    }

    ws.current = new WebSocket('wss://irc-ws.chat.twitch.tv');

    ws.current.onopen = () => {
      setConnected(true);
      setError(null);
      
      // Send initial connection messages
      if (ws.current) {
        ws.current.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
        ws.current.send('PASS oauth:jdv6wslre6dkrb815q9n3ntj69v8ft');
        ws.current.send('NICK xbraac');
        ws.current.send('USER xbraac 8 * :xbraac');
        ws.current.send(`JOIN #${channelName}`);
      }
    };

    ws.current.onmessage = (event) => {
      const message = event.data;
      
      // Handle PING messages
      if (message.startsWith('PING')) {
        ws.current?.send('PONG');
        return;
      }

      // Parse chat messages
      if (message.includes('PRIVMSG')) {
        const messageParts = message.split(' ');
        const tags = messageParts[0];
        const messageText = messageParts.slice(4).join(' ').slice(1); // Remove leading colon
        const parsedTags = parseTags(tags.slice(1)); // Remove leading @
        
        setMessages(prev => [...prev, {
          id: parsedTags['id'],
          user: parsedTags['display-name'],
          color: parsedTags['color'] || '#FFFFFF',
          badges: parsedTags['badges'],
          message: messageText,
          emotes: parseEmotes(parsedTags['emotes']),
          timestamp: new Date(parseInt(parsedTags['tmi-sent-ts']))
        }]);
      }
    };

    ws.current.onerror = () => {
      setError('WebSocket connection error');
      setConnected(false);
    };

    ws.current.onclose = () => {
      setConnected(false);
      // Attempt to reconnect after 5 seconds
      setTimeout(() => connectToChannel(channelName), 5000);
    };
  }, []);

  useEffect(() => {
    connectToChannel(channel);

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [channel, connectToChannel]);

  // Render badges
  const renderBadges = (badgeString: string) => {
    if (!badgeString) return null;
    return badgeString.split(',').map((badge, index) => {
      const [type, version] = badge.split('/');
      const badgeUrl = `https://static-cdn.jtvnw.net/badges/v1/${type}/${version}/1`;
      return (
        <div key={`${type}-${version}-${index}`} className="inline-block mr-1">
          <Image
            src={badgeUrl}
            alt={type}
            width={16}
            height={16}
            unoptimized // Since these are already small images from CDN
          />
        </div>
      );
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputChannel.trim()) {
      setMessages([]); // Clear existing messages
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
      
      <div className="flex-1 overflow-y-auto p-4" ref={chatRef}>
        <div className="max-w-4xl mx-auto space-y-2">
          {messages.map((msg) => (
            <div key={msg.id} className="rounded p-2 bg-[#111111] hover:bg-[#1a1a1a] transition-colors">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0">
                  {renderBadges(msg.badges)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold" style={{ color: msg.color }}>
                    {msg.user}
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