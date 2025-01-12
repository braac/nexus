'use client';

import { memo } from 'react';
import StatCard from './StatCard';

// Sample mock data - in a real app, this would come from an API
const DEFAULT_STATS = {
  rank: {
    peakRank: "Diamond II",
    currentRank: "Diamond I"
  },
  performance: {
    damagePerRound: 156.4,
    kdRatio: 1.25,
    headshotPercentage: 28.5,
    winRate: 54.2
  },
  matches: {
    won: 32,
    lost: 18
  },
  trackerScore: 2750,
  percentiles: {
    damagePerRound: 15,
    kdRatio: 22,
    headshotPercentage: 18,
    winRate: 25,
    matchesWon: 12,
    matchesLost: 8,
    trackerScore: 5
  }
};

const StatDashboard = memo(() => {
  return (
    <div className="space-y-4">
      {/* Rank Display */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Peak Rank"
          value={DEFAULT_STATS.rank.peakRank}
          showGradientText
          size="large"
        />
        <StatCard
          label="Current Rank"
          value={DEFAULT_STATS.rank.currentRank}
          showGradientText
          size="large"
        />
      </div>

      {/* Performance Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Damage/Round"
          value={DEFAULT_STATS.performance.damagePerRound}
          percentile={DEFAULT_STATS.percentiles.damagePerRound}
          decimalPlaces={1}
        />
        <StatCard
          label="K/D Ratio"
          value={DEFAULT_STATS.performance.kdRatio}
          percentile={DEFAULT_STATS.percentiles.kdRatio}
          decimalPlaces={2}
        />
        <StatCard
          label="Headshot %"
          value={DEFAULT_STATS.performance.headshotPercentage}
          percentile={DEFAULT_STATS.percentiles.headshotPercentage}
          decimalPlaces={1}
        />
        <StatCard
          label="Win Rate"
          value={DEFAULT_STATS.performance.winRate}
          percentile={DEFAULT_STATS.percentiles.winRate}
          decimalPlaces={1}
        />
      </div>

      {/* Win/Loss Display */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Matches Won"
          value={DEFAULT_STATS.matches.won}
          percentile={DEFAULT_STATS.percentiles.matchesWon}
          decimalPlaces={0}
        />
        <StatCard
          label="Matches Lost"
          value={DEFAULT_STATS.matches.lost}
          percentile={DEFAULT_STATS.percentiles.matchesLost}
          decimalPlaces={0}
        />
      </div>

      {/* Tracker Score */}
      <StatCard
        label="Tracker Score"
        value={DEFAULT_STATS.trackerScore}
        percentile={DEFAULT_STATS.percentiles.trackerScore}
        decimalPlaces={0}
      />
    </div>
  );
});

StatDashboard.displayName = 'StatDashboard';

export default StatDashboard;