// services/tracker-api.ts

// Core interfaces for the essential data
interface RankData {
    tierName: string;
    iconUrl: string;
  }
  
  interface StatData {
    displayValue: string;
    percentile?: number;
  }
  
  interface PlayerStats {
    timePlayed: StatData;
    matchesPlayed: StatData;
    rank: RankData;
    peakRank: RankData;
    damagePerRound: StatData;
    kDRatio: StatData;
    headshotsPercentage: StatData;
    matchesWinPct: StatData;
    matchesWon: StatData;
    matchesLost: StatData;
    trnPerformanceScore: StatData;
  }
  
  // Response interfaces
  export interface ProfileResponse {
    platformInfo: {
      platformUserHandle: string;
      avatarUrl: string;
    };
    stats: PlayerStats | null;
  }
  
  export interface SeasonData {
    id: string;
    name: string;
    stats: PlayerStats;
  }
  
  export interface ApiError {
    message: string;
    status: number;
  }
  
  // Expanded interfaces for raw API data
  interface RawPlatformInfo {
    platformUserHandle?: string;
    avatarUrl?: string;
  }
  
  interface RawSegment {
    type?: string;
    stats?: Record<string, { displayValue?: string; percentile?: number; metadata?: Record<string, string> }>;
  }
  
  interface RawProfileData {
    data?: {
      platformInfo?: RawPlatformInfo;
      segments?: RawSegment[];
    };
  }
  
  interface RawSeasonData {
    data?: Array<{
      metadata?: {
        name?: string;
        actId?: string;
      };
      stats?: Record<string, { displayValue?: string; percentile?: number; metadata?: Record<string, string> }>;
    }>;
  }
  
  class TrackerAPI {
    private readonly BASE_URL = 'https://api.tracker.network/api/v2/valorant/standard';
    private readonly DEFAULT_HEADERS = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
  
    /**
     * Fetches and processes a player's profile data
     */
    async getProfile(name: string, tag: string): Promise<ProfileResponse> {
      const encodedTag = encodeURIComponent(`${name}#${tag}`);
      const url = new URL(`${this.BASE_URL}/profile/riot/${encodedTag}`);
      url.searchParams.append('source', 'overwolf-2');
      url.searchParams.append('s', '1');
  
      try {
        const response = await fetch(url.toString(), {
          headers: this.DEFAULT_HEADERS
        });
  
        if (!response.ok) {
          throw this.handleError(response.status);
        }
  
        const data: RawProfileData = await response.json();
        return this.processProfileData(data);
      } catch (error) {
        throw this.handleError(error);
      }
    }
  
    /**
     * Processes raw profile data into our streamlined format
     */
    private processProfileData(rawData: RawProfileData): ProfileResponse {
      const seasonSegment = rawData.data?.segments?.find(s => s.type === 'season');
  
      return {
        platformInfo: {
          platformUserHandle: rawData.data?.platformInfo?.platformUserHandle || '',
          avatarUrl: rawData.data?.platformInfo?.avatarUrl || ''
        },
        stats: seasonSegment ? {
          timePlayed: this.extractStat(seasonSegment.stats?.timePlayed),
          matchesPlayed: this.extractStat(seasonSegment.stats?.matchesPlayed),
          rank: this.extractRank(seasonSegment.stats?.rank),
          peakRank: this.extractRank(seasonSegment.stats?.peakRank),
          damagePerRound: this.extractStat(seasonSegment.stats?.damagePerRound),
          kDRatio: this.extractStat(seasonSegment.stats?.kDRatio),
          headshotsPercentage: this.extractStat(seasonSegment.stats?.headshotsPercentage),
          matchesWinPct: this.extractStat(seasonSegment.stats?.matchesWinPct),
          matchesWon: this.extractStat(seasonSegment.stats?.matchesWon),
          matchesLost: this.extractStat(seasonSegment.stats?.matchesLost),
          trnPerformanceScore: this.extractStat(seasonSegment.stats?.trnPerformanceScore)
        } : null
      };
    }
  
    /**
     * Fetches season report data
     */
    async getSeasonReport(name: string, tag: string, playlist: string = 'competitive'): Promise<SeasonData[]> {
      const encodedTag = encodeURIComponent(`${name}#${tag}`);
      const url = new URL(`${this.BASE_URL}/profile/riot/${encodedTag}/segments/season-report`);
      url.searchParams.append('playlist', playlist);
      url.searchParams.append('source', 'overwolf-2');
      url.searchParams.append('s', '1');
  
      try {
        const response = await fetch(url.toString(), {
          headers: this.DEFAULT_HEADERS
        });
  
        if (!response.ok) {
          throw this.handleError(response.status);
        }
  
        const data: RawSeasonData = await response.json();
        return this.processSeasonData(data);
      } catch (error) {
        throw this.handleError(error);
      }
    }
  
    /**
     * Processes raw season data into our streamlined format
     */
    private processSeasonData(rawData: RawSeasonData): SeasonData[] {
      if (!rawData?.data) return [];
  
      return rawData.data
        .filter((season): season is NonNullable<typeof season> => 
          !!season.metadata?.name && !!season.stats
        )
        .map(season => ({
          id: season.metadata?.actId || '',
          name: season.metadata?.name || '',
          stats: {
            timePlayed: this.extractStat(season.stats?.timePlayed),
            matchesPlayed: this.extractStat(season.stats?.matchesPlayed),
            rank: this.extractRank(season.stats?.rank),
            peakRank: this.extractRank(season.stats?.peakRank),
            damagePerRound: this.extractStat(season.stats?.damagePerRound),
            kDRatio: this.extractStat(season.stats?.kDRatio),
            headshotsPercentage: this.extractStat(season.stats?.headshotsPercentage),
            matchesWinPct: this.extractStat(season.stats?.matchesWinPct),
            matchesWon: this.extractStat(season.stats?.matchesWon),
            matchesLost: this.extractStat(season.stats?.matchesLost),
            trnPerformanceScore: this.extractStat(season.stats?.trnPerformanceScore)
          }
        }))
        .sort((a, b) => b.name.localeCompare(a.name));
    }
  
    /**
     * Helper method to extract stat values safely
     */
    private extractStat(stat?: { displayValue?: string; percentile?: number }): StatData {
      return {
        displayValue: stat?.displayValue || '0',
        percentile: stat?.percentile || undefined
      };
    }
  
    /**
     * Helper method to extract rank data safely
     */
    private extractRank(rank?: { metadata?: { tierName?: string; iconUrl?: string } }): RankData {
      return {
        tierName: rank?.metadata?.tierName || 'Unranked',
        iconUrl: rank?.metadata?.iconUrl || ''
      };
    }
  
    /**
     * Helper method to get appropriate playlist string for API
     */
    getPlaylistFromMode(mode: string): string {
      const playlists: Record<string, string> = {
        'auto': 'competitive',
        'competitive': 'competitive',
        'unrated': 'unrated',
        'swiftplay': 'swiftplay',
        'spike rush': 'spikerush',
        'deathmatch': 'deathmatch',
        'escalation': 'escalation',
        'team deathmatch': 'team-deathmatch',
        'replication': 'replication',
        'snowball fight': 'snowball'
      };
  
      return playlists[mode.toLowerCase()] || mode.toLowerCase();
    }
  
    /**
     * Handles API errors
     */
    private handleError(error: Error | number | unknown): ApiError {
      if (typeof error === 'number') {
        const errorMessages: Record<number, string> = {
          400: 'Invalid request. Please check the player name and tag.',
          401: 'Unauthorized. Please check your API credentials.',
          403: 'Forbidden. Access denied.',
          404: 'Player not found.',
          429: 'Too many requests. Please try again later.',
          500: 'Internal server error. Please try again later.',
          503: 'Service unavailable. Please try again later.'
        };
  
        return {
          message: errorMessages[error] || 'An unknown error occurred.',
          status: error
        };
      }
  
      if (error instanceof Error) {
        return {
          message: error.message,
          status: 500
        };
      }
  
      return {
        message: 'An unknown error occurred.',
        status: 500
      };
    }
  }
  
  // Export a singleton instance
  export const trackerAPI = new TrackerAPI();