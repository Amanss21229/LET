import { NextResponse } from "next/server";

import {
  prisma,
} from "@/lib/prisma";

import {
  verifyAdminSession,
} from "@/lib/admin-auth";

export async function GET() {
  const tutor =
    await prisma.tutorPage.findUnique({
      where: {
        id: "main",
      },
    });

  return NextResponse.json(
    tutor || {
      content: {
        heading:
          "About Aman",

        subheading:
          "LET - Learn Earn Teach",

        text:
          "Welcome to LET",
      },
    }
  );
}

export async function PUT(
  req: Request
) {
  const isAdmin =
    await verifyAdminSession();

  if (!isAdmin) {
    return NextResponse.json(
      {
        error: "Forbidden",
      },
      {
        status: 403,
      }
    );
  }

  const {
    content,
  } =
    await req.json();

  const tutor =
    await prisma.tutorPage.upsert({
      where: {
        id: "main",
      },

      update: {
        content,
      },

      create: {
        id: "main",
        content,
      },
    });

  return NextResponse.json(
    tutor
  );
}
