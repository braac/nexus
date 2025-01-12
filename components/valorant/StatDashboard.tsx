'use client';

import { memo } from 'react';
import StatCard from './StatCard';
import type { ProfileResponse, SeasonData } from '@/services/tracker-api';

interface StatDashboardProps {
  data: {
    profile: ProfileResponse;
    seasonData?: SeasonData[];
  };
}

const StatDashboard = memo(({ data }: StatDashboardProps) => {
  const currentSeason = data.seasonData?.[0];
  const displayStats = currentSeason?.stats || data.profile.stats;
  // Get percentiles from the main profile stats
  const percentileStats = data.profile.stats;

  if (!displayStats) {
    return (
      <div className="text-center text-gray-400">
        No stats available for this player
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
          percentile={percentileStats?.damagePerRound.percentile}
          decimalPlaces={1}
        />
        <StatCard
          label="K/D Ratio"
          value={parseFloat(displayStats.kDRatio.displayValue)}
          percentile={percentileStats?.kDRatio.percentile}
          decimalPlaces={2}
        />
        <StatCard
          label="Headshot %"
          value={parseFloat(displayStats.headshotsPercentage.displayValue)}
          percentile={percentileStats?.headshotsPercentage.percentile}
          decimalPlaces={1}
        />
        <StatCard
          label="Win Rate"
          value={parseFloat(displayStats.matchesWinPct.displayValue)}
          percentile={percentileStats?.matchesWinPct.percentile}
          decimalPlaces={1}
        />
      </div>

      {/* Win/Loss Display */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Matches Won"
          value={parseInt(displayStats.matchesWon.displayValue)}
          percentile={percentileStats?.matchesWon.percentile}
          decimalPlaces={0}
        />
        <StatCard
          label="Matches Lost"
          value={parseInt(displayStats.matchesLost.displayValue)}
          percentile={percentileStats?.matchesLost.percentile}
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
          value={parseInt(displayStats.trnPerformanceScore.displayValue)}
          percentile={percentileStats?.trnPerformanceScore.percentile}
          decimalPlaces={0}
        />
      </div>
    </div>
  );
});

StatDashboard.displayName = 'StatDashboard';

export default StatDashboard;