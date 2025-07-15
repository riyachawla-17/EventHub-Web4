import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname;

  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (pathname.startsWith("/adminDashboard") && decoded.role !== "admin") {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/userDashboard") && decoded.role !== "user") {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
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
