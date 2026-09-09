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


export async function POST(

  request: NextRequest,

  {
    params,
  }: {
    params: Promise<{
      id: string;
      commentId: string;
    }>;
  }

) {

  try {

    const {
      commentId,
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
            "Please login to like comments.",
        },
        {
          status: 401,
        }
      );

    }


    const userId =
      firebaseUser.user.id;


    const comment =
      await prisma.successShortComment.findUnique({

        where: {
          id:
            commentId,
        },

        select: {
          id:
            true,
        },

      });


    if (!comment) {

      return NextResponse.json(
        {
          error:
            "Comment not found.",
        },
        {
          status: 404,
        }
      );

    }


    const existing =
      await prisma.successShortCommentLike.findUnique({

        where: {

          commentId_userId: {

            commentId,

            userId,

          },

        },

      });


    let liked;


    if (existing) {

      await prisma.successShortCommentLike.delete({

        where: {
          id:
            existing.id,
        },

      });

      liked =
        false;

    }

    else {

      await prisma.successShortCommentLike.create({

        data: {

          commentId,

          userId,

        },

      });

      liked =
        true;

    }


    const likeCount =
      await prisma.successShortCommentLike.count({

        where: {
          commentId,
        },

      });


    return NextResponse.json({

      liked,

      likes:
        likeCount,

    });

  }

  catch (error) {

    console.error(
      "Comment like error:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to update comment like.",
      },
      {
        status: 500,
      }
    );

  }

}
