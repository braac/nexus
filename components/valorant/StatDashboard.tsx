'use client';

import { memo } from 'react';
import StatCard from './StatCard';

interface RankData {
  peakRank: string;
  currentRank: string;
}

interface StatsData {
  combatScore: number;
  kdRatio: number;
  headshotPercentage: number;
  winRate: number;
}

interface MatchData {
  won: number;
  lost: number;
}

interface StatDashboardProps {
  rankData: RankData;
  statsData: StatsData;
  matchData: MatchData;
  trackerScore: number;
}

const StatDashboard = memo(({
  rankData,
  statsData,
  matchData,
  trackerScore
}: StatDashboardProps) => {
  return (
    <div className="space-y-4">
      {/* Rank Display */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Peak Rank"
          value={rankData.peakRank}
          showGradientText
          size="large"
        />
        <StatCard
          label="Current Rank"
          value={rankData.currentRank}
          showGradientText
          size="large"
        />
      </div>

      {/* Performance Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Average Combat Score"
          value={statsData.combatScore}
          percentile={15}
          decimalPlaces={1}
        />
        <StatCard
          label="K/D Ratio"
          value={statsData.kdRatio}
          percentile={22}
          decimalPlaces={2}
        />
        <StatCard
          label="Headshot %"
          value={statsData.headshotPercentage}
          percentile={18}
          decimalPlaces={1}
        />
        <StatCard
          label="Win Rate"
          value={statsData.winRate}
          percentile={25}
          decimalPlaces={1}
        />
      </div>

      {/* Win/Loss Display */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Matches Won"
          value={matchData.won}
          percentile={12}
          decimalPlaces={0}
        />
        <StatCard
          label="Matches Lost"
          value={matchData.lost}
          percentile={8}
          decimalPlaces={0}
        />
      </div>

      {/* Tracker Score */}
      <StatCard
        label="Tracker Score"
        value={trackerScore}
        percentile={5}
        decimalPlaces={0}
      />
    </div>
  );
});

StatDashboard.displayName = 'StatDashboard';

export default StatDashboard;