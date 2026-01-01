import { NextRequest } from 'next/server';
import { tokenService } from '@/lib/token-service';
import { createTokenSchema, listTokensSchema } from '@/lib/validators';
import { extractApiKey, validateApiKey } from '@/lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/utils/response';

export async function POST(request: NextRequest) {
  try {
    
    const apiKey = extractApiKey(request.headers);
    if (!validateApiKey(apiKey)) {
      return unauthorizedResponse('Invalid or missing API key');
    }

 
    const body = await request.json();

   
    const validation = createTokenSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.flatten().fieldErrors);
    }

    
    const token = await tokenService.createToken(validation.data);

    return successResponse(token, 201);
  } catch (error) {
    console.error('Error creating token:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    
    const apiKey = extractApiKey(request.headers);
    if (!validateApiKey(apiKey)) {
      return unauthorizedResponse('Invalid or missing API key');
    }

   
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    
    const validation = listTokensSchema.safeParse({ userId });
    if (!validation.success) {
      return validationErrorResponse(validation.error.flatten().fieldErrors);
    }


    const tokens = await tokenService.listNonExpiredTokens(validation.data.userId);

    return successResponse(tokens);
  } catch (error) {
    console.error('Error listing tokens:', error);
    return errorResponse('Internal server error', 500);
  }
}