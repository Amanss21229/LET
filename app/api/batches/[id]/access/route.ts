import { NextResponse } from "next/server";

import {
  prisma,
} from "@/lib/prisma";

import {
  verifyAdminSession,
} from "@/lib/admin-auth";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
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

  const { id } =
    await params;

  const { email } =
    await req.json();

  const user =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (!user) {
    return NextResponse.json(
      {
        error:
          "User not found",
      },
      {
        status: 404,
      }
    );
  }

  const access =
    await prisma.batchAccess.upsert({
      where: {
        userId_batchId: {
          userId: user.id,
          batchId: id,
        },
      },

      update: {},

      create: {
        userId: user.id,
        batchId: id,
      },
    });

  return NextResponse.json(
    access
  );
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
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

  const { id } =
    await params;

  const { email } =
    await req.json();

  const user =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (user) {
    await prisma.batchAccess.deleteMany(
      {
        where: {
          userId:
            user.id,

          batchId:
            id,
        },
      }
    );
  }

  return NextResponse.json({
    ok: true,
  });
}
