// app/valorant/stats/page.tsx
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

interface Season {
  id: string;
  name: string;
}

interface ApiResponse {
  status: string;
  data: {
    profile: ProfileResponse;
    seasonData?: SeasonData[];
    seasons?: Season[];
  };
  error?: string;
}

export default function ValorantStatsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [searchParams, setSearchParams] = useState({
    playerName: '',
    tag: '',
    act: 'Auto',
    mode: 'Auto'
  });

  const handleSearch = async () => {
    if (!searchParams.playerName || !searchParams.tag) {
      setError({ message: 'Please enter a valid player name and tag', status: 400 });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        name: searchParams.playerName,
        tag: searchParams.tag,
        mode: searchParams.mode
      });

      if (searchParams.act !== 'Auto') {
        queryParams.append('seasonId', searchParams.act);
      }

      const response = await fetch(`/api/valorant/profile?${queryParams}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw { message: errorData.error, status: response.status };
      }

      const data: ApiResponse = await response.json();
      if (data.status === 'success') {
        setStatsData({
          profile: data.data.profile,
          seasonData: data.data.seasonData
        });
        
        // Update seasons from API response
        if (data.data.seasons && Array.isArray(data.data.seasons)) {
          setSeasons(data.data.seasons);
        }
      } else {
        throw { message: data.error || 'Failed to fetch stats', status: 500 };
      }
    } catch (err) {
      setError(err as Error);
      setStatsData(null);
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
          seasons={seasons}
        />

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {statsData && <StatDashboard data={statsData} mode={searchParams.mode} />}
      </div>
    </main>
  );
}