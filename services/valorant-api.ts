// services/valorant-api.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { z } from 'zod';
import { memoize } from 'lodash';
import { DateTime } from 'luxon';
import pino from 'pino';

// Initialize logger
const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
});

// Base Zod Schemas
const StatValueSchema = z.object({
  displayValue: z.string(),
  percentile: z.number().optional(),
  metadata: z.object({
    tierName: z.string().optional(),
    iconUrl: z.string().optional()
  }).optional()
});

const RankInfoSchema = z.object({
  tierName: z.string(),
  iconUrl: z.string(),
  rating: z.string()
});

const AgentInfoSchema = z.object({
  name: z.string(),
  imageUrl: z.string(),
  color: z.string()
});

// Raw Data Schemas for API Responses
const RawTopAgentSchema = z.object({
  name: z.string().optional(),
  imageUrl: z.string().optional(),
  playtime: z.number().optional(),
  color: z.string().optional()
});

const RawSeasonDataSchema = z.object({
  metadata: z.object({
    episodeName: z.string().optional(),
    actName: z.string().optional(),
    topAgents: z.array(RawTopAgentSchema).optional()
  }).optional(),
  stats: z.record(StatValueSchema).optional(),
  attributes: z.object({
    act: z.string().optional()
  }).optional(),
  type: z.string().optional()
});

const RawTeamSegmentSchema = z.object({
  type: z.literal('team-summary'),
  attributes: z.object({
    teamId: z.string()
  }),
  metadata: z.object({
    hasWon: z.boolean()
  }),
  stats: z.object({
    roundsWon: StatValueSchema,
    roundsLost: StatValueSchema
  })
});

const RawPlayerSegmentSchema = z.object({
  type: z.literal('player-summary'),
  metadata: z.object({
    platformInfo: z.object({
      platformUserHandle: z.string()
    }),
    partyId: z.string(),
    teamId: z.string(),
    agentKey: z.string(),
    agentName: z.string(),
    agentColor: z.string(),
    agentImageUrl: z.string(),
    agentPortraitUrl: z.string(),
    accountLevel: z.number()
  }),
  stats: z.object({
    rank: StatValueSchema.extend({ displayValue: z.string() }),
    currRank: StatValueSchema.extend({ displayValue: z.string() }),
    scorePerRound: StatValueSchema,
    kills: StatValueSchema,
    deaths: StatValueSchema,
    assists: StatValueSchema,
    kdRatio: StatValueSchema,
    damagePerRound: StatValueSchema,
    damageDeltaPerRound: StatValueSchema,
    plants: StatValueSchema,
    defuses: StatValueSchema,
    firstKills: StatValueSchema,
    firstDeaths: StatValueSchema,
    headshotsPercentage: StatValueSchema,
    kAST: StatValueSchema,
    trnPerformanceScore: StatValueSchema
  })
});

// Response Schemas
const ProfileStatsSchema = z.object({
  timePlayed: StatValueSchema,
  matchesPlayed: StatValueSchema,
  matchesWon: StatValueSchema,
  matchesLost: StatValueSchema,
  matchesTied: StatValueSchema,
  matchesWinPct: StatValueSchema,
  kills: StatValueSchema,
  deaths: StatValueSchema,
  assists: StatValueSchema,
  kDRatio: StatValueSchema,
  kDARatio: StatValueSchema,
  damagePerRound: StatValueSchema,
  headshotsPercentage: StatValueSchema,
  kAST: StatValueSchema,
  mostKillsInMatch: StatValueSchema,
  aces: StatValueSchema,
  rank: RankInfoSchema,
  peakRank: RankInfoSchema,
  trnPerformanceScore: StatValueSchema
});

const ProfileResponseSchema = z.object({
  platformInfo: z.object({
    platformUserHandle: z.string(),
    platformUserIdentifier: z.string(),
    avatarUrl: z.string()
  }),
  stats: ProfileStatsSchema,
  metadata: z.object({
    defaultPlatform: z.string(),
    defaultPlaylist: z.string(),
    defaultSeason: z.string(),
    region: z.string()
  })
});

const SeasonStatsSchema = ProfileStatsSchema.omit({
  assists: true,
  trnPerformanceScore: true,
  kDARatio: true,
  aces: true
}).extend({
  scorePerRound: StatValueSchema
});

