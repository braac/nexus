// app/api/valorant/profile/route.ts
import { valorantAPI } from '@/services/valorant-api';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ErrorResponse {
  status: 'error';
  error: string;
}

interface SuccessResponse {
  status: 'success';
  data: Awaited<ReturnType<typeof valorantAPI.getProfile>>;
}

type ApiResponse = ErrorResponse | SuccessResponse;

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');
    const tag = searchParams.get('tag');

    if (!name || !tag) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'Name and tag are required'
        } satisfies ErrorResponse,
        { status: 400 }
      );
    }

    const data = await valorantAPI.getProfile(name, tag);
    
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