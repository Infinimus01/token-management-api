import { NextResponse } from 'next/server';

export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function unauthorizedResponse(message: string = 'Unauthorized') {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function validationErrorResponse(errors: Record<string, string[]>) {
  return NextResponse.json(
    { 
      error: 'Validation failed', 
      details: errors 
    }, 
    { status: 400 }
  );
}