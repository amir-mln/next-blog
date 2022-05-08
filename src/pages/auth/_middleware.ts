import { getSession } from 'next-auth/react';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const haseSession = Object.hasOwn(req.cookies, 'next-auth.session-token');

  if (haseSession) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
}
