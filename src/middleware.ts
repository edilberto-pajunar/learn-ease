import { NextResponse } from 'next/server'
import { sessionStatus } from './app/utils/session'

const protectedRoutes = ['/', '/middlewareside']

export default function middleware(req: any) {
  // if (!sessionStatus && protectedRoutes.includes(req.nextUrl.pathname)) {
  //     const absoluteURL = new URL("/", req.nextUrl.origin);
  //     return NextResponse.redirect(absoluteURL.toString());
  // }
}
