import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyAdminSession,
} from "@/lib/admin-auth";


export async function GET(
  _: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const { id } = await params;

  const batch =
    await prisma.batch.findUnique({
      where: {
        id,
      },

      include: {
        sections: {
          include: {
            items: true,
          },

          orderBy: {
            sortOrder: "asc",
          },
        },

        notifications: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

  if (!batch) {
    return NextResponse.json(
      {
        error: "Batch not found",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(batch);
}


export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json(
      {
        error: "Forbidden",
      },
      {
        status: 403,
      }
    );
  }

  const { id } = await params;

  const body = await req.json();

  const data: any = {};

  if (
    body.title !== undefined
  ) {
    data.title = body.title;
  }

  if (
    body.className !== undefined
  ) {
    data.className =
      body.className;
  }

  if (
    body.medium !== undefined
  ) {
    data.medium =
      body.medium;
  }

  if (
    body.teacherName !== undefined
  ) {
    data.teacherName =
      body.teacherName;
  }

  if (
    body.imageUrl !== undefined
  ) {
    data.imageUrl =
      body.imageUrl || null;
  }

  if (
    body.price !== undefined
  ) {
    data.price =
      Number(body.price || 0);
  }

  if (
    body.about !== undefined
  ) {
    data.about =
      body.about;
  }

  if (
    body.customPoints !== undefined
  ) {
    data.customPoints =
      body.customPoints;
  }

  if (
    body.buyEnabled !== undefined
  ) {
    data.buyEnabled =
      Boolean(body.buyEnabled);
  }

  if (
    body.startDate !== undefined
  ) {
    data.startDate =
      body.startDate
        ? new Date(body.startDate)
        : null;
  }

  if (
    body.endDate !== undefined
  ) {
    data.endDate =
      body.endDate
        ? new Date(body.endDate)
        : null;
  }

  if (
    body.syllabusDate !== undefined
  ) {
    data.syllabusDate =
      body.syllabusDate
        ? new Date(
            body.syllabusDate
          )
        : null;
  }

  const batch =
    await prisma.batch.update({
      where: {
        id,
      },

      data,
    });

  return NextResponse.json(
    batch
  );
}


export async function DELETE(
  _: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json(
      {
        error: "Forbidden",
      },
      {
        status: 403,
      }
    );
  }

  const { id } = await params;

  await prisma.batch.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({
    ok: true,
  });
}
