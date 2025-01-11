// components/valorant/ValorantStats.tsx
'use client';

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GradientText } from "@/components/ui/gradient-text";
import NumberTicker from "@/components/ui/number-ticker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ValorantStats() {
  return (
    <main className="flex min-h-screen flex-col relative overflow-hidden">
      {/* Enhanced background with more visible gradients */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0000] via-[#0a0000] to-black" />
        
        {/* Radial gradients with animation */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,70,85,0.15),transparent_70%)] opacity-75 animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,70,85,0.12),transparent_50%)] opacity-60 animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,70,85,0.08),transparent_50%)] opacity-50 animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />
        
        {/* Moving gradient overlay */}
        <div className="absolute inset-0 bg-gradient-conic from-transparent via-[#ff4655]/5 to-transparent opacity-30 animate-spin" style={{ animationDuration: '10s' }} />
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Controls Section */}
        <div className="mb-8 flex gap-4">
          <div className="flex-1">
            <Label htmlFor="playerName" className="text-[#ff4655]">Player Name</Label>
            <Input 
              id="playerName"
              placeholder="Enter player name"
              className="w-full bg-white/5 backdrop-blur-sm border-[#ff4655]/20 text-white placeholder:text-[#ff4655]/40
                focus-visible:border-[#ff4655]/50 focus-visible:ring-[#ff4655]/20"
              defaultValue="Sentinel"
            />
          </div>

          <div className="flex-1">
            <Label htmlFor="act" className="text-[#ff4655]">Act</Label>
            <Select defaultValue="all">
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
            <Select defaultValue="comp">
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
        </div>

        {/* Rank Display */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card className="relative bg-white/5 backdrop-blur-sm border-[#ff4655]/10 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff4655]/10 via-[#ff4655]/5 to-transparent opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000" />
            <CardContent className="p-4 relative">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-[#ff4655]/20 to-transparent" />
                <div>
                  <h3 className="text-sm text-[#ff4655] font-medium mb-1">Peak Rank</h3>
                  <GradientText
                    colors={["#ff4655", "#ff8f98", "#ff4655"]}
                    animationSpeed={3}
                    className="text-xl font-bold"
                  >
                    Diamond II
                  </GradientText>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative bg-white/5 backdrop-blur-sm border-[#ff4655]/10 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff4655]/10 via-[#ff4655]/5 to-transparent opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000" />
            <CardContent className="p-4 relative">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-[#ff4655]/20 to-transparent" />
                <div>
                  <h3 className="text-sm text-[#ff4655] font-medium mb-1">Current Rank</h3>
                  <GradientText
                    colors={["#ff4655", "#ff8f98", "#ff4655"]}
                    animationSpeed={3}
                    className="text-xl font-bold"
                  >
                    Diamond I
                  </GradientText>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          {[
            {
              label: 'Average Combat Score',
              value: 245.0,
              percentile: 15
            },
            {
              label: 'K/D Ratio',
              value: 1.25,
              percentile: 22
            },
            {
              label: 'Headshot %',
              value: 28.5,
              percentile: 18
            },
            {
              label: 'Win Rate',
              value: 54.2,
              percentile: 25
            }
          ].map((stat, index) => (
            <Card key={stat.label} className="relative bg-white/5 backdrop-blur-sm border-[#ff4655]/10 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff4655]/10 via-[#ff4655]/5 to-transparent opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000" />
              <CardContent className="p-4 relative">
                <h3 className="text-sm text-[#ff4655] font-medium mb-1">{stat.label}</h3>
                <div className="text-2xl font-bold text-white">
                  <NumberTicker 
                    value={stat.value} 
                    decimalPlaces={index === 1 ? 2 : 1}
                  />
                </div>
                <p className="text-xs text-[#ff4655]/60">Top {stat.percentile}%</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Win/Loss Display */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card className="relative bg-white/5 backdrop-blur-sm border-[#ff4655]/10 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff4655]/10 via-[#ff4655]/5 to-transparent opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000" />
            <CardContent className="p-4 relative">
              <h3 className="text-sm text-[#ff4655] font-medium mb-1">Matches Won</h3>
              <div className="text-2xl font-bold text-white">
                <NumberTicker value={32} />
              </div>
              <p className="text-xs text-[#ff4655]/60">Top 12%</p>
            </CardContent>
          </Card>

          <Card className="relative bg-white/5 backdrop-blur-sm border-[#ff4655]/10 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff4655]/10 via-[#ff4655]/5 to-transparent opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000" />
            <CardContent className="p-4 relative">
              <h3 className="text-sm text-[#ff4655] font-medium mb-1">Matches Lost</h3>
              <div className="text-2xl font-bold text-white">
                <NumberTicker value={18} />
              </div>
              <p className="text-xs text-[#ff4655]/60">Top 8%</p>
            </CardContent>
          </Card>
        </div>

        {/* Tracker Score */}
        <Card className="relative bg-white/5 backdrop-blur-sm border-[#ff4655]/10 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#ff4655]/10 via-[#ff4655]/5 to-transparent opacity-75 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000" />
          <CardContent className="p-4 relative">
            <h2 className="text-sm text-[#ff4655] font-medium mb-1">Tracker Score</h2>
            <div className="text-2xl font-bold text-white">
              <NumberTicker value={2750} />
            </div>
            <p className="text-xs text-[#ff4655]/60">Top 5%</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}