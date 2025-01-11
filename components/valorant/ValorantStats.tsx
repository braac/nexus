import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import NumberTicker from "@/components/ui/number-ticker";
import ShimmerButton from "@/components/ui/shimmer-button";

export default function ValorantStats() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background animations - similar to homepage */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 animate-gradient bg-gradient-dark" />
        <div 
          className="absolute inset-0 animate-gradient opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(75,75,75,0.3),transparent_70%)]" 
          style={{ animationDelay: '-5s' }} 
        />
        <div 
          className="absolute inset-0 animate-gradient opacity-20 bg-[radial-gradient(circle_at_0%_0%,rgba(100,100,100,0.2),transparent_50%)]" 
          style={{ animationDelay: '-10s' }} 
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Card */}
        <Card className="mb-8 bg-white/10 backdrop-blur-xl border-white/20 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              {/* Player Card */}
              <div className="relative size-32 rounded-lg bg-gradient-to-br from-red-500/20 to-purple-500/20 backdrop-blur-sm">
                <div className="absolute inset-0 bg-black/20 rounded-lg" />
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <AnimatedGradientText>
                      <h1 className="text-4xl font-bold mb-2">Sentinel</h1>
                    </AnimatedGradientText>
                    <p className="text-gray-400 text-lg">#VALOR</p>
                  </div>

                  {/* Filters */}
                  <div className="flex gap-4">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select act" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Acts</SelectItem>
                        <SelectItem value="current">Episode 7 Act 3</SelectItem>
                        <SelectItem value="previous">Episode 7 Act 2</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select defaultValue="comp">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comp">Competitive</SelectItem>
                        <SelectItem value="unrated">Unrated</SelectItem>
                        <SelectItem value="spike">Spike Rush</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracker Score */}
        <Card className="mb-8 bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg text-gray-400 mb-1">Tracker Score</h2>
                <div className="text-3xl font-bold">
                  <NumberTicker value={2750} />
                </div>
              </div>
              <ShimmerButton className="bg-red-500/10">
                View Detailed Stats
              </ShimmerButton>
            </div>
          </CardContent>
        </Card>

        {/* Rank Display */}
        <div className="mb-8 grid grid-cols-2 gap-4">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-red-500/20 to-purple-500/20" />
                <div>
                  <h3 className="text-sm text-gray-400">Peak Rank</h3>
                  <AnimatedGradientText>
                    <span className="text-lg font-semibold">Diamond II</span>
                  </AnimatedGradientText>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-red-500/20 to-purple-500/20" />
                <div>
                  <h3 className="text-sm text-gray-400">Current Rank</h3>
                  <AnimatedGradientText>
                    <span className="text-lg font-semibold">Diamond I</span>
                  </AnimatedGradientText>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-4 gap-4">
          {['Average Combat Score', 'K/D Ratio', 'Headshot %', 'Win Rate'].map((stat, index) => (
            <Card key={stat} className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardContent className="p-6">
                <h3 className="mb-2 text-sm text-gray-400">{stat}</h3>
                <div className="text-2xl font-bold text-white">
                  <NumberTicker 
                    value={[245, 1.25, 28.5, 54.2][index]} 
                    decimalPlaces={index === 1 ? 2 : 1}
                  />
                </div>
                <p className="text-xs text-gray-400">Top {[15, 22, 18, 25][index]}%</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Win/Loss Display */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-6">
              <h3 className="mb-2 text-sm text-gray-400">Matches Won</h3>
              <div className="text-2xl font-bold text-white">
                <NumberTicker value={32} />
              </div>
              <p className="text-xs text-gray-400">Last 50 games</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-6">
              <h3 className="mb-2 text-sm text-gray-400">Matches Lost</h3>
              <div className="text-2xl font-bold text-white">
                <NumberTicker value={18} />
              </div>
              <p className="text-xs text-gray-400">Last 50 games</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}