// components/valorant/SearchControls.tsx
'use client';

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface SearchControlsProps {
    onPlayerNameChange: (name: string, tag: string) => void;
    onActChange: (act: string) => void;
    onModeChange: (mode: string) => void;
    onSearch: () => void;
    isLoading: boolean;
    seasons?: Array<{id: string, name: string}>;
}

export default function SearchControls({ 
    onPlayerNameChange,
    onActChange,
    onModeChange,
    onSearch,
    isLoading,
    seasons = []
}: SearchControlsProps) {
    const [playerInput, setPlayerInput] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [selectedMode, setSelectedMode] = useState('Auto');

    // Only include modes supported by the Tracker Network API
    const modes = [
        'Auto',
        'Competitive',
        'Unrated',
        'Swiftplay',
        'Spike Rush',
        'Deathmatch',
        'Escalation',
        'Team Deathmatch',
        'Replication',
        'Snowball Fight'
    ] as const;

    const handlePlayerInput = (value: string) => {
        setPlayerInput(value);
        const [name, tag] = value.split('#');
        if (tag) {
            setTagInput(tag);
            onPlayerNameChange(name, tag);
        } else {
            onPlayerNameChange(value, tagInput);
        }
    };

    const handleTagInput = (value: string) => {
        setTagInput(value);
        onPlayerNameChange(playerInput, value);
    };

    const handleModeChange = (value: string) => {
        setSelectedMode(value);
        onModeChange(value);
    };

    // Filter out any seasons with missing id or name
    const validSeasons = seasons.filter(season => season && season.id && season.name);

    return (
        <div className="mb-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-4">
                    <div className="flex-[2]">
                        <Label htmlFor="playerName" className="text-[#ff4655]">Player Name</Label>
                        <Input 
                            id="playerName"
                            value={playerInput}
                            onChange={(e) => handlePlayerInput(e.target.value)}
                            placeholder="Enter player name"
                            className="w-full bg-white/5 backdrop-blur-sm border-[#ff4655]/20 text-white placeholder:text-[#ff4655]/40
                                focus-visible:border-[#ff4655]/50 focus-visible:ring-[#ff4655]/20"
                        />
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="tag" className="text-[#ff4655]">Tag</Label>
                        <Input 
                            id="tag"
                            value={tagInput}
                            onChange={(e) => handleTagInput(e.target.value)}
                            placeholder="#TAG"
                            className="w-full bg-white/5 backdrop-blur-sm border-[#ff4655]/20 text-white placeholder:text-[#ff4655]/40
                                focus-visible:border-[#ff4655]/50 focus-visible:ring-[#ff4655]/20"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <Label htmlFor="mode" className="text-[#ff4655]">Mode</Label>
                        <Select defaultValue="Auto" onValueChange={handleModeChange}>
                            <SelectTrigger 
                                id="mode"
                                className="bg-white/5 backdrop-blur-sm border-[#ff4655]/20 text-white
                                    focus:border-[#ff4655]/50 focus:ring-[#ff4655]/20"
                            >
                                <SelectValue placeholder="Mode" />
                            </SelectTrigger>
                            <SelectContent className="bg-black/95 backdrop-blur-xl border-[#ff4655]/20">
                                <SelectGroup>
                                    {modes.map((mode) => (
                                        <SelectItem 
                                            key={`mode-${mode.toLowerCase().replace(/\s+/g, '-')}`}
                                            value={mode}
                                            className="text-white focus:bg-[#ff4655]/20 focus:text-white"
                                        >
                                            {mode}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex-1">
                        <Label htmlFor="season" className="text-[#ff4655]">Season</Label>
                        <Select 
                            defaultValue="Auto"
                            onValueChange={onActChange}
                            disabled={selectedMode === 'Auto'}
                        >
                            <SelectTrigger 
                                id="season"
                                className="bg-white/5 backdrop-blur-sm border-[#ff4655]/20 text-white
                                    focus:border-[#ff4655]/50 focus:ring-[#ff4655]/20"
                            >
                                <SelectValue placeholder="Season" />
                            </SelectTrigger>
                            <SelectContent className="bg-black/95 backdrop-blur-xl border-[#ff4655]/20">
                                <SelectGroup>
                                    <SelectItem 
                                        key="season-auto" 
                                        value="Auto" 
                                        className="text-white focus:bg-[#ff4655]/20 focus:text-white"
                                    >
                                        Auto
                                    </SelectItem>
                                    {validSeasons.map((season, index) => (
                                        <SelectItem 
                                            key={`season-${season.id || index}`}
                                            value={season.id}
                                            className="text-white focus:bg-[#ff4655]/20 focus:text-white"
                                        >
                                            {season.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button 
                        disabled={isLoading} 
                        onClick={onSearch}
                        className="self-end bg-[#ff4655] hover:bg-[#ff4655]/90 text-white"
                    >
                        {isLoading && (
                            <LoaderCircle
                                className="-ms-1 me-2 h-4 w-4 animate-[spin_0.9s_linear_infinite]"
                                aria-hidden="true"
                            />
                        )}
                        Search
                    </Button>
                </div>
            </div>
        </div>
    );
}