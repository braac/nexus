// app/api/valorant/profile/route.ts

import { valorantAPI } from '@/services/valorant-api';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Disable caching for this route

export async function GET(request: NextRequest) {
  try {
    // Get and validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');
    const tag = searchParams.get('tag');
    const mode = searchParams.get('mode') || 'competitive';
    const rawSeasonId = searchParams.get('seasonId');
    const seasonId = rawSeasonId || undefined;

    // Validate required parameters
    if (!name || !tag) {
      return NextResponse.json(
        { 
          status: 'error',
          error: 'Name and tag are required' 
        },
        { status: 400 }
      );
    }

    try {
      // Get the profile data which now includes availableSeasons
      const profile = await valorantAPI.getProfile(name, tag, mode, seasonId);

      // Get the season report if not in Auto mode
      let seasonData = [];
      if (mode.toLowerCase() !== 'auto') {
        const playlist = valorantAPI.getPlaylistFromMode(mode);
        seasonData = await valorantAPI.getSeasonReport(name, tag, playlist);
      }

      // Find current season either from seasonId or take first available
      const currentSeason = seasonId 
        ? profile.availableSeasons.find(season => season.id === seasonId)
        : profile.availableSeasons[0];

      return NextResponse.json({
        status: 'success',
        data: {
          profile,
          seasonData,
          currentSeason,
          seasons: profile.availableSeasons // Use seasons from profile instead of season report
        }
      });

    } catch (error) {
      const err = error as Error;
      return NextResponse.json(
        { 
          status: 'error',
          error: err.message || 'Failed to fetch player data'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    // Handle unexpected errors
    console.error('Error in /api/valorant/profile:', error);
    const err = error as Error;
    
    return NextResponse.json(
      { 
        status: 'error',
        error: err.message || 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}