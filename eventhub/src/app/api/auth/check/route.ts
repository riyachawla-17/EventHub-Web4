import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const cookiesObj = await cookies();
  const token = cookiesObj.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return NextResponse.json(
      { message: "Authorized", role: decoded.role },
      { status: 200 }
    );
  } catch (err) {
    console.error("Invalid token:", err);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
