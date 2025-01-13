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

// Raw API response types
interface RawMetadata {
  readonly name?: string;
  readonly tierName?: string;
  readonly iconUrl?: string;
}

interface RawAttributes {
  readonly act?: string;
  readonly season?: {
    readonly id: string;
    readonly name: string;
    readonly startTime?: string;
  };
}

interface RawStat {
  readonly displayValue?: string;
  readonly percentile?: number;
  readonly metadata?: RawMetadata;
}

interface RawStats {
  readonly timePlayed?: RawStat;
  readonly matchesPlayed?: RawStat;
  readonly rank?: RawStat;
  readonly peakRank?: RawStat;
  readonly damagePerRound?: RawStat;
  readonly kDRatio?: RawStat;
  readonly headshotsPercentage?: RawStat;
  readonly matchesWinPct?: RawStat;
  readonly matchesWon?: RawStat;
  readonly matchesLost?: RawStat;
  readonly trnPerformanceScore?: RawStat;
}

interface RawSegment {
  readonly type: string;
  readonly attributes?: RawAttributes;
  readonly metadata?: RawMetadata;
  readonly stats?: RawStats;
}

interface RawProfileResponse {
  readonly data?: {
    readonly platformInfo?: {
      readonly platformUserHandle?: string;
      readonly avatarUrl?: string;
    };
    readonly segments?: RawSegment[];
  };
}

interface RawSeasonReport {
  readonly data?: Array<{
    readonly metadata?: RawMetadata;
    readonly attributes?: RawAttributes;
    readonly stats?: RawStats;
  }>;
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
  readonly availableSeasons: Array<{
    readonly id: string;
    readonly name: string;
  }>;
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
    
    try {
      // Always fetch the standard profile first to get available seasons
      const standardProfileUrl = new URL(`${this.BASE_URL}/profile/riot/${encodedTag}`);
      standardProfileUrl.searchParams.append('source', 'overwolf-2');
      standardProfileUrl.searchParams.append('s', '1');

      const profileResponse = await fetch(standardProfileUrl.toString(), {
        headers: this.DEFAULT_HEADERS
      });

      if (!profileResponse.ok) {
        throw this.createError(profileResponse.status);
      }

      const profileData = (await profileResponse.json()) as RawProfileResponse;
      const availableSeasons = this.extractAvailableSeasons(profileData);

      // If mode is Auto or no seasonId, use the standard profile data
      if (mode.toLowerCase() === 'auto' || !seasonId) {
        return {
          ...this.processProfileData(profileData),
          availableSeasons
        };
      }

      // For specific seasons, fetch the season report
      const seasonReportUrl = new URL(`${this.BASE_URL}/profile/riot/${encodedTag}/segments/season-report`);
      seasonReportUrl.searchParams.append('playlist', this.getPlaylistFromMode(mode));
      seasonReportUrl.searchParams.append('source', 'overwolf-2');
      seasonReportUrl.searchParams.append('s', '1');

      const seasonResponse = await fetch(seasonReportUrl.toString(), {
        headers: this.DEFAULT_HEADERS
      });

      if (!seasonResponse.ok) {
        throw this.createError(seasonResponse.status);
      }

      const seasonData = (await seasonResponse.json()) as RawSeasonReport;
      return {
        ...this.processSeasonReportData(seasonData, seasonId),
        availableSeasons
      };

    } catch (error) {
      throw this.handleError(error);
    }
  }

  private extractAvailableSeasons(profileData: RawProfileResponse): Array<{ id: string; name: string }> {
    const segments = profileData?.data?.segments;
    if (!Array.isArray(segments)) return [];

    return segments
      .filter((segment): segment is RawSegment & { attributes: { season: { id: string; name: string } } } => 
        segment.type === 'season' && 
        segment.attributes?.season?.id != null &&
        segment.attributes.season.name != null
      )
      .map(segment => ({
        id: segment.attributes.season.id,
        name: segment.attributes.season.name
      }))
      .sort((a, b) => b.id.localeCompare(a.id)); // Sort by season ID in descending order
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

      const data = (await response.json()) as RawSeasonReport;
      
      if (!data?.data || !Array.isArray(data.data)) {
        throw new Error('Invalid season report data');
      }

      return data.data
        .filter((season): season is NonNullable<typeof season> & {
          metadata: { name: string };
          attributes: { act: string };
          stats: RawStats;
        } => 
          Boolean(season?.metadata?.name) &&
          Boolean(season?.attributes?.act) &&
          Boolean(season?.stats)
        )
        .map(season => ({
          id: season.attributes.act,
          name: season.metadata.name,
          stats: this.extractPlayerStats(season.stats)
        }));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private processProfileData(rawData: RawProfileResponse): Omit<ProfileResponse, 'availableSeasons'> {
    if (!rawData?.data?.segments) {
      throw new Error('Invalid response data structure');
    }

    const seasonSegment = rawData.data.segments.find(s => s.type === 'season');

    if (!seasonSegment?.stats) {
      throw new Error('No season data found');
    }

    return {
      platformInfo: {
        platformUserHandle: rawData.data.platformInfo?.platformUserHandle ?? '',
        avatarUrl: rawData.data.platformInfo?.avatarUrl ?? ''
      },
      stats: this.extractPlayerStats(seasonSegment.stats)
    };
  }

  private processSeasonReportData(rawData: RawSeasonReport, seasonId?: string): Omit<ProfileResponse, 'availableSeasons'> {
    if (!rawData?.data || !Array.isArray(rawData.data)) {
      throw new Error('Invalid season report data');
    }

    const data = rawData.data.filter((season): season is NonNullable<typeof season> => 
      Boolean(season?.metadata?.name) &&
      Boolean(season?.stats)
    );

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
    const playlists: Readonly<Record<string, string>> = {
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

    const normalizedMode = mode.toLowerCase();
    return playlists[normalizedMode] ?? normalizedMode;
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