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
            "Unauthorized",
        },
        {
          status: 401,
        }
      );

    }


    if (
      firebaseUser.user.commentBlocked
    ) {

      return NextResponse.json(
        {
          error:
            "Your account is blocked from commenting.",
        },
        {
          status: 403,
        }
      );

    }


    const comment =
      await prisma.successShortComment.findUnique({

        where: {
          id:
            commentId,
        },

      });


    if (!comment) {

      return NextResponse.json(
        {
          error:
            "Comment not found",
        },
        {
          status: 404,
        }
      );

    }


    if (
      comment.userId !==
      firebaseUser.user.id
    ) {

      return NextResponse.json(
        {
          error:
            "You can only edit your own comment.",
        },
        {
          status: 403,
        }
      );

    }


    const body =
      await request.json();


    const text =
      String(
        body?.text ||
        ""
      ).trim();


    if (!text) {

      return NextResponse.json(
        {
          error:
            "Comment cannot be empty.",
        },
        {
          status: 400,
        }
      );

    }


    if (
      text.length > 1000
    ) {

      return NextResponse.json(
        {
          error:
            "Comment must be 1000 characters or less.",
        },
        {
          status: 400,
        }
      );

    }


    const updated =
      await prisma.successShortComment.update({

        where: {
          id:
            commentId,
        },

        data: {
          text,
        },

      });


    return NextResponse.json({
      comment:
        updated,
    });

  }

  catch (error) {

    console.error(
      "Comment PATCH error:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to edit comment",
      },
      {
        status: 500,
      }
    );

  }

}


export async function DELETE(

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
            "Unauthorized",
        },
        {
          status: 401,
        }
      );

    }


    const comment =
      await prisma.successShortComment.findUnique({

        where: {
          id:
            commentId,
        },

        select: {

          id:
            true,

          userId:
            true,

        },

      });


    if (!comment) {

      return NextResponse.json(
        {
          error:
            "Comment not found",
        },
        {
          status: 404,
        }
      );

    }


    const moderator =
      isModerator(
        firebaseUser.token?.email
      );


    const owner =
      comment.userId ===
      firebaseUser.user.id;


    if (
      !owner &&
      !moderator
    ) {

      return NextResponse.json(
        {
          error:
            "You are not allowed to delete this comment.",
        },
        {
          status: 403,
        }
      );

    }


    await prisma.successShortComment.delete({

      where: {
        id:
          commentId,
      },

    });


    return NextResponse.json({
      success:
        true,
    });

  }

  catch (error) {

    console.error(
      "Comment DELETE error:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to delete comment",
      },
      {
        status: 500,
      }
    );

  }

}
