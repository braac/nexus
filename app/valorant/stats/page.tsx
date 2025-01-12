'use client';

import { useState } from 'react';
import SearchControls from '@/components/valorant/SearchControls';
import StatDashboard from '@/components/valorant/StatDashboard';

export default function ValorantStatsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    playerName: '',
    act: '',
    mode: ''
  });

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      console.log('Searching with params:', searchParams);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-8">
        <SearchControls 
          onPlayerNameChange={(name) => setSearchParams(prev => ({ ...prev, playerName: name }))}
          onActChange={(act) => setSearchParams(prev => ({ ...prev, act }))}
          onModeChange={(mode) => setSearchParams(prev => ({ ...prev, mode }))}
          onSearch={handleSearch}
          isLoading={isLoading}
        />
        <StatDashboard />
      </div>
    </main>
  );
}