const TopAgentSchema = AgentInfoSchema.extend({
  playtime: z.number(),
  playtimeHoursAndMinutes: z.string()
});

const SeasonDataSchema = z.object({
  id: z.string(),
  seasonName: z.string(),
  actName: z.string(),
  combinedName: z.string(),
  lifetimeStats: z.object({
    lifetimeHours: z.string(),
    lifetimeMatches: z.string()
  }).optional(),
  topAgents: z.array(TopAgentSchema),
  stats: SeasonStatsSchema
});

const MatchStatsSchema = z.object({
  hasWon: z.boolean(),
  agent: AgentInfoSchema.extend({
    id: z.string()
  }),
  matchLength: z.string(),
  roundsPlayed: StatValueSchema,
  roundsWon: StatValueSchema,
  roundsLost: StatValueSchema,
  kills: StatValueSchema,
  deaths: StatValueSchema,
  assists: StatValueSchema,
  kDRatio: StatValueSchema,
  headshotsPercentage: StatValueSchema,
  damagePerRound: StatValueSchema,
  damageDeltaPerRound: StatValueSchema,
  scorePerRound: StatValueSchema,
  kAST: StatValueSchema,
  trnPerformanceScore: StatValueSchema,
  rank: RankInfoSchema
});

const MatchResponseSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  season: z.object({
    id: z.string(),
    name: z.string()
  }),
  gamemode: z.object({
    name: z.string(),
    imageUrl: z.string()
  }),
  map: z.object({
    id: z.string(),
    name: z.string(),
    imageUrl: z.string()
  }),
  stats: MatchStatsSchema
});

const MatchListResponseSchema = z.object({
  matches: z.array(MatchResponseSchema)
});

const TeamSummarySchema = z.object({
  teamId: z.string(),
  hasWon: z.boolean(),
  roundsWon: StatValueSchema,
  roundsLost: StatValueSchema
});

const PlayerSummarySchema = z.object({
  platformUserHandle: z.string(),
  partyId: z.string(),
  teamId: z.string(),
  agent: AgentInfoSchema.extend({
    id: z.string(),
    portraitUrl: z.string()
  }),
  accountLevel: z.number(),
  matchRank: RankInfoSchema.extend({
    displayValue: z.string()
  }),
  currentRank: RankInfoSchema.extend({
    rating: z.string()
  }),
  stats: z.object({
    scorePerRound: StatValueSchema,
    kills: StatValueSchema,
    deaths: StatValueSchema,
    assists: StatValueSchema,
    kDRatio: StatValueSchema,
    damagePerRound: StatValueSchema,
    damageDeltaPerRound: StatValueSchema,
    plants: StatValueSchema,
    defuses: StatValueSchema,
    firstKills: StatValueSchema,
    firstDeaths: StatValueSchema,
    headshotPercentage: StatValueSchema,
    kAST: StatValueSchema,
    trnPerformanceScore: StatValueSchema
  })
});

const StreamInfoSchema = z.object({
  playerInfo: z.object({
    platformUserHandle: z.string()
  }),
  video: z.object({
    platformSlug: z.string(),
    platformUserHandle: z.string(),
    platformUserId: z.string(),
    timestamp: z.string(),
    startedAt: z.string(),
    endedAt: z.string(),
    duration: z.number(),
    viewCount: z.number(),
    title: z.string(),
    url: z.string(),
    thumbnailUrl: z.string(),
    isOnline: z.boolean()
  })
});

const MatchDetailsResponseSchema = z.object({
  timestamp: z.string(),
  duration: z.number(),
  durationFormatted: z.string(),
  gamemode: z.object({
    name: z.string(),
    playlist: z.string()
  }),
  map: z.object({
    id: z.string(),
    name: z.string(),
    imageUrl: z.string(),
    minimapUrl: z.string()
  }),
  teams: z.array(TeamSummarySchema),
  players: z.array(PlayerSummarySchema),
  streams: z.array(StreamInfoSchema)
});

