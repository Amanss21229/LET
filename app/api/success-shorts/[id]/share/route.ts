import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  prisma,
} from "@/lib/prisma";

import {
  getFirebaseUser,
} from "@/lib/firebase-server-auth";


export async function POST(

  request: NextRequest,

  {
    params,
  }: {

    params: Promise<{
      id: string;
    }>;

  }

) {

  try {

    const {
      id,
    } =
      await params;


    const short =
      await prisma.successShort.findUnique({

        where: {

          id,

        },

      });


    if (!short) {

      return NextResponse.json(
        {
          error:
            "Success Short not found",
        },
        {
          status: 404,
        }
      );

    }


    const firebaseUser =
      await getFirebaseUser(
        request
      );


    await prisma.successShortShare.create({

      data: {

        shortId:
          id,

        userId:
          firebaseUser?.user.id || null,

      },

    });


    const shares =
      await prisma.successShortShare.count({

        where: {

          shortId:
            id,

        },

      });


    return NextResponse.json({

      shares,

    });

  }

  catch (error) {

    console.error(
      "Success Short share error:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to record share",
      },
      {
        status: 500,
      }
    );

  }

}
