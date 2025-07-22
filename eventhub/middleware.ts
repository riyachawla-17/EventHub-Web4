import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.clone();

  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/userDashboard",
    "/userDashboard/:path*",
    "/adminDashboard",
    "/adminDashboard/:path*",
    "/registeredEvents",
    "/myEvents",
    "/edit-profile",
    "/api/users/:path*",
    "/api/events/:path*",
  ],
};
