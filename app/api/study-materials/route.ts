import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories =
      await prisma.studyCategory.findMany({
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            createdAt: "desc",
          },
        ],

        include: {
          subjects: {
            orderBy: [
              {
                sortOrder: "asc",
              },
              {
                createdAt: "desc",
              },
            ],

            include: {
              materials: {
                orderBy: {
                  createdAt: "desc",
                },
              },
            },
          },
        },
      });

    return NextResponse.json({
      categories,
    });
  } catch (error) {
    console.error(
      "Study materials load error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load study materials",
      },
      {
        status: 500,
      }
    );
  }
}
