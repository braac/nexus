// app/api/valorant/match/[matchId]/route.ts
import { valorantAPI } from '@/services/valorant-api';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ErrorResponse {
  status: 'error';
  error: string;
}

interface SuccessResponse {
  status: 'success';
  data: Awaited<ReturnType<typeof valorantAPI.getMatchDetails>>;
}

type ApiResponse = ErrorResponse | SuccessResponse;

interface RouteParams {
  params: {
    matchId: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse>> {
  try {
    if (!params.matchId) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'Match ID is required'
        } satisfies ErrorResponse,
        { status: 400 }
      );
    }

    const data = await valorantAPI.getMatchDetails(params.matchId);
    
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