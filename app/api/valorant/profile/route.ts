import { trackerAPI } from '@/services/tracker-api';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // This makes the route dynamic

export async function GET(request: NextRequest) {
  try {
    // Get and validate query parameters using NextRequest
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');
    const tag = searchParams.get('tag');
    const mode = searchParams.get('mode') || 'competitive';
    const seasonId = searchParams.get('seasonId');

    if (!name || !tag) {
      return NextResponse.json(
        { error: 'Name and tag are required' },
        { status: 400 }
      );
    }

    // Get both profile and season data
    const [profile, seasons] = await Promise.all([
      trackerAPI.getProfile(name, tag),
      trackerAPI.getSeasonReport(name, tag, mode)
    ]);

    // Find specific season if seasonId is provided
    const selectedSeason = seasonId 
      ? seasons.find(season => season.id === seasonId)
      : seasons[0]; // Default to most recent season

    return NextResponse.json({
      status: 'success',
      data: {
        player: {
          name: profile.platformInfo.platformUserHandle,
          avatarUrl: profile.platformInfo.avatarUrl
        },
        currentSeason: selectedSeason || null,
        seasons: seasons.map(season => ({
          id: season.id,
          name: season.name
        }))
      }
    });

  } catch (error) {
    console.error('Error in /api/valorant/profile:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          status: 'error',
          error: error.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        status: 'error',
        error: 'An unknown error occurred'
      },
      { status: 500 }
    );
  }
}