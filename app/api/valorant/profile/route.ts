// app/api/valorant/profile/route.ts
import { valorantAPI } from '@/services/valorant-api';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { gzip, deflate, brotliCompress } from 'zlib';
import { promisify } from 'util';

// Promisify compression functions
const gzipPromise = promisify(gzip);
const deflatePromise = promisify(deflate);
const brotliPromise = promisify(brotliCompress);

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Disable response caching
export const fetchCache = 'force-no-store';
export const revalidate = 0;

interface ErrorResponse {
  status: 'error';
  error: string;
}

interface SuccessResponse {
  status: 'success';
  data: Awaited<ReturnType<typeof valorantAPI.getProfile>>;
}

type ApiResponse = ErrorResponse | SuccessResponse;

async function compressResponse(data: string, acceptEncoding: string | null): Promise<{
  compressedData: Buffer;
  encoding: string;
}> {
  // Default to no compression if no encoding header
  if (!acceptEncoding) {
    return {
      compressedData: Buffer.from(data),
      encoding: 'identity'
    };
  }

  // Check supported encodings
  const supportedEncodings = acceptEncoding.toLowerCase().split(',').map(e => e.trim());

  try {
    // Prefer Brotli compression if supported
    if (supportedEncodings.includes('br')) {
      return {
        compressedData: await brotliPromise(Buffer.from(data)),
        encoding: 'br'
      };
    }
    
    // Fall back to gzip if supported
    if (supportedEncodings.includes('gzip')) {
      return {
        compressedData: await gzipPromise(Buffer.from(data)),
        encoding: 'gzip'
      };
    }
    
    // Use deflate if supported
    if (supportedEncodings.includes('deflate')) {
      return {
        compressedData: await deflatePromise(Buffer.from(data)),
        encoding: 'deflate'
      };
    }
  } catch (error) {
    console.warn('Compression failed, falling back to uncompressed:', error);
  }

  // Fall back to no compression
  return {
    compressedData: Buffer.from(data),
    encoding: 'identity'
  };
}

async function createCompressedResponse(
  responseData: ApiResponse, 
  status: number, 
  acceptEncoding: string | null
): Promise<NextResponse> {
  const { compressedData, encoding } = await compressResponse(
    JSON.stringify(responseData),
    acceptEncoding
  );

  return new NextResponse(compressedData, {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Content-Encoding': encoding,
      'Cache-Control': 'no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Vary': 'Accept-Encoding'
    }
  });
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  let acceptEncoding: string | null = null;
  
  try {
    // Get headers inside try block since it can throw
    const headersList = headers();
    acceptEncoding = headersList.get('accept-encoding');
    
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');
    const tag = searchParams.get('tag');

    if (!name || !tag) {
      const errorResponse = {
        status: 'error',
        error: 'Name and tag are required'
      } satisfies ErrorResponse;

      return await createCompressedResponse(errorResponse, 400, acceptEncoding);
    }

    const data = await valorantAPI.getProfile(name, tag);
    const successResponse = {
      status: 'success',
      data
    } satisfies SuccessResponse;

    return await createCompressedResponse(successResponse, 200, acceptEncoding);

  } catch (error) {
    const err = error as Error;
    const errorResponse = {
      status: 'error',
      error: err.message || 'An unexpected error occurred'
    } satisfies ErrorResponse;

    return await createCompressedResponse(errorResponse, 500, acceptEncoding);
  }
}