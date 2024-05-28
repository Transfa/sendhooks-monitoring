import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/hooks", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|auth|_next/static|_next/image|.*\\.png$).*)"],
};
