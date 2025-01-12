'use client';

import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import SearchControls from '@/components/valorant/SearchControls';
import StatDashboard from '@/components/valorant/StatDashboard';
import type { ProfileResponse, SeasonData } from '@/services/tracker-api';

interface Error {
  message: string;
  status: number;
}

interface StatsData {
  profile: ProfileResponse;
  seasonData?: SeasonData[];
}

export default function ValorantStatsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [searchParams, setSearchParams] = useState({
    playerName: '',
    tag: '',
    act: 'current',
    mode: 'competitive'
  });

  const handleSearch = async () => {
    if (!searchParams.playerName || !searchParams.tag) {
      setError({ message: 'Please enter a valid player name and tag', status: 400 });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/valorant/profile?name=${encodeURIComponent(searchParams.playerName)}&tag=${encodeURIComponent(searchParams.tag)}&mode=${searchParams.mode}&seasonId=${searchParams.act}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw { message: errorData.error, status: response.status };
      }

      const data = await response.json();
      if (data.status === 'success' && data.data.profile) {
        setStatsData({
          profile: data.data.profile,
          seasonData: data.data.seasonData
        });
      } else {
        throw { message: data.error || 'Failed to fetch stats', status: 500 };
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-8">
        <SearchControls 
          onPlayerNameChange={(name, tag) => setSearchParams(prev => ({ ...prev, playerName: name, tag }))}
          onActChange={(act) => setSearchParams(prev => ({ ...prev, act }))}
          onModeChange={(mode) => setSearchParams(prev => ({ ...prev, mode }))}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {statsData && <StatDashboard data={statsData} />}
      </div>
    </main>
  );
}