// app/api/valorant/profile/matchlist/route.ts
import { valorantAPI } from '@/services/valorant-api';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ErrorResponse {
  status: 'error';
  error: string;
}

interface SuccessResponse {
  status: 'success';
  data: Awaited<ReturnType<typeof valorantAPI.getMatchList>>;
}

type ApiResponse = ErrorResponse | SuccessResponse;

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');
    const tag = searchParams.get('tag');
    const gamemode = searchParams.get('gamemode');
    const season = searchParams.get('season');
    const agent = searchParams.get('agent');
    const map = searchParams.get('map');
    const next = searchParams.get('next');

    if (!name || !tag) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'Name and tag are required'
        } satisfies ErrorResponse,
        { status: 400 }
      );
    }

    const data = await valorantAPI.getMatchList(name, tag, {
      type: gamemode || undefined,
      season: season || undefined,
      agent: agent || undefined,
      map: map || undefined,
      page: next ? parseInt(next) : undefined
    });
    
    return NextResponse.json({
      status: 'success',
      data
    } satisfies SuccessResponse);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      {
        status: 'error',
        error: err.message || 'An unexpected error occurred'
      } satisfies ErrorResponse,
      { status: 500 }
    );
  }
}