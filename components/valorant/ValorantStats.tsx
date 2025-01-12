'use client';

import { useState, useEffect, useMemo } from 'react';
import SearchControls from './SearchControls';
import StatDashboard from './StatDashboard';

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
    <main className="flex min-h-screen flex-col relative overflow-hidden">
      {/* Background animations */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-red-500 via-yellow-500 to-blue-500" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,70,85,0.15),transparent_70%)] opacity-75 animate-pulse" 
          style={{ animationDuration: '4s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,70,85,0.12),transparent_50%)] opacity-60 animate-pulse" 
          style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,70,85,0.08),transparent_50%)] opacity-50 animate-pulse" 
          style={{ animationDuration: '8s', animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-gradient-conic from-transparent via-[#ff4655]/5 to-transparent opacity-30 animate-spin" 
          style={{ animationDuration: '10s' }} />
      </div>
      
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