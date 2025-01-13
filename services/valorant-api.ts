// services/valorant-api.ts

// Base type for stat values
interface StatValue {
  readonly displayValue: string;
  readonly percentile?: number;
}

interface RankValue {
  readonly tierName: string;
  readonly iconUrl: string;
}

// Raw data interfaces
interface RawStat {
  displayValue?: string;
  percentile?: number;
  metadata?: {
    tierName?: string;
    iconUrl?: string;
  };
}

interface RawStats {
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
}

interface RawSegment {
  type: string;
  stats: RawStats;
}

interface RawSeasonData {
  metadata: {
    name: string;
  };
  attributes: {
    act: string;
  };
  stats: RawStats;
}

// Essential type interfaces
interface PlayerStats {
  readonly timePlayed: StatValue;
  readonly matchesPlayed: StatValue;
  readonly rank: RankValue;
  readonly peakRank: RankValue;
  readonly damagePerRound: StatValue;
  readonly kDRatio: StatValue;
  readonly headshotsPercentage: StatValue;
  readonly matchesWinPct: StatValue;
  readonly matchesWon: StatValue;
  readonly matchesLost: StatValue;
  readonly trnPerformanceScore: StatValue;
}

export interface ProfileResponse {
  readonly platformInfo: {
    readonly platformUserHandle: string;
    readonly avatarUrl: string;
  };
  readonly stats: PlayerStats | null;
}

export interface SeasonData {
  readonly id: string;
  readonly name: string;
  readonly stats: PlayerStats;
}

export interface ApiError {
  readonly message: string;
  readonly status: number;
}

type PlaylistMode = 'auto' | 'competitive' | 'unrated' | 'swiftplay' | 'spike rush' | 
                    'deathmatch' | 'escalation' | 'team deathmatch' | 'replication' | 'snowball fight';

class ValorantAPI {
  private readonly BASE_URL = 'https://api.tracker.network/api/v2/valorant/standard' as const;
  private readonly DEFAULT_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  } as const;

  private readonly ERROR_MESSAGES: Readonly<Record<number, string>> = {
    400: 'Invalid request. Please check the player name and tag.',
    401: 'Unauthorized. Please check your API credentials.',
    403: 'Forbidden. Access denied.',
    404: 'Player not found.',
    429: 'Too many requests. Please try again later.',
    500: 'Internal server error. Please try again later.',
    503: 'Service unavailable. Please try again later.'
  };

  async getProfile(name: string, tag: string, mode = 'Auto', seasonId?: string): Promise<ProfileResponse> {
    const encodedTag = encodeURIComponent(`${name}#${tag}`);
    const isAuto = mode.toLowerCase() === 'auto';
    
    const url = new URL(
      isAuto 
        ? `${this.BASE_URL}/profile/riot/${encodedTag}`
        : `${this.BASE_URL}/profile/riot/${encodedTag}/segments/season-report`
    );

    if (!isAuto) {
      url.searchParams.append('playlist', this.getPlaylistFromMode(mode));
    }
    url.searchParams.append('source', 'overwolf-2');
    url.searchParams.append('s', '1');

    try {
      const response = await fetch(url.toString(), {
        headers: this.DEFAULT_HEADERS
      });

      if (!response.ok) {
        throw this.createError(response.status);
      }

      const data = await response.json();
      return isAuto ? this.processProfileData(data) : this.processSeasonReportData(data, seasonId);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSeasonReport(name: string, tag: string, playlist = 'competitive'): Promise<SeasonData[]> {
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
        throw this.createError(response.status);
      }

      const data = await response.json();
      
      if (!data?.data || !Array.isArray(data.data)) {
        throw new Error('Invalid season report data');
      }

      interface RawSeasonDataPartial {
        metadata?: { name?: string };
        attributes?: { act?: string };
        stats?: RawStats;
      }

      return data.data
        .filter((season: unknown): season is RawSeasonData => {
          const s = season as RawSeasonDataPartial;
          return Boolean(s?.metadata?.name) &&
                 Boolean(s?.attributes?.act) &&
                 Boolean(s?.stats);
        })
        .map((season: RawSeasonData) => ({
          id: season.attributes.act,
          name: season.metadata.name,
          stats: this.extractPlayerStats(season.stats)
        }));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private processProfileData(rawData: unknown): ProfileResponse {
    if (!rawData || typeof rawData !== 'object') {
      throw new Error('Invalid response data');
    }

    const data = rawData as {
      data?: {
        platformInfo?: {
          platformUserHandle?: string;
          avatarUrl?: string;
        };
        segments?: RawSegment[];
      };
    };
    
    if (!data.data?.segments) {
      throw new Error('Invalid response data structure');
    }

    const seasonSegment = data.data.segments.find(s => s.type === 'season');

    if (!seasonSegment?.stats) {
      throw new Error('No season data found');
    }

    return {
      platformInfo: {
        platformUserHandle: data.data.platformInfo?.platformUserHandle ?? '',
        avatarUrl: data.data.platformInfo?.avatarUrl ?? ''
      },
      stats: this.extractPlayerStats(seasonSegment.stats)
    };
  }

  private processSeasonReportData(rawData: unknown, seasonId?: string): ProfileResponse {
    if (!rawData || typeof rawData !== 'object' || !('data' in rawData) || !Array.isArray(rawData.data)) {
      throw new Error('Invalid season report data');
    }

    const data = rawData.data as RawSeasonData[];
    const selectedSeason = seasonId
      ? data.find(season => season.attributes?.act === seasonId)
      : data[0];

    if (!selectedSeason?.stats) {
      throw new Error('No season data found');
    }

    return {
      platformInfo: {
        platformUserHandle: selectedSeason.metadata?.name ?? '',
        avatarUrl: ''
      },
      stats: this.extractPlayerStats(selectedSeason.stats)
    };
  }

  private extractPlayerStats(stats: RawStats): PlayerStats {
    return {
      timePlayed: this.extractStatValue(stats.timePlayed),
      matchesPlayed: this.extractStatValue(stats.matchesPlayed),
      rank: this.extractRankValue(stats.rank),
      peakRank: this.extractRankValue(stats.peakRank),
      damagePerRound: this.extractStatValue(stats.damagePerRound),
      kDRatio: this.extractStatValue(stats.kDRatio),
      headshotsPercentage: this.extractStatValue(stats.headshotsPercentage),
      matchesWinPct: this.extractStatValue(stats.matchesWinPct),
      matchesWon: this.extractStatValue(stats.matchesWon),
      matchesLost: this.extractStatValue(stats.matchesLost),
      trnPerformanceScore: this.extractStatValue(stats.trnPerformanceScore)
    };
  }

  private extractStatValue(stat?: RawStat): StatValue {
    if (!stat) {
      return { displayValue: '0' };
    }

    return {
      displayValue: stat.displayValue ?? '0',
      percentile: stat.percentile
    };
  }

  private extractRankValue(rank?: RawStat): RankValue {
    if (!rank?.metadata) {
      return { tierName: 'Unranked', iconUrl: '' };
    }

    return {
      tierName: rank.metadata.tierName ?? 'Unranked',
      iconUrl: rank.metadata.iconUrl ?? ''
    };
  }

  getPlaylistFromMode(mode: string): string {
    const playlists: Readonly<Record<PlaylistMode, string>> = {
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

    const normalizedMode = mode.toLowerCase() as PlaylistMode;
    return playlists[normalizedMode] ?? mode.toLowerCase();
  }

  private createError(status: number): ApiError {
    return {
      message: this.ERROR_MESSAGES[status] ?? 'An unknown error occurred.',
      status
    };
  }

  private handleError(error: unknown): ApiError {
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
export const valorantAPI = Object.freeze(new ValorantAPI());