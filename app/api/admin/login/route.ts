import { NextResponse } from "next/server";

import {
  createAdminSession,
  getAdminCookieName,
} from "@/lib/admin-auth";

export async function POST(
  req: Request
) {
  try {
    const body =
      await req.json();

    const password =
      body.password;

    const adminPassword =
      process.env.ADMIN_PASSWORD;

    if (
      !adminPassword ||
      !password ||
      password !== adminPassword
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Invalid password",
        },
        {
          status: 401,
        }
      );
    }

    const token =
      await createAdminSession();

    const response =
      NextResponse.json({
        ok: true,
      });

    response.cookies.set(
      getAdminCookieName(),
      token,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        path: "/",

        maxAge:
          60 * 60 * 12,
      }
    );

    return response;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Login failed",
      },
      {
        status: 500,
      }
    );
  }
}
