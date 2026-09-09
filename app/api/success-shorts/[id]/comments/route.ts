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


export async function GET(

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


    const firebaseUser =
      await getFirebaseUser(
        request
      );


    const currentUserId =
      firebaseUser?.user.id ||
      null;


    const comments =
      await prisma.successShortComment.findMany({

        where: {
          shortId: id,
        },

        orderBy: {
          createdAt:
            "desc",
        },

        include: {

          user: {

            select: {

              id:
                true,

              name:
                true,

              image:
                true,

              email:
                true,

              commentBlocked:
                true,

            },

          },

          likes: {

            select: {

              userId:
                true,

            },

          },

        },

      });


    const formatted =
      comments.map(
        (comment) => {

          const liked =
            currentUserId
              ? comment.likes.some(
                  (like) =>
                    like.userId ===
                    currentUserId
                )
              : false;


          const canEdit =
            currentUserId ===
            comment.userId;


          const canDelete =
            canEdit ||
            isModerator(
              firebaseUser?.token
                ?.email
            );


          return {

            id:
              comment.id,

            text:
              comment.text,

            createdAt:
              comment.createdAt,

            updatedAt:
              comment.updatedAt,

            user: {

              id:
                comment.user.id,

              name:
                comment.user.name ||
                "Student",

              image:
                comment.user.image ||
                "",

            },

            likeCount:
              comment.likes.length,

            likedByCurrentUser:
              liked,

            canEdit,

            canDelete,

            isBlocked:
              comment.user
                .commentBlocked,

          };

        }
      );


    return NextResponse.json({
      comments:
        formatted,
    });

  }

  catch (error) {

    console.error(
      "Success Short comments GET error:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to load comments",
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

    const {
      id:
        shortId,
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
            "Please login to comment",
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


    const short =
      await prisma.successShort.findUnique({

        where: {
          id:
            shortId,
        },

        select: {
          id:
            true,
        },

      });


    if (!short) {

      return NextResponse.json(
        {
          error:
            "Success Short not found.",
        },
        {
          status: 404,
        }
      );

    }


    const comment =
      await prisma.successShortComment.create({

        data: {

          shortId,

          userId:
            firebaseUser.user.id,

          text,

        },

        include: {

          user: {

            select: {

              id:
                true,

              name:
                true,

              image:
                true,

            },

          },

        },

      });


    return NextResponse.json(
      {
        comment: {

          id:
            comment.id,

          text:
            comment.text,

          createdAt:
            comment.createdAt,

          updatedAt:
            comment.updatedAt,

          user: {

            id:
              comment.user.id,

            name:
              comment.user.name ||
              "Student",

            image:
              comment.user.image ||
              "",

          },

          likeCount:
            0,

          likedByCurrentUser:
            false,

          canEdit:
            true,

          canDelete:
            true,

          isBlocked:
            false,

        },

      },
      {
        status: 201,
      }
    );

  }

  catch (error) {

    console.error(
      "Success Short comment POST error:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to post comment",
      },
      {
        status: 500,
      }
    );

  }

}
