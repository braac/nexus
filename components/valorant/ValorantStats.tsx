// components/valorant/ValorantStats.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import SearchControls from '@/components/valorant/SearchControls';
import StatDashboard from '@/components/valorant/StatDashboard';

const ValorantStats = () => {
  const [playerName, setPlayerName] = useState('Sentinel');
  const [selectedAct, setSelectedAct] = useState('all');
  const [selectedMode, setSelectedMode] = useState('comp');
  const [isLoading, setIsLoading] = useState(false);

  // Log state changes - would be replaced with API calls later
  useEffect(() => {
    console.log('Player data changed:', {
      playerName,
      selectedAct,
      selectedMode
    });
    // This is where we would fetch new stats data based on these values
  }, [playerName, selectedAct, selectedMode]);

  // Mock data - in a real app, this would come from an API call
  const statsData = useMemo(() => ({
    rankData: {
      peakRank: "Diamond II",
      currentRank: "Diamond I"
    },
    statsData: {
      combatScore: 245.0,
      kdRatio: 1.25,
      headshotPercentage: 28.5,
      winRate: 54.2
    },
    matchData: {
      won: 32,
      lost: 18
    },
    trackerScore: 2750
  }), []); // Memoize the data to prevent unnecessary re-renders

  const handleSearch = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <main className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-8">
        {/* Search Controls */}
        <SearchControls 
          onPlayerNameChange={setPlayerName}
          onActChange={setSelectedAct}
          onModeChange={setSelectedMode}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        {/* Stats Dashboard */}
        <StatDashboard {...statsData} />
      </div>
    </main>
  );
};

export default ValorantStats;