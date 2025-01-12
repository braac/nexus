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
}

export default function SearchControls({ 
    onPlayerNameChange,
    onActChange,
    onModeChange,
    onSearch,
    isLoading
}: SearchControlsProps) {
    const [playerInput, setPlayerInput] = useState('');
    const [tagInput, setTagInput] = useState('');

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
                        <Label htmlFor="act" className="text-[#ff4655]">Act</Label>
                        <Select defaultValue="current" onValueChange={onActChange}>
                            <SelectTrigger 
                                id="act"
                                className="w-full bg-white/5 backdrop-blur-sm border-[#ff4655]/20 text-white
                                    focus:border-[#ff4655]/50 focus:ring-[#ff4655]/20"
                            >
                                <SelectValue placeholder="Select act" />
                            </SelectTrigger>
                            <SelectContent className="bg-black/95 backdrop-blur-xl border-[#ff4655]/20">
                                <SelectGroup>
                                    <SelectItem value="current" className="text-white focus:bg-[#ff4655]/20 focus:text-white">Current Act</SelectItem>
                                    <SelectItem value="previous" className="text-white focus:bg-[#ff4655]/20 focus:text-white">Previous Act</SelectItem>
                                    <SelectItem value="all" className="text-white focus:bg-[#ff4655]/20 focus:text-white">All Acts</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex-1">
                        <Label htmlFor="mode" className="text-[#ff4655]">Mode</Label>
                        <Select defaultValue="competitive" onValueChange={onModeChange}>
                            <SelectTrigger 
                                id="mode"
                                className="w-full bg-white/5 backdrop-blur-sm border-[#ff4655]/20 text-white
                                    focus:border-[#ff4655]/50 focus:ring-[#ff4655]/20"
                            >
                                <SelectValue placeholder="Select mode" />
                            </SelectTrigger>
                            <SelectContent className="bg-black/95 backdrop-blur-xl border-[#ff4655]/20">
                                <SelectGroup>
                                    <SelectItem value="competitive" className="text-white focus:bg-[#ff4655]/20 focus:text-white">Competitive</SelectItem>
                                    <SelectItem value="unrated" className="text-white focus:bg-[#ff4655]/20 focus:text-white">Unrated</SelectItem>
                                    <SelectItem value="spikerush" className="text-white focus:bg-[#ff4655]/20 focus:text-white">Spike Rush</SelectItem>
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
                                size={16}
                                strokeWidth={2}
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