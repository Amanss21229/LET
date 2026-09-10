import { NextResponse } from "next/server";

import {
  currentUser,
} from "@/lib/guards";

import {
  prisma,
} from "@/lib/prisma";


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

  try {

    const { id } =
      await params;


    /*
      User must be logged in.
    */
    const user =
      await currentUser();


    if (!user) {

      return NextResponse.json(
        {
          error:
            "Please login to get free access.",
        },
        {
          status: 401,
        }
      );

    }


    /*
      Fetch the batch and verify
      that it is actually FREE.

      This is important for security:
      nobody can use this endpoint
      to get a paid batch for free.
    */
    const batch =
      await prisma.batch.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          title: true,
          price: true,
          buyEnabled: true,
        },
      });


    if (!batch) {

      return NextResponse.json(
        {
          error:
            "Batch not found.",
        },
        {
          status: 404,
        }
      );

    }


    /*
      FREE ACCESS ONLY

      Price must be exactly 0.
    */
    if (batch.price !== 0) {

      return NextResponse.json(
        {
          error:
            "This batch is not free.",
        },
        {
          status: 403,
        }
      );

    }


    /*
      Respect admin's Buy Now setting.
      If Buy Now is disabled, do not
      allow this self-enrollment route.
    */
    if (!batch.buyEnabled) {

      return NextResponse.json(
        {
          error:
            "Free enrollment is currently disabled for this batch.",
        },
        {
          status: 403,
        }
      );

    }


    /*
      Grant access.

      upsert makes this safe if the user
      already has access.
    */
    const access =
      await prisma.batchAccess.upsert({
        where: {
          userId_batchId: {
            userId: user.id,
            batchId: batch.id,
          },
        },

        update: {},

        create: {
          userId: user.id,
          batchId: batch.id,
        },
      });


    return NextResponse.json({
      success: true,
      access,
      batchId: batch.id,
    });

  }
  catch (error) {

    console.error(
      "Free batch access error:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to get free batch access.",
      },
      {
        status: 500,
      }
    );

  }

}
