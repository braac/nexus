// app/api/valorant/profile/route.ts

import { trackerAPI, type ApiError } from '@/services/tracker-api';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Disable caching for this route

export async function GET(request: NextRequest) {
  try {
    // Get and validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');
    const tag = searchParams.get('tag');
    const mode = searchParams.get('mode') || 'competitive';
    const seasonId = searchParams.get('seasonId');

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

    // Convert mode to proper playlist format
    const playlist = trackerAPI.getPlaylistFromMode(mode);

    try {
      // Get both profile and season data concurrently
      const [profile, seasonData] = await Promise.all([
        trackerAPI.getProfile(name, tag),
        trackerAPI.getSeasonReport(name, tag, playlist)
      ]);

      // Find specific season if seasonId is provided
      const selectedSeason = seasonId 
        ? seasonData.find(season => season.id === seasonId)
        : seasonData[0]; // Default to most recent season

      return NextResponse.json({
        status: 'success',
        data: {
          profile,
          seasonData: seasonData,
          currentSeason: selectedSeason || null,
          seasons: seasonData.map(season => ({
            id: season.id,
            name: season.name
          }))
        }
      });

    } catch (error) {
      // Handle API errors with proper typing
      const apiError = error as ApiError;
      return NextResponse.json(
        { 
          status: 'error',
          error: apiError.message || 'Failed to fetch player data'
        },
        { status: apiError.status || 500 }
      );
    }

  } catch (error) {
    // Handle unexpected errors
    console.error('Error in /api/valorant/profile:', error);
    const unexpectedError = error as Error;
    
    return NextResponse.json(
      { 
        status: 'error',
        error: unexpectedError.message || 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}