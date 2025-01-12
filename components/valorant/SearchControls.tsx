'use client';

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
  onPlayerNameChange?: (name: string) => void;
  onActChange?: (act: string) => void;
  onModeChange?: (mode: string) => void;
  onSearch?: () => void;
  isLoading?: boolean;
}

const SearchControls = ({
  onPlayerNameChange,
  onActChange,
  onModeChange,
  onSearch,
  isLoading = false
}: SearchControlsProps) => {
  return (
    <div className="mb-8 flex gap-4 items-end">
      <div className="flex-[2]">
        <Label htmlFor="playerName" className="text-[#ff4655]">Player Name</Label>
        <Input 
          id="playerName"
          placeholder="Enter player name"
          className="w-full bg-white/5 backdrop-blur-sm border-[#ff4655]/20 text-white placeholder:text-[#ff4655]/40
            focus-visible:border-[#ff4655]/50 focus-visible:ring-[#ff4655]/20"
          defaultValue="Sentinel"
          onChange={(e) => onPlayerNameChange?.(e.target.value)}
        />
      </div>

      <div className="flex-1">
        <Label htmlFor="act" className="text-[#ff4655]">Act</Label>
        <Select defaultValue="all" onValueChange={onActChange}>
          <SelectTrigger 
            id="act"
            className="w-full bg-white/5 backdrop-blur-sm border-[#ff4655]/20 text-white
              focus:border-[#ff4655]/50 focus:ring-[#ff4655]/20"
          >
            <SelectValue placeholder="Select act" />
          </SelectTrigger>
          <SelectContent className="bg-black/95 backdrop-blur-xl border-[#ff4655]/20">
            <SelectGroup>
              <SelectItem value="all" className="text-white focus:bg-[#ff4655]/20 focus:text-white">All Acts</SelectItem>
              <SelectItem value="current" className="text-white focus:bg-[#ff4655]/20 focus:text-white">Episode 7 Act 3</SelectItem>
              <SelectItem value="previous" className="text-white focus:bg-[#ff4655]/20 focus:text-white">Episode 7 Act 2</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Label htmlFor="mode" className="text-[#ff4655]">Mode</Label>
        <Select defaultValue="comp" onValueChange={onModeChange}>
          <SelectTrigger 
            id="mode"
            className="w-full bg-white/5 backdrop-blur-sm border-[#ff4655]/20 text-white
              focus:border-[#ff4655]/50 focus:ring-[#ff4655]/20"
          >
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent className="bg-black/95 backdrop-blur-xl border-[#ff4655]/20">
            <SelectGroup>
              <SelectItem value="comp" className="text-white focus:bg-[#ff4655]/20 focus:text-white">Competitive</SelectItem>
              <SelectItem value="unrated" className="text-white focus:bg-[#ff4655]/20 focus:text-white">Unrated</SelectItem>
              <SelectItem value="spike" className="text-white focus:bg-[#ff4655]/20 focus:text-white">Spike Rush</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Button 
        disabled={isLoading} 
        onClick={onSearch}
        className="bg-[#ff4655] hover:bg-[#ff4655]/90 text-white"
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
  );
};

export default SearchControls;