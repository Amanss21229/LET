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


const MODERATOR_EMAIL =
  "amanss21229@gmail.com";


function isModerator(
  email:
    string | undefined
) {

  return (
    email?.toLowerCase() ===
    MODERATOR_EMAIL.toLowerCase()
  );

}


export async function PATCH(

  request: NextRequest,

  {
    params,
  }: {
    params: Promise<{
      userId: string;
    }>;
  }

) {

  try {

    const {
      userId,
    } =
      await params;


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


    if (
      !isModerator(
        firebaseUser.token?.email
      )
    ) {

      return NextResponse.json(
        {
          error:
            "Moderator access required.",
        },
        {
          status: 403,
        }
      );

    }


    if (
      userId ===
      firebaseUser.user.id
    ) {

      return NextResponse.json(
        {
          error:
            "You cannot block your own account.",
        },
        {
          status: 400,
        }
      );

    }


    const body =
      await request.json();


    const blocked =
      Boolean(
        body?.blocked
      );


    const user =
      await prisma.user.findUnique({

        where: {
          id:
            userId,
        },

        select: {
          id:
            true,

          name:
            true,

          email:
            true,

        },

      });


    if (!user) {

      return NextResponse.json(
        {
          error:
            "User not found.",
        },
        {
          status: 404,
        }
      );

    }


    const updated =
      await prisma.user.update({

        where: {
          id:
            userId,
        },

        data: {

          commentBlocked:
            blocked,

        },

        select: {

          id:
            true,

          name:
            true,

          email:
            true,

          commentBlocked:
            true,

        },

      });


    return NextResponse.json({

      user:
        updated,

    });

  }

  catch (error) {

    console.error(
      "Comment moderation error:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to update comment restriction.",
      },
      {
        status: 500,
      }
    );

  }

}
