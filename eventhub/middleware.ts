import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname;

  if (!token) {
    // No token → force login
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Admin-only protection
    if (pathname.startsWith("/adminDashboard") && decoded.role !== "admin") {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    // (Optional) User-only protection
    if (pathname.startsWith("/userDashboard") && decoded.role !== "user") {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (err) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}
