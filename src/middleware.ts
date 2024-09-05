import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  
  const token = request.cookies.get("auth.token")?.value || null;
  const { pathname } = request.nextUrl;
  
  if (pathname === "/login" && request.cookies.has("auth.token") && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else {
    if(!request.cookies.has("auth.token") && pathname !== "/login" || pathname === "/"){
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/","/login", "/dashboard", "/master/:path*"]
};
