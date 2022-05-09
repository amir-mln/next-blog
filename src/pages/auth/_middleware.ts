import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { CustomNextRequest } from 'types/types';

export async function middleware(req: CustomNextRequest) {
  const token = await getToken({ req });

  if (token) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
}
