// services/tracker-api.ts

// Raw API response interfaces
interface RawStat {
  displayValue?: string;
  percentile?: number;
  metadata?: {
    tierName?: string;
    iconUrl?: string;
    [key: string]: string | undefined;
  };
}

interface RawSegment {
  type?: string;
  metadata?: {
    name?: string;
    [key: string]: string | undefined;
  };
  stats?: {
    timePlayed?: RawStat;
    matchesPlayed?: RawStat;
    rank?: RawStat;
    peakRank?: RawStat;
    damagePerRound?: RawStat;
    kDRatio?: RawStat;
    headshotsPercentage?: RawStat;
    matchesWinPct?: RawStat;
    matchesWon?: RawStat;
    matchesLost?: RawStat;
    trnPerformanceScore?: RawStat;
    [key: string]: RawStat | undefined;
  };
}

interface RawProfileData {
  data?: {
    platformInfo?: {
      platformUserHandle?: string;
      avatarUrl?: string;
    };
    segments?: RawSegment[];
  };
}

interface RawSeasonReportEntry {
  metadata?: {
    name?: string;
    [key: string]: string | undefined;
  };
  attributes?: {
    act?: string;
    [key: string]: string | undefined;
  };
  stats?: {
    timePlayed?: RawStat;
    matchesPlayed?: RawStat;
    rank?: RawStat;
    peakRank?: RawStat;
    damagePerRound?: RawStat;
    kDRatio?: RawStat;
    headshotsPercentage?: RawStat;
    matchesWinPct?: RawStat;
    matchesWon?: RawStat;
    matchesLost?: RawStat;
    trnPerformanceScore?: RawStat;
    [key: string]: RawStat | undefined;
  };
}

interface RawSeasonReportData {
  data?: RawSeasonReportEntry[];
}

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

class TrackerAPI {
  private readonly BASE_URL = 'https://api.tracker.network/api/v2/valorant/standard';
  private readonly DEFAULT_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OverwolfClient/0.258.0.6'
  };

  /**
   * Fetches and processes a player's profile data
   */
  async getProfile(name: string, tag: string, mode: string = 'Auto', seasonId?: string): Promise<ProfileResponse> {
    const encodedTag = encodeURIComponent(`${name}#${tag}`);
    
    try {
      if (mode === 'Auto') {
        // Use standard profile endpoint
        const url = new URL(`${this.BASE_URL}/profile/riot/${encodedTag}`);
        url.searchParams.append('source', 'overwolf-2');
        url.searchParams.append('s', '1');

        const response = await fetch(url.toString(), {
          headers: this.DEFAULT_HEADERS
        });

        if (!response.ok) {
          throw this.handleError(response.status);
        }

        const data = await response.json();
        return this.processProfileData(data);
      } else {
        // Use season report endpoint
        const url = new URL(`${this.BASE_URL}/profile/riot/${encodedTag}/segments/season-report`);
        const playlist = this.getPlaylistFromMode(mode);
        url.searchParams.append('playlist', playlist);
        url.searchParams.append('source', 'overwolf-2');
        url.searchParams.append('s', '1');

        const response = await fetch(url.toString(), {
          headers: this.DEFAULT_HEADERS
        });

        if (!response.ok) {
          throw this.handleError(response.status);
        }

        const data = await response.json();
        return this.processSeasonReportData(data, seasonId);
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSeasonReport(name: string, tag: string, playlist: string = 'competitive'): Promise<RawSeasonReportEntry[]> {
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

      const data: RawSeasonReportData = await response.json();
      return data.data || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Processes raw profile data into our streamlined format
   */
  private processProfileData(rawData: RawProfileData): ProfileResponse {
    if (!rawData?.data) {
      throw this.handleError(new Error('Invalid response data'));
    }

    const data = rawData.data;
    const seasonSegment = data.segments?.find(s => s.type === 'season');

    if (!seasonSegment) {
      throw this.handleError(new Error('No season data found'));
    }

    const stats = seasonSegment.stats;
    const overallSegment = data.segments?.[0];
    const trnScore = overallSegment?.stats?.trnPerformanceScore || stats?.trnPerformanceScore;

    return {
      platformInfo: {
        platformUserHandle: data.platformInfo?.platformUserHandle || '',
        avatarUrl: data.platformInfo?.avatarUrl || ''
      },
      stats: {
        timePlayed: this.extractStat(stats?.timePlayed),
        matchesPlayed: this.extractStat(stats?.matchesPlayed),
        rank: this.extractRank(stats?.rank),
        peakRank: this.extractRank(stats?.peakRank),
        damagePerRound: this.extractStat(stats?.damagePerRound),
        kDRatio: this.extractStat(stats?.kDRatio),
        headshotsPercentage: this.extractStat(stats?.headshotsPercentage),
        matchesWinPct: this.extractStat(stats?.matchesWinPct),
        matchesWon: this.extractStat(stats?.matchesWon),
        matchesLost: this.extractStat(stats?.matchesLost),
        trnPerformanceScore: this.extractStat(trnScore)
      }
    };
  }

  /**
   * Processes season report data into profile response format
   */
  private processSeasonReportData(rawData: RawSeasonReportData, seasonId?: string): ProfileResponse {
    if (!rawData?.data || !Array.isArray(rawData.data)) {
      throw this.handleError(new Error('Invalid season report data'));
    }

    let selectedSeason;
    if (seasonId) {
      selectedSeason = rawData.data.find(season => season.attributes?.act === seasonId);
    }
    
    // If no season ID provided or not found, use the most recent season
    if (!selectedSeason) {
      selectedSeason = rawData.data[0];
    }

    if (!selectedSeason) {
      throw this.handleError(new Error('No season data found'));
    }

    const stats = selectedSeason.stats;

    return {
      platformInfo: {
        platformUserHandle: selectedSeason.metadata?.name || '',
        avatarUrl: '' // Season report doesn't include avatar URL
      },
      stats: {
        timePlayed: this.extractStat(stats?.timePlayed),
        matchesPlayed: this.extractStat(stats?.matchesPlayed),
        rank: this.extractRank(stats?.rank),
        peakRank: this.extractRank(stats?.peakRank),
        damagePerRound: this.extractStat(stats?.damagePerRound),
        kDRatio: this.extractStat(stats?.kDRatio),
        headshotsPercentage: this.extractStat(stats?.headshotsPercentage),
        matchesWinPct: this.extractStat(stats?.matchesWinPct),
        matchesWon: this.extractStat(stats?.matchesWon),
        matchesLost: this.extractStat(stats?.matchesLost),
        trnPerformanceScore: this.extractStat(stats?.trnPerformanceScore)
      }
    };
  }

  /**
   * Helper method to extract stat values safely
   */
  private extractStat(stat?: RawStat): StatData {
    if (!stat) {
      return { displayValue: '0' };
    }
    return {
      displayValue: stat.displayValue || '0',
      percentile: stat.percentile
    };
  }

  /**
   * Helper method to extract rank data safely
   */
  private extractRank(rank?: RawStat): RankData {
    if (!rank?.metadata) {
      return { tierName: 'Unranked', iconUrl: '' };
    }
    return {
      tierName: rank.metadata.tierName || 'Unranked',
      iconUrl: rank.metadata.iconUrl || ''
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