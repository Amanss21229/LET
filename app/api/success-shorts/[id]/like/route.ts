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


export async function GET(

  _request: NextRequest,

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


    const count =
      await prisma.successShortLike.count({

        where: {

          shortId:
            id,

        },

      });


    return NextResponse.json({

      likes:
        count,

    });

  }

  catch {

    return NextResponse.json(
      {
        error:
          "Unable to load likes",
      },
      {
        status: 500,
      }
    );

  }

}


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


    const existingLike =
      await prisma.successShortLike.findUnique({

        where: {

          shortId_userId: {

            shortId:
              id,

            userId:
              firebaseUser.user.id,

          },

        },

      });


    if (existingLike) {

      await prisma.successShortLike.delete({

        where: {

          id:
            existingLike.id,

        },

      });


      const likes =
        await prisma.successShortLike.count({

          where: {

            shortId:
              id,

          },

        });


      return NextResponse.json({

        liked:
          false,

        likes,

      });

    }


    await prisma.successShortLike.create({

      data: {

        shortId:
          id,

        userId:
          firebaseUser.user.id,

      },

    });


    const likes =
      await prisma.successShortLike.count({

        where: {

          shortId:
            id,

        },

      });


    return NextResponse.json({

      liked:
        true,

      likes,

    });

  }

  catch (error) {

    console.error(
      "Success Short like error:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to update like",
      },
      {
        status: 500,
      }
    );

  }

}
