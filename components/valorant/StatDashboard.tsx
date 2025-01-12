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
  const stats = currentSeason?.stats || data.profile.stats;

  if (!stats) {
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
          value={stats.peakRank.tierName}
          iconUrl={stats.peakRank.iconUrl}
          showGradientText
          size="large"
        />
        <StatCard
          label="Current Rank"
          value={stats.rank.tierName}
          iconUrl={stats.rank.iconUrl}
          showGradientText
          size="large"
        />
      </div>

      {/* Performance Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Damage/Round"
          value={parseFloat(stats.damagePerRound.displayValue)}
          percentile={stats.damagePerRound.percentile}
          decimalPlaces={1}
        />
        <StatCard
          label="K/D Ratio"
          value={parseFloat(stats.kDRatio.displayValue)}
          percentile={stats.kDRatio.percentile}
          decimalPlaces={2}
        />
        <StatCard
          label="Headshot %"
          value={parseFloat(stats.headshotsPercentage.displayValue)}
          percentile={stats.headshotsPercentage.percentile}
          decimalPlaces={1}
        />
        <StatCard
          label="Win Rate"
          value={parseFloat(stats.matchesWinPct.displayValue)}
          percentile={stats.matchesWinPct.percentile}
          decimalPlaces={1}
        />
      </div>

      {/* Win/Loss Display */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Matches Won"
          value={parseInt(stats.matchesWon.displayValue)}
          percentile={stats.matchesWon.percentile}
          decimalPlaces={0}
        />
        <StatCard
          label="Matches Lost"
          value={parseInt(stats.matchesLost.displayValue)}
          percentile={stats.matchesLost.percentile}
          decimalPlaces={0}
        />
      </div>

      {/* Time Played & Performance Score */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Time Played"
          value={stats.timePlayed.displayValue}
          showGradientText
        />
        <StatCard
          label="TRN Score"
          value={parseInt(stats.trnPerformanceScore.displayValue)}
          percentile={stats.trnPerformanceScore.percentile}
          decimalPlaces={0}
        />
      </div>
    </div>
  );
});

StatDashboard.displayName = 'StatDashboard';

export default StatDashboard;