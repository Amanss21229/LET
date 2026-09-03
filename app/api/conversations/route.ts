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

import {
  verifyAdminSession,
} from "@/lib/admin-auth";


/* =====================
   GET CONVERSATIONS
===================== */

export async function GET(
  request: NextRequest
) {

  try {

    const isAdmin =
      await verifyAdminSession();


    /* =====================
       ADMIN CONVERSATIONS
    ===================== */

    if (isAdmin) {

      const conversations =
        await prisma.conversation.findMany({

          include: {

            user: true,

            batch: true,


            messages: {

              orderBy: {

                createdAt:
                  "desc",

              },

              take:
                1,

            },


            _count: {

              select: {

                messages: {

                  where: {

                    senderRole:
                      "USER",

                    readAt:
                      null,

                  },

                },

              },

            },

          },


          orderBy: {

            updatedAt:
              "desc",

          },

        });


      const formatted =
        conversations.map(
          (
            conversation
          ) => ({

            ...conversation,

            unreadCount:

              conversation._count
                .messages,

            lastMessage:

              conversation.messages[0] ||
              null,

          })
        );


      return NextResponse.json(
        formatted
      );

    }


    /* =====================
       NORMAL USER
    ===================== */

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

          status:
            401,

        }

      );

    }


    const conversations =
      await prisma.conversation.findMany({

        where: {

          userId:
            firebaseUser.user.id,

        },


        include: {

          batch:
            true,


          messages: {

            orderBy: {

              createdAt:
                "desc",

            },

            take:
              1,

          },


          _count: {

            select: {

              messages: {

                where: {

                  senderRole:
                    "TUTOR",

                  readAt:
                    null,

                },

              },

            },

          },

        },


        orderBy: {

          updatedAt:
            "desc",

        },

      });


    const formatted =
      conversations.map(
        (
          conversation
        ) => ({

          ...conversation,

          unreadCount:

            conversation._count
              .messages,

          lastMessage:

            conversation.messages[0] ||
            null,

        })
      );


    return NextResponse.json(
      formatted
    );

  }

  catch (error) {

    console.error(
      "Conversation GET error:",
      error
    );


    return NextResponse.json(

      {

        error:
          "Unable to load conversations",

      },

      {

        status:
          500,

      }

    );

  }

}


/* =====================
   CREATE CONVERSATION
   + FIRST MESSAGE
===================== */

export async function POST(
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

          status:
            401,

        }

      );

    }


    const body =
      await request.json();


    const {

      batchId,

      text,

      attachmentUrl,

      attachmentType,

    } =
      body;


    if (!batchId) {

      return NextResponse.json(

        {

          error:
            "Batch ID is required",

        },

        {

          status:
            400,

        }

      );

    }


    if (

      !text?.trim() &&

      !attachmentUrl

    ) {

      return NextResponse.json(

        {

          error:
            "Message cannot be empty",

        },

        {

          status:
            400,

        }

      );

    }


    /*
      Security:
      User must have access
      to this batch.
    */

    const access =
      await prisma.batchAccess.findUnique({

        where: {

          userId_batchId: {

            userId:
              firebaseUser.user.id,

            batchId,

          },

        },

      });


    if (!access) {

      return NextResponse.json(

        {

          error:
            "You do not have access to this batch",

        },

        {

          status:
            403,

        }

      );

    }


    const conversation =
      await prisma.conversation.upsert({

        where: {

          userId_batchId: {

            userId:
              firebaseUser.user.id,

            batchId,

          },

        },


        update: {

          updatedAt:
            new Date(),

        },


        create: {

          userId:
            firebaseUser.user.id,

          batchId,

        },

      });


    const message =
      await prisma.message.create({

        data: {

          conversationId:
            conversation.id,


          senderId:
            firebaseUser.user.id,


          senderRole:
            "USER",


          text:
            text?.trim() ||
            null,


          attachmentUrl:
            attachmentUrl ||
            null,


          attachmentType:
            attachmentType ||
            null,

        },

      });


    await prisma.conversation.update({

      where: {

        id:
          conversation.id,

      },

      data: {

        updatedAt:
          new Date(),

      },

    });


    return NextResponse.json({

      conversation,

      message,

    });

  }

  catch (error) {

    console.error(
      "Conversation POST error:",
      error
    );


    return NextResponse.json(

      {

        error:
          "Unable to send message",

      },

      {

        status:
          500,

      }

    );

  }

}