// Export types based on schemas
export type ProfileResponse = z.infer<typeof ProfileResponseSchema>;
export type SeasonData = z.infer<typeof SeasonDataSchema>;
export type MatchListResponse = z.infer<typeof MatchListResponseSchema>;
export type MatchDetailsResponse = z.infer<typeof MatchDetailsResponseSchema>;
export type RawSeasonData = z.infer<typeof RawSeasonDataSchema>;
export type RawTeamSegment = z.infer<typeof RawTeamSegmentSchema>;
export type RawPlayerSegment = z.infer<typeof RawPlayerSegmentSchema>;

export class ValorantAPI {
  private readonly axiosInstance: AxiosInstance;
  private readonly BASE_URL = 'https://api.tracker.network/api/v2/valorant/standard';

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.BASE_URL,
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    // Add response interceptor for logging
    this.axiosInstance.interceptors.response.use(
      (response) => {
        logger.info({
          url: response.config.url,
          status: response.status,
          duration: response.headers['x-response-time']
        });
        return response;
      },
      (error: AxiosError) => {
        logger.error({
          url: error.config?.url,
          status: error.response?.status,
          error: error.message
        });
        throw error;
      }
    );
  }

  // Memoized utility functions
  private getPlaylistFromMode = memoize((mode: string): string => {
    const playlists: Record<string, string> = {
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
  });

  private extractSeasonNumbers = memoize((name: string): { episode: number; act: number } => {
    const match = name.match(/E(\d+):\s*A(\d+)/);
    return match 
      ? { episode: parseInt(match[1]), act: parseInt(match[2]) }
      : { episode: 0, act: 0 };
  });

  // Time formatting using Luxon
  private formatPlaytime(seconds: number): string {
    const duration = DateTime.fromMillis(seconds * 1000);
    return `${Math.floor(duration.toMillis() / (1000 * 60 * 60))}h ${Math.floor((duration.toMillis() % (1000 * 60 * 60)) / (1000 * 60))}m`;
  }

  private formatDuration(ms: number): string {
    const duration = DateTime.fromMillis(ms);
    const hours = Math.floor(duration.toMillis() / (1000 * 60 * 60));
    return hours > 0 
      ? `${hours}h ${Math.floor((duration.toMillis() % (1000 * 60 * 60)) / (1000 * 60))}m`
      : `${Math.floor(duration.toMillis() / (1000 * 60))}m`;
  }

  // Enhanced error handling
  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data?.error ?? error.message;
      
      logger.error({
        type: 'API_ERROR',
        status,
        message,
        url: error.config?.url
      });

      throw new APIError(message, status);
    }

    if (error instanceof z.ZodError) {
      logger.error({
        type: 'VALIDATION_ERROR',
        errors: error.errors
      });

      throw new ValidationError('Invalid response data', error.errors);
    }

    logger.error({
      type: 'UNKNOWN_ERROR',
      error
    });

    throw new Error('An unknown error occurred');
  }

  // API Methods
  async getProfile(name: string, tag: string): Promise<ProfileResponse> {
    try {
      const encodedTag = encodeURIComponent(`${name}#${tag}`);
      const { data } = await this.axiosInstance.get(`/profile/riot/${encodedTag}`, {
        params: { source: 'overwolf-2' }
      });

      return ProfileResponseSchema.parse(data);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getSeasonReport(name: string, tag: string, gamemode: string): Promise<SeasonData[]> {
    try {
      const encodedTag = encodeURIComponent(`${name}#${tag}`);
      const { data } = await this.axiosInstance.get(
        `/profile/riot/${encodedTag}/segments/season-report`,
        {
          params: {
            playlist: this.getPlaylistFromMode(gamemode),
            source: 'overwolf-2'
          }
        }
      );

      // Process season data
      const seasonData = data.data
        .filter((season: unknown) => RawSeasonDataSchema.safeParse(season).success)
        .map((season: z.infer<typeof RawSeasonDataSchema>) => ({
          id: season.attributes?.act ?? '',
          seasonName: season.metadata?.episodeName ?? '',
          actName: season.metadata?.actName ?? '',
          combinedName: `${season.metadata?.episodeName} ${season.metadata?.actName}`.trim(),
          topAgents: (season.metadata?.topAgents ?? []).map(agent => ({
            name: agent.name ?? '',
            imageUrl: agent.imageUrl ?? '',
            color: agent.color ?? '',
            playtime: agent.playtime ?? 0,
            playtimeHoursAndMinutes: this.formatPlaytime(agent.playtime ?? 0)
          })),
          stats: season.stats ?? {}
        }))
        .sort((a: z.infer<typeof SeasonDataSchema>, b: z.infer<typeof SeasonDataSchema>) => {
          const aNumbers = this.extractSeasonNumbers(a.seasonName);
          const bNumbers = this.extractSeasonNumbers(b.seasonName);
          return bNumbers.episode !== aNumbers.episode
            ? bNumbers.episode - aNumbers.episode
            : bNumbers.act - aNumbers.act;
        });

      return z.array(SeasonDataSchema).parse(seasonData);
    } catch (error) {
      this.handleError(error);
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
    try {
      const encodedTag = encodeURIComponent(`${name}#${tag}`);
      const { data } = await this.axiosInstance.get(`/matches/riot/${encodedTag}`, {
        params: {
          source: 'overwolf-2',
          ...(options?.type && { type: this.getPlaylistFromMode(options.type) }),
          ...(options?.season && { season: options.season }),
          ...(options?.agent && { agent: options.agent }),
          ...(options?.map && { map: options.map }),
          ...(options?.page && { next: options.page })
        }
      });

      return MatchListResponseSchema.parse(data);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getMatchDetails(matchId: string): Promise<MatchDetailsResponse> {
    try {
      const { data } = await this.axiosInstance.get(`/matches/${matchId}`, {
        params: { source: 'overwolf-2' }
      });

      // Process teams
      const teams = data.segments
        .filter((segment: unknown) => RawTeamSegmentSchema.safeParse(segment).success)
        .map((team: z.infer<typeof RawTeamSegmentSchema>) => ({
          teamId: team.attributes.teamId,
          hasWon: team.metadata.hasWon,
          roundsWon: team.stats.roundsWon,
          roundsLost: team.stats.roundsLost
        }));

      // Process players
      const players = data.segments
        .filter((segment: unknown) => RawPlayerSegmentSchema.safeParse(segment).success)
        .map((player: z.infer<typeof RawPlayerSegmentSchema>) => ({
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
            tierName: player.stats.rank.metadata?.tierName ?? 'Unranked',
            iconUrl: player.stats.rank.metadata?.iconUrl ?? '',
            displayValue: player.stats.rank.displayValue
          },
          currentRank: {
            tierName: player.stats.currRank.metadata?.tierName ?? 'Unranked',
            iconUrl: player.stats.currRank.metadata?.iconUrl ?? '',
            rating: player.stats.currRank.displayValue
          },
          stats: {
            scorePerRound: player.stats.scorePerRound,
            kills: player.stats.kills,
            deaths: player.stats.deaths,
            assists: player.stats.assists,
            kDRatio: player.stats.kdRatio,
            damagePerRound: player.stats.damagePerRound,
            damageDeltaPerRound: player.stats.damageDeltaPerRound,
            plants: player.stats.plants,
            defuses: player.stats.defuses,
            firstKills: player.stats.firstKills,
            firstDeaths: player.stats.firstDeaths,
            headshotPercentage: player.stats.headshotsPercentage,
            kAST: player.stats.kAST,
            trnPerformanceScore: player.stats.trnPerformanceScore
          }
        }));

      const matchDetails = {
        timestamp: data.metadata.dateStarted,
        duration: data.metadata.duration,
        durationFormatted: this.formatDuration(data.metadata.duration),
        gamemode: {
          name: data.metadata.modeName,
          playlist: data.metadata.playlist
        },
        map: {
          id: data.metadata.map,
          name: data.metadata.mapName,
          imageUrl: data.metadata.mapImageUrl,
          minimapUrl: data.metadata.mapDetails?.imageUrl ?? ''
        },
        teams,
        players,
        streams: data.streams?.entries ?? []
      };

      return MatchDetailsResponseSchema.parse(matchDetails);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Cache response data
  private async cacheResponse(key: string, data: unknown, ttl: number = 300): Promise<void> {
    logger.debug(`Would cache data for key: ${key} with TTL: ${ttl}s`);
    // Redis implementation would go here if needed
  }
}

// Custom error classes for better error handling
export class APIError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public details: z.ZodError['errors']) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Export singleton instance
export const valorantAPI = Object.freeze(new ValorantAPI());