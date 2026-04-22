import { NextResponse } from "next/server";
import { logout } from "@/lib/auth";

function doLogout(req: Request) {
  logout();
  const url = new URL("/admin/login", req.url);
  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(req: Request) {
  return doLogout(req);
}

export async function GET(req: Request) {
  return doLogout(req);
}
