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


    await prisma.successShortView.create({

      data: {

        shortId:
          id,

        userId:
          firebaseUser?.user.id || null,

      },

    });


    const views =
      await prisma.successShortView.count({

        where: {

          shortId:
            id,

        },

      });


    return NextResponse.json({

      views,

    });

  }

  catch (error) {

    console.error(
      "Success Short view error:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to record view",
      },
      {
        status: 500,
      }
    );

  }

}
