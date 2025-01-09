// components/ChannelSearch.tsx
'use client';

import React, { useState } from 'react';
import { ChatViewerProps } from '@/lib/types';

interface ChannelSearchProps {
    onChannelChange: ChatViewerProps['onChannelChange'];
}

export default function ChannelSearch({ onChannelChange }: ChannelSearchProps) {
    const [inputChannel, setInputChannel] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputChannel.trim()) {
            onChannelChange(inputChannel.trim().toLowerCase());
            setInputChannel('');
        }
    };

    return (
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
    );
}
