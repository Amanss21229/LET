import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getFirebaseUser,
} from "@/lib/firebase-server-auth";

import {
  prisma,
} from "@/lib/prisma";


export async function GET(
  request: NextRequest
) {

  try {

    const firebaseUser =
      await getFirebaseUser(
        request
      );


    if (!firebaseUser) {

      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );

    }


    const rows =
      await prisma.batchAccess.findMany({

        where: {

          userId:
            firebaseUser.user.id,

        },

        include: {

          batch: true,

        },

        orderBy: {

          createdAt:
            "desc",

        },

      });


    return NextResponse.json({

      batches:
        rows,

    });

  }

  catch (error) {

    console.error(
      "My batches error:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to load batches",
      },
      {
        status: 500,
      }
    );

  }

          }
