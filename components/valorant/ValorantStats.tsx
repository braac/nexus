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
      {/* Background with multiple gradient layers */}
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-red-600 before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-red-900 after:via-red-700 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-red-700 before:dark:opacity-10 after:dark:from-red-900 after:dark:via-[#ff4655] after:dark:opacity-40 before:lg:h-[360px] z-[-1]" />
      
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#1a0000] via-black to-black opacity-90" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Controls Section */}
        <div className="mb-8 flex flex-col gap-4">
          {/* Player Name Input */}
          <div className="space-y-2">
            <Label htmlFor="playerName" className="text-[#ff4655]">Player Name</Label>
            <Input 
              id="playerName"
              placeholder="Enter player name"
              className="bg-black/40 border-[#ff4655]/20 text-white placeholder:text-[#ff4655]/40
                focus-visible:border-[#ff4655]/50 focus-visible:ring-[#ff4655]/20"
              defaultValue="Sentinel"
            />
          </div>

          {/* Filters Row */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="act" className="text-[#ff4655] block mb-2">Act</Label>
              <Select defaultValue="all">
                <SelectTrigger 
                  id="act"
                  className="w-full bg-black/40 border-[#ff4655]/20 text-white
                    focus:border-[#ff4655]/50 focus:ring-[#ff4655]/20"
                >
                  <SelectValue placeholder="Select act" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F1923] border-[#ff4655]/20">
                  <SelectGroup>
                    <SelectItem value="all" className="text-white focus:bg-[#ff4655]/20 focus:text-white">All Acts</SelectItem>
                    <SelectItem value="current" className="text-white focus:bg-[#ff4655]/20 focus:text-white">Episode 7 Act 3</SelectItem>
                    <SelectItem value="previous" className="text-white focus:bg-[#ff4655]/20 focus:text-white">Episode 7 Act 2</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label htmlFor="mode" className="text-[#ff4655] block mb-2">Mode</Label>
              <Select defaultValue="comp">
                <SelectTrigger 
                  id="mode"
                  className="w-full bg-black/40 border-[#ff4655]/20 text-white
                    focus:border-[#ff4655]/50 focus:ring-[#ff4655]/20"
                >
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F1923] border-[#ff4655]/20">
                  <SelectGroup>
                    <SelectItem value="comp" className="text-white focus:bg-[#ff4655]/20 focus:text-white">Competitive</SelectItem>
                    <SelectItem value="unrated" className="text-white focus:bg-[#ff4655]/20 focus:text-white">Unrated</SelectItem>
                    <SelectItem value="spike" className="text-white focus:bg-[#ff4655]/20 focus:text-white">Spike Rush</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Rank Display */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card className="bg-black/20 border-[#ff4655]/10">
            <CardContent className="p-4">
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

          <Card className="bg-black/20 border-[#ff4655]/10">
            <CardContent className="p-4">
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
            <Card key={stat.label} className="bg-black/20 border-[#ff4655]/10">
              <CardContent className="p-4">
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
          <Card className="bg-black/20 border-[#ff4655]/10">
            <CardContent className="p-4">
              <h3 className="text-sm text-[#ff4655] font-medium mb-1">Matches Won</h3>
              <div className="text-2xl font-bold text-white">
                <NumberTicker value={32} />
              </div>
              <p className="text-xs text-[#ff4655]/60">Last 50 games</p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-[#ff4655]/10">
            <CardContent className="p-4">
              <h3 className="text-sm text-[#ff4655] font-medium mb-1">Matches Lost</h3>
              <div className="text-2xl font-bold text-white">
                <NumberTicker value={18} />
              </div>
              <p className="text-xs text-[#ff4655]/60">Last 50 games</p>
            </CardContent>
          </Card>
        </div>

        {/* Tracker Score */}
        <Card className="bg-black/20 border-[#ff4655]/10">
          <CardContent className="p-4">
            <h2 className="text-sm text-[#ff4655] font-medium mb-1">Tracker Score</h2>
            <div className="text-2xl font-bold text-white">
              <NumberTicker value={2750} />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}