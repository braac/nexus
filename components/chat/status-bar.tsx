// components/StatusBar.tsx
'use client';

import React from 'react';
import { ChatViewerProps } from '@/lib/types';

interface StatusBarProps {
    connected: ChatViewerProps['connected'];
    currentChannel: ChatViewerProps['currentChannel'];
}

export default function StatusBar({ connected, currentChannel }: StatusBarProps) {
    return (
        <div className="p-2 border-t border-gray-800 bg-[#0f0f0f]">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm text-gray-400">
                        {connected ? 'Connected to chat' : 'Disconnected'}
                    </span>
                </div>
                <div className="text-sm text-gray-400">
                    Watching: {currentChannel}
                </div>
            </div>
        </div>
    );
}
