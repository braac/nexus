// services/valorant-api.ts

// Raw API response interfaces
interface LifetimeData {
  readonly type: string;
  readonly stats?: {
    readonly hours?: { displayValue?: string };
    readonly matches?: { displayValue?: string };
  };
}

interface RawSeasonResponse {
  readonly data?: Array<RawSeasonData | LifetimeData>;
}

interface RawProfileResponse {
  readonly data?: {
    readonly platformInfo?: {
      readonly platformUserHandle?: string;
      readonly avatarUrl?: string;
    };
    readonly segments?: Array<{
      readonly type: string;
      readonly attributes?: {
        readonly season?: {
          readonly id: string;
          readonly name: string;
        };
      };
      readonly stats?: RawStats;
    }>;
  };
  readonly metadata?: RawMetadata;
}

interface RawMetadata {
  readonly activeShard?: string;
  readonly defaultPlatform?: string;
  readonly defaultPlaylist?: string;
  readonly defaultSeason?: string;
}

interface RawSeasonData {
  readonly metadata?: {
    readonly episodeName?: string;
    readonly actName?: string;
    readonly name?: string;
    readonly topAgents?: Array<{
      readonly name?: string;
      readonly imageUrl?: string;
      readonly playtime?: number;
      readonly color?: string;
    }>;
  };
  readonly stats?: RawStats;
  readonly attributes?: {
    readonly act?: string;
    readonly season?: {
      readonly id: string;
      readonly name: string;
    };
  };
}

interface RawMatch {
  readonly attributes: {
    readonly id: string;
    readonly seasonId: string;
  };
  readonly metadata: {
    readonly timestamp: string;
    readonly seasonName: string;
    readonly modeName: string;
    readonly modeImageUrl: string;
    readonly map: string;
    readonly mapName: string;
    readonly mapImageUrl: string;
  };
  readonly segments: Array<{
    readonly metadata: {
      readonly hasWon: boolean;
      readonly agentName: string;
      readonly agent: string;
      readonly agentImageUrl: string;
      readonly agentColor: string;
    };
    readonly stats: {
      readonly playtime: { displayValue: string };
      readonly roundsPlayed: RawStat;
      readonly roundsWon: RawStat;
      readonly roundsLost: RawStat;
      readonly kills: RawStat;
      readonly deaths: RawStat;
      readonly assists: RawStat;
      readonly kdRatio: RawStat;
      readonly hsAccuracy: RawStat;
      readonly damagePerRound: RawStat;
      readonly damageDeltaPerRound: RawStat;
      readonly scorePerRound: RawStat;
      readonly kast: RawStat;
      readonly trnPerformanceScore: RawStat;
      readonly rank: RawStat;
    };
  }>;
}

interface RawMatchResponse {
  metadata: {
    dateStarted: string;
    duration: number;
    modeName: string;
    playlist: string;
    map: string;
    mapName: string;
    mapImageUrl: string;
    mapDetails?: {
      imageUrl: string;
    };
  };
  segments: Array<RawTeamSegment | RawPlayerSegment>;
  streams?: {
    entries: RawStreamEntry[];
  };
}

interface RawTeamSegment {
  readonly type: string;
  readonly attributes: {
    readonly teamId: string;
  };
  readonly metadata: {
    readonly hasWon: boolean;
  };
  readonly stats: {
    readonly roundsWon: RawStat;
    readonly roundsLost: RawStat;
  };
}

interface RawPlayerSegment {
  readonly type: string;
  readonly metadata: {
    readonly platformInfo: {
      readonly platformUserHandle: string;
    };
    readonly partyId: string;
    readonly teamId: string;
    readonly agentKey: string;
    readonly agentName: string;
    readonly agentColor: string;
    readonly agentImageUrl: string;
    readonly agentPortraitUrl: string;
    readonly accountLevel: number;
  };
  readonly stats: {
    readonly rank: RawStat & { displayValue: string };
    readonly currRank: RawStat & { displayValue: string };
    readonly scorePerRound: RawStat;
    readonly kills: RawStat;
    readonly deaths: RawStat;
    readonly assists: RawStat;
    readonly kdRatio: RawStat;
    readonly damagePerRound: RawStat;
    readonly damageDeltaPerRound: RawStat;
    readonly plants: RawStat;
    readonly defuses: RawStat;
    readonly firstKills: RawStat;
    readonly firstDeaths: RawStat;
    readonly hsAccuracy: RawStat;
    readonly kast: RawStat;
    readonly trnPerformanceScore: RawStat;
  };
}

interface RawStreamEntry {
  readonly playerInfo: {
    readonly platformUserHandle: string;
  };
  readonly video: {
    readonly platformSlug: string;
    readonly platformUserHandle: string;
    readonly platformUserId: string;
    readonly timestamp: string;
    readonly startedAt: string;
    readonly endedAt: string;
    readonly duration: number;
    readonly viewCount: number;
    readonly title: string;
    readonly url: string;
    readonly thumbnailUrl: string;
    readonly isOnline: boolean;
  };
}

// Base interfaces for common patterns
interface StatValue {
  readonly displayValue: string;
  readonly percentile?: number;
}

interface RankInfo {
  readonly tierName: string;
  readonly iconUrl: string;
}

interface AgentInfo {
  readonly name: string;
  readonly imageUrl: string;
  readonly playtime: number;
  readonly playtimeHoursAndMinutes: string;
  readonly color: string;
}

// Raw API response types
interface RawStat {
  readonly displayValue?: string;
  readonly percentile?: number;
  readonly metadata?: {
    readonly tierName?: string;
    readonly iconUrl?: string;
  };
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
  readonly matchesTied?: RawStat;
  readonly kills?: RawStat;
  readonly deaths?: RawStat;
  readonly assists?: RawStat;
  readonly kDARatio?: RawStat;
  readonly kAST?: RawStat;
  readonly mostKillsInMatch?: RawStat;
  readonly aces?: RawStat;
  readonly trnPerformanceScore?: RawStat;
  readonly scorePerRound?: RawStat;
}

// Response types for profile endpoint
interface ProfileStats {
  readonly timePlayed: StatValue;
  readonly matchesPlayed: StatValue;
  readonly matchesWon: StatValue;
  readonly matchesLost: StatValue;
  readonly matchesTied: StatValue;
  readonly matchesWinPct: StatValue;
  readonly kills: StatValue;
  readonly deaths: StatValue;
  readonly assists: StatValue;
  readonly kDRatio: StatValue;
  readonly kDARatio: StatValue;
  readonly damagePerRound: StatValue;
  readonly headshotsPercentage: StatValue;
  readonly kAST: StatValue;
  readonly mostKillsInMatch: StatValue;
  readonly aces: StatValue;
  readonly rank: RankInfo;
  readonly peakRank: RankInfo;
  readonly trnPerformanceScore: StatValue;
}

export interface ProfileResponse {
  readonly platformInfo: {
    readonly platformUserHandle: string;
    readonly platformUserIdentifier: string;
    readonly avatarUrl: string;
  };
  readonly region: string;
  readonly stats: ProfileStats;
  readonly metadata: {
    readonly defaultPlatform: string;
    readonly defaultPlaylist: string;
    readonly defaultSeason: string;
  };
  readonly availableSeasons: Array<{
    readonly id: string;
    readonly name: string;
  }>;
}

// Response types for season report endpoint
interface SeasonStats extends Omit<ProfileStats, 'assists' | 'trnPerformanceScore' | 'kDARatio' | 'aces'> {
  readonly scorePerRound: StatValue;
}

export interface SeasonData {
  readonly id: string;
  readonly seasonName: string;
  readonly actName: string;
  readonly combinedName: string;
  readonly lifetimeStats?: {
    readonly lifetimeHours: string;
    readonly lifetimeMatches: string;
  };
  readonly topAgents: AgentInfo[];
  readonly stats: SeasonStats;
}

// Response types for match list endpoint
interface MatchStats {
  readonly hasWon: boolean;
  readonly agent: {
    readonly name: string;
    readonly id: string;
    readonly imageUrl: string;
    readonly color: string;
  };
  readonly matchLength: string;
  readonly roundsPlayed: StatValue;
  readonly roundsWon: StatValue;
  readonly roundsLost: StatValue;
  readonly kills: StatValue;
  readonly deaths: StatValue;
  readonly assists: StatValue;
  readonly kDRatio: StatValue;
  readonly headshotsPercentage: StatValue;
  readonly damagePerRound: StatValue;
  readonly damageDeltaPerRound: StatValue;
  readonly scorePerRound: StatValue;
  readonly kAST: StatValue;
  readonly trnPerformanceScore: StatValue;
  readonly rank: RankInfo;
}

export interface MatchListResponse {
  readonly matches: Array<{
    readonly id: string;
    readonly timestamp: string;
    readonly season: {
      readonly id: string;
      readonly name: string;
    };
    readonly gamemode: {
      readonly name: string;
      readonly imageUrl: string;
    };
    readonly map: {
      readonly id: string;
      readonly name: string;
      readonly imageUrl: string;
    };
    readonly stats: MatchStats;
  }>;
}

// Response types for match details endpoint
interface TeamSummary {
  readonly teamId: string;
  readonly hasWon: boolean;
  readonly roundsWon: StatValue;
  readonly roundsLost: StatValue;
}

interface PlayerSummary {
  readonly platformUserHandle: string;
  readonly partyId: string;
  readonly teamId: string;
  readonly agent: {
    readonly id: string;
    readonly name: string;
    readonly color: string;
    readonly imageUrl: string;
    readonly portraitUrl: string;
  };
  readonly accountLevel: number;
  readonly matchRank: RankInfo & { displayValue: string };
  readonly currentRank: RankInfo & { rating: number };
  readonly stats: {
    readonly scorePerRound: StatValue;
    readonly kills: StatValue;
    readonly deaths: StatValue;
    readonly assists: StatValue;
    readonly kDRatio: StatValue;
    readonly damagePerRound: StatValue;
    readonly damageDeltaPerRound: StatValue;
    readonly plants: StatValue;
    readonly defuses: StatValue;
    readonly firstKills: StatValue;
    readonly firstDeaths: StatValue;
    readonly headshotPercentage: StatValue;
    readonly kAST: StatValue;
    readonly trnPerformanceScore: StatValue;
  };
}

interface StreamInfo {
  readonly playerInfo: {
    readonly platformUserHandle: string;
  };
  readonly video: {
    readonly platformSlug: string;
    readonly platformUserHandle: string;
    readonly platformUserId: string;
    readonly timestamp: string;
    readonly startedAt: string;
    readonly endedAt: string;
    readonly duration: number;
    readonly viewCount: number;
    readonly title: string;
    readonly url: string;
    readonly thumbnailUrl: string;
    readonly isOnline: boolean;
  };
}

export interface MatchDetailsResponse {
  readonly timestamp: string;
  readonly duration: number;
  readonly durationFormatted: string;
  readonly gamemode: {
    readonly name: string;
    readonly playlist: string;
  };
  readonly map: {
    readonly id: string;
    readonly name: string;
    readonly imageUrl: string;
    readonly minimapUrl: string;
  };
  readonly teams: TeamSummary[];
  readonly players: PlayerSummary[];
  readonly streams: StreamInfo[];
}

export interface ApiError {
  readonly message: string;
  readonly status: number;
}

export class ValorantAPI {
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

  private formatPlaytime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }

  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }

  private extractSeasonNumbers(name: string): { episode: number; act: number } {
    const match = name.match(/E(\d+):\s*A(\d+)/);
    return match 
      ? { episode: parseInt(match[1]), act: parseInt(match[2]) }
      : { episode: 0, act: 0 };
  }

  private getPlaylistFromMode(mode: string): string {
    const playlists: Readonly<Record<string, string>> = {
      'auto': 'competitive',
      'competitive': 'competitive',
      'premier': 'premier',
      'unrated': 'unrated',
      'swiftplay': 'swiftplay',
      'spike rush': 'spikerush',
      'deathmatch': 'deathmatch',
      'escalation': 'escalation',
      'team deathmatch': 'team-deathmatch',
      'replication': 'replication',
      'snowball fight': 'snowball',
      'new map (swiftplay)': 'newmap-swiftplay',
      'new map (bomb)': 'newmap-bomb'
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

  private extractStatValue(stat?: RawStat): StatValue {
    return {
      displayValue: stat?.displayValue ?? '0',
      ...(stat?.percentile && { percentile: stat.percentile })
    };
  }

  private extractRankInfo(stat?: RawStat): RankInfo {
    return {
      tierName: stat?.metadata?.tierName ?? 'Unranked',
      iconUrl: stat?.metadata?.iconUrl ?? ''
    };
  }

  async getProfile(name: string, tag: string): Promise<ProfileResponse> {
    const encodedTag = encodeURIComponent(`${name}#${tag}`);
    
    try {
      const url = new URL(`${this.BASE_URL}/profile/riot/${encodedTag}`);
      url.searchParams.append('source', 'overwolf-2');

      const response = await fetch(url.toString(), {
        headers: this.DEFAULT_HEADERS
      });

      if (!response.ok) {
        throw this.createError(response.status);
      }

      const data = await response.json() as RawProfileResponse;
      
      // Safely get segments with fallbacks
      const segments = data?.data?.segments ?? [];
      const firstSegment = segments[0];
      const metadata = data?.metadata ?? {};
      const stats = firstSegment?.stats ?? {};
      const platformInfo = data?.data?.platformInfo ?? {};

      // Extract and sort seasons with null checks
      const seasons = segments
        .filter(segment => segment?.type === 'season' && segment.attributes?.season)
        .map(segment => ({
          id: segment.attributes?.season?.id ?? '',
          name: segment.attributes?.season?.name ?? ''
        }))
        .sort((a, b) => {
          const aNumbers = this.extractSeasonNumbers(a.name);
          const bNumbers = this.extractSeasonNumbers(b.name);
          return bNumbers.episode !== aNumbers.episode
            ? bNumbers.episode - aNumbers.episode
            : bNumbers.act - aNumbers.act;
        });

      // Construct response with safe fallbacks
      return {
        platformInfo: {
          platformUserHandle: platformInfo.platformUserHandle ?? `${name}#${tag}`,
          platformUserIdentifier: platformInfo.platformUserHandle ?? `${name}#${tag}`,
          avatarUrl: platformInfo.avatarUrl ?? ''
        },
        region: metadata.activeShard ?? 'unknown',
        stats: {
          timePlayed: this.extractStatValue(stats.timePlayed),
          matchesPlayed: this.extractStatValue(stats.matchesPlayed),
          matchesWon: this.extractStatValue(stats.matchesWon),
          matchesLost: this.extractStatValue(stats.matchesLost),
          matchesTied: this.extractStatValue(stats.matchesTied),
          matchesWinPct: this.extractStatValue(stats.matchesWinPct),
          kills: this.extractStatValue(stats.kills),
          deaths: this.extractStatValue(stats.deaths),
          assists: this.extractStatValue(stats.assists),
          kDRatio: this.extractStatValue(stats.kDRatio),
          kDARatio: this.extractStatValue(stats.kDARatio),
          damagePerRound: this.extractStatValue(stats.damagePerRound),
          headshotsPercentage: this.extractStatValue(stats.headshotsPercentage),
          kAST: this.extractStatValue(stats.kAST),
          mostKillsInMatch: this.extractStatValue(stats.mostKillsInMatch),
          aces: this.extractStatValue(stats.aces),
          rank: this.extractRankInfo(stats.rank),
          peakRank: this.extractRankInfo(stats.peakRank),
          trnPerformanceScore: this.extractStatValue(stats.trnPerformanceScore)
        },
        metadata: {
          defaultPlatform: metadata.defaultPlatform ?? 'pc',
          defaultPlaylist: metadata.defaultPlaylist ?? 'competitive',
          defaultSeason: metadata.defaultSeason ?? ''
        },
        availableSeasons: seasons
      };
    } catch (error) {
      throw this.handleError(error);
    }
}

  async getSeasonReport(name: string, tag: string, gamemode: string): Promise<SeasonData[]> {
    const encodedTag = encodeURIComponent(`${name}#${tag}`);
    
    try {
      const url = new URL(`${this.BASE_URL}/profile/riot/${encodedTag}/segments/season-report`);
      url.searchParams.append('playlist', this.getPlaylistFromMode(gamemode));
      url.searchParams.append('source', 'overwolf-2');

      const response = await fetch(url.toString(), {
        headers: this.DEFAULT_HEADERS
      });

      if (!response.ok) {
        throw this.createError(response.status);
      }

      const data = await response.json() as RawSeasonResponse;
      
      if (!data?.data || !Array.isArray(data.data)) {
        throw new Error('Invalid season report data');
      }

      // First, get lifetime matchmaking data
      const lifetimeData = data.data.find((item: LifetimeData | RawSeasonData): item is LifetimeData => 
        'type' in item && item.type === 'lifetime-matchmaking-time'
      );
      const lifetimeHours = lifetimeData?.stats?.hours?.displayValue ?? '0';
      const lifetimeMatches = lifetimeData?.stats?.matches?.displayValue ?? '0';

      interface LifetimeStats {
        lifetimeHours: string;
        lifetimeMatches: string;
      }

      // Process season data
      const seasonData: SeasonData[] = data.data
        .filter((season: LifetimeData | RawSeasonData): season is RawSeasonData => 
          'metadata' in season && 
          'stats' in season &&
          Boolean(season.metadata) && 
          Boolean(season.stats) &&
          'attributes' in season
        )
        .map((season: RawSeasonData): SeasonData => {
          const { metadata, stats } = season;

          // Add lifetime data to first season if it's the first one in the filtered list
          const firstSeason = data.data?.find((item: LifetimeData | RawSeasonData): item is RawSeasonData => 
            'metadata' in item && 
            item.metadata !== undefined &&
            item.metadata !== null &&
            'episodeName' in item.metadata &&
            Boolean(item.metadata.episodeName)
          );
          const isFirstSeason: boolean = metadata?.episodeName === firstSeason?.metadata?.episodeName;
          const lifetimeStats: LifetimeStats | undefined = isFirstSeason ? {
            lifetimeHours,
            lifetimeMatches
          } : undefined;

          const topAgents: AgentInfo[] = (metadata?.topAgents ?? []).map((agent) => ({
            name: agent.name ?? '',
            imageUrl: agent.imageUrl ?? '',
            playtime: agent.playtime ?? 0,
            playtimeHoursAndMinutes: this.formatPlaytime(agent.playtime ?? 0),
            color: agent.color ?? ''
          }));

          return {
            id: season.attributes?.act ?? '',
            seasonName: metadata?.episodeName ?? '',
            actName: metadata?.actName ?? '',
            combinedName: `${metadata?.episodeName} ${metadata?.actName}`.trim(),
            ...(lifetimeStats && { lifetimeStats }),
            topAgents,
            stats: {
              timePlayed: this.extractStatValue(stats?.timePlayed),
              matchesPlayed: this.extractStatValue(stats?.matchesPlayed),
              matchesWon: this.extractStatValue(stats?.matchesWon),
              matchesLost: this.extractStatValue(stats?.matchesLost),
              matchesTied: this.extractStatValue(stats?.matchesTied),
              matchesWinPct: this.extractStatValue(stats?.matchesWinPct),
              kills: this.extractStatValue(stats?.kills),
              deaths: this.extractStatValue(stats?.deaths),
              kDRatio: this.extractStatValue(stats?.kDRatio),
              damagePerRound: this.extractStatValue(stats?.damagePerRound),
              headshotsPercentage: this.extractStatValue(stats?.headshotsPercentage),
              kAST: this.extractStatValue(stats?.kAST),
              mostKillsInMatch: this.extractStatValue(stats?.mostKillsInMatch),
              rank: this.extractRankInfo(stats?.rank),
              peakRank: this.extractRankInfo(stats?.peakRank),
              scorePerRound: this.extractStatValue(stats?.scorePerRound)
            }
          };
        })
        .sort((a: SeasonData, b: SeasonData) => {
          // Sort by episode and act in descending order
          const aNumbers = this.extractSeasonNumbers(a.seasonName);
          const bNumbers = this.extractSeasonNumbers(b.seasonName);
          return bNumbers.episode !== aNumbers.episode
            ? bNumbers.episode - aNumbers.episode
            : bNumbers.act - aNumbers.act;
        });

      return seasonData;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMatchList(
    name: string, 
    tag: string, 
    options?: {
      type?: string;
      season?: string;
      agent?: string;
      map?: string;
      page?: number;
    }
  ): Promise<MatchListResponse> {
    const encodedTag = encodeURIComponent(`${name}#${tag}`);
    
    try {
      const url = new URL(`${this.BASE_URL}/matches/riot/${encodedTag}`);
      url.searchParams.append('source', 'overwolf-2');

      if (options?.type) {
        url.searchParams.append('type', this.getPlaylistFromMode(options.type));
      }
      if (options?.season) {
        url.searchParams.append('season', options.season);
      }
      if (options?.agent) {
        url.searchParams.append('agent', options.agent);
      }
      if (options?.map) {
        url.searchParams.append('map', options.map);
      }
      if (options?.page) {
        url.searchParams.append('next', options.page.toString());
      }

      const response = await fetch(url.toString(), {
        headers: this.DEFAULT_HEADERS
      });

      if (!response.ok) {
        throw this.createError(response.status);
      }

      const data = await response.json();

      return {
        matches: data.data.matches.map((match: RawMatch) => ({
          id: match.attributes.id,
          timestamp: match.metadata.timestamp,
          season: {
            id: match.attributes.seasonId,
            name: match.metadata.seasonName
          },
          gamemode: {
            name: match.metadata.modeName,
            imageUrl: match.metadata.modeImageUrl
          },
          map: {
            id: match.metadata.map,
            name: match.metadata.mapName,
            imageUrl: match.metadata.mapImageUrl
          },
          stats: {
            hasWon: match.segments[0].metadata.hasWon,
            agent: {
              name: match.segments[0].metadata.agentName,
              id: match.segments[0].metadata.agent,
              imageUrl: match.segments[0].metadata.agentImageUrl,
              color: match.segments[0].metadata.agentColor
            },
            matchLength: match.segments[0].stats.playtime.displayValue,
            roundsPlayed: this.extractStatValue(match.segments[0].stats.roundsPlayed),
            roundsWon: this.extractStatValue(match.segments[0].stats.roundsWon),
            roundsLost: this.extractStatValue(match.segments[0].stats.roundsLost),
            kills: this.extractStatValue(match.segments[0].stats.kills),
            deaths: this.extractStatValue(match.segments[0].stats.deaths),
            assists: this.extractStatValue(match.segments[0].stats.assists),
            kDRatio: this.extractStatValue(match.segments[0].stats.kdRatio),
            headshotsPercentage: this.extractStatValue(match.segments[0].stats.hsAccuracy),
            damagePerRound: this.extractStatValue(match.segments[0].stats.damagePerRound),
            damageDeltaPerRound: this.extractStatValue(match.segments[0].stats.damageDeltaPerRound),
            scorePerRound: this.extractStatValue(match.segments[0].stats.scorePerRound),
            kAST: this.extractStatValue(match.segments[0].stats.kast),
            trnPerformanceScore: this.extractStatValue(match.segments[0].stats.trnPerformanceScore),
            rank: this.extractRankInfo(match.segments[0].stats.rank)
          }
        }))
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMatchDetails(matchId: string): Promise<MatchDetailsResponse> {
    try {
      const url = new URL(`${this.BASE_URL}/matches/${matchId}`);
      url.searchParams.append('source', 'overwolf-2');

      const response = await fetch(url.toString(), {
        headers: this.DEFAULT_HEADERS
      });

      if (!response.ok) {
        throw this.createError(response.status);
      }

      const data = await response.json();

      // Process team summaries
      const teams = data.segments
        .filter((segment: RawTeamSegment) => segment.type === 'team-summary')
        .map((team: RawTeamSegment) => ({
          teamId: team.attributes.teamId,
          hasWon: team.metadata.hasWon,
          roundsWon: this.extractStatValue(team.stats.roundsWon),
          roundsLost: this.extractStatValue(team.stats.roundsLost)
        }));

      // Process player summaries
      const rawData = data as RawMatchResponse;
      const players = rawData.segments
        .filter((segment: RawTeamSegment | RawPlayerSegment): segment is RawPlayerSegment => 
          segment.type === 'player-summary'
        )
        .map((player: RawPlayerSegment) => ({
          platformUserHandle: player.metadata.platformInfo.platformUserHandle,
          partyId: player.metadata.partyId,
          teamId: player.metadata.teamId,
          agent: {
            id: player.metadata.agentKey,
            name: player.metadata.agentName,
            color: player.metadata.agentColor,
            imageUrl: player.metadata.agentImageUrl,
            portraitUrl: player.metadata.agentPortraitUrl
          },
          accountLevel: player.metadata.accountLevel,
          matchRank: {
            ...this.extractRankInfo(player.stats.rank),
            displayValue: player.stats.rank.displayValue
          },
          currentRank: {
            ...this.extractRankInfo(player.stats.currRank),
            rating: parseInt(player.stats.currRank.displayValue, 10)
          },
          stats: {
            scorePerRound: this.extractStatValue(player.stats.scorePerRound),
            kills: this.extractStatValue(player.stats.kills),
            deaths: this.extractStatValue(player.stats.deaths),
            assists: this.extractStatValue(player.stats.assists),
            kDRatio: this.extractStatValue(player.stats.kdRatio),
            damagePerRound: this.extractStatValue(player.stats.damagePerRound),
            damageDeltaPerRound: this.extractStatValue(player.stats.damageDeltaPerRound),
            plants: this.extractStatValue(player.stats.plants),
            defuses: this.extractStatValue(player.stats.defuses),
            firstKills: this.extractStatValue(player.stats.firstKills),
            firstDeaths: this.extractStatValue(player.stats.firstDeaths),
            headshotPercentage: this.extractStatValue(player.stats.hsAccuracy),
            kAST: this.extractStatValue(player.stats.kast),
            trnPerformanceScore: this.extractStatValue(player.stats.trnPerformanceScore)
          }
        }));

      // Process streams
      const streams = (rawData.streams?.entries ?? []).map((entry: RawStreamEntry) => ({
        playerInfo: {
          platformUserHandle: entry.playerInfo.platformUserHandle
        },
        video: {
          platformSlug: entry.video.platformSlug,
          platformUserHandle: entry.video.platformUserHandle,
          platformUserId: entry.video.platformUserId,
          timestamp: entry.video.timestamp,
          startedAt: entry.video.startedAt,
          endedAt: entry.video.endedAt,
          duration: entry.video.duration,
          viewCount: entry.video.viewCount,
          title: entry.video.title,
          url: entry.video.url,
          thumbnailUrl: entry.video.thumbnailUrl,
          isOnline: entry.video.isOnline
        }
      }));

      return {
        timestamp: rawData.metadata.dateStarted,
        duration: rawData.metadata.duration,
        durationFormatted: this.formatDuration(rawData.metadata.duration),
        gamemode: {
          name: rawData.metadata.modeName,
          playlist: rawData.metadata.playlist
        },
        map: {
          id: rawData.metadata.map,
          name: rawData.metadata.mapName,
          imageUrl: rawData.metadata.mapImageUrl,
          minimapUrl: rawData.metadata.mapDetails?.imageUrl ?? ''
        },
        teams,
        players,
        streams
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

// Export a singleton instance
export const valorantAPI = Object.freeze(new ValorantAPI());