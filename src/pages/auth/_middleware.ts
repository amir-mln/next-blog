import { getToken } from 'next-auth/jwt';
import { NextFetchEvent, NextResponse } from 'next/server';
import { CustomNextRequest } from 'types/types';

export async function middleware(req: CustomNextRequest) {
  const token = getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (token) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
}
