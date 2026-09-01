import { NextResponse } from "next/server";

import {
  prisma,
} from "@/lib/prisma";

import {
  verifyAdminSession,
} from "@/lib/admin-auth";

export async function GET() {
  const batches =
    await prisma.batch.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

  return NextResponse.json(
    batches
  );
}

export async function POST(
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

  const b =
    await req.json();

  const batch =
    await prisma.batch.create({
      data: {
        title:
          b.title,

        className:
          b.className,

        medium:
          b.medium,

        teacherName:
          b.teacherName ||
          "Aman",

        imageUrl:
          b.imageUrl ||
          null,

        startDate:
          b.startDate
            ? new Date(
                b.startDate
              )
            : null,

        endDate:
          b.endDate
            ? new Date(
                b.endDate
              )
            : null,

        syllabusDate:
          b.syllabusDate
            ? new Date(
                b.syllabusDate
              )
            : null,

        price:
          Number(
            b.price || 0
          ),

        about:
          b.about || "",

        customPoints:
          b.customPoints || [],

        buyEnabled:
          b.buyEnabled !== false,
      },
    });

  return NextResponse.json(
    batch
  );
}
