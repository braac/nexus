// components/valorant/StatDashboard.tsx
'use client';

import { memo } from 'react';
import StatCard from './StatCard';
import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import type { ProfileResponse, SeasonData } from '@/services/valorant-api';

interface StatDashboardProps {
  data: {
    profile: ProfileResponse;
    seasonData?: SeasonData[];
  };
  mode: string;
}

const StatDashboard = memo(({ data, mode }: StatDashboardProps) => {
  // Use either the standard profile stats or season stats based on mode
  const displayStats = mode === 'Auto' 
    ? data.profile.stats 
    : data.seasonData?.[0]?.stats;

  if (!displayStats) {
    return (
      <div className="text-center text-gray-400">
        No stats available for this player
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <Card className="bg-white/5 backdrop-blur-sm border-[#ff4655]/10">
        <CardContent className="p-6 flex items-center gap-6">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gradient-to-br from-[#ff4655]/10 to-transparent">
            {data.profile.platformInfo.avatarUrl ? (
              <Image
                src={data.profile.platformInfo.avatarUrl}
                alt="Player Avatar"
                fill
                sizes="128px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-[#ff4655]/5 flex items-center justify-center">
                <span className="text-4xl text-[#ff4655]/20">?</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">
              {data.profile.platformInfo.platformUserHandle}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#ff4655]">Playtime</p>
                <p className="text-lg text-white">{displayStats.timePlayed.displayValue}</p>
              </div>
              <div>
                <p className="text-sm text-[#ff4655]">Matches Played</p>
                <p className="text-lg text-white">{displayStats.matchesPlayed.displayValue}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rank Display */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Peak Rank"
          value={displayStats.peakRank.tierName}
          iconUrl={displayStats.peakRank.iconUrl}
          showGradientText
          size="large"
        />
        <StatCard
          label="Current Rank"
          value={displayStats.rank.tierName}
          iconUrl={displayStats.rank.iconUrl}
          showGradientText
          size="large"
        />
      </div>

      {/* Performance Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Damage/Round"
          value={parseFloat(displayStats.damagePerRound.displayValue)}
          percentile={displayStats.damagePerRound.percentile}
          decimalPlaces={1}
        />
        <StatCard
          label="K/D Ratio"
          value={parseFloat(displayStats.kDRatio.displayValue)}
          percentile={displayStats.kDRatio.percentile}
          decimalPlaces={2}
        />
        <StatCard
          label="Headshot %"
          value={parseFloat(displayStats.headshotsPercentage.displayValue)}
          percentile={displayStats.headshotsPercentage.percentile}
          decimalPlaces={1}
        />
        <StatCard
          label="Win Rate"
          value={parseFloat(displayStats.matchesWinPct.displayValue)}
          percentile={displayStats.matchesWinPct.percentile}
          decimalPlaces={1}
        />
      </div>

      {/* Win/Loss Display */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Matches Won"
          value={parseInt(displayStats.matchesWon.displayValue)}
          percentile={displayStats.matchesWon.percentile}
          decimalPlaces={0}
        />
        <StatCard
          label="Matches Lost"
          value={parseInt(displayStats.matchesLost.displayValue)}
          percentile={displayStats.matchesLost.percentile}
          decimalPlaces={0}
        />
      </div>

      {/* Time Played & Performance Score */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Time Played"
          value={displayStats.timePlayed.displayValue}
        />
        <StatCard
          label="TRN Score"
          value={displayStats.trnPerformanceScore?.displayValue ? 
            parseInt(displayStats.trnPerformanceScore.displayValue) : 0}
          percentile={displayStats.trnPerformanceScore?.percentile}
          decimalPlaces={0}
        />
      </div>
    </div>
  );
});

StatDashboard.displayName = 'StatDashboard';

export default StatDashboard;