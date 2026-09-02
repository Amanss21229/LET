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


    const conversations =
      await prisma.conversation.findMany({

        where: {

          userId:
            firebaseUser.user.id,

        },

        include: {

          batch: true,

          messages: true,

        },

        orderBy: {

          updatedAt:
            "desc",

        },

      });


    return NextResponse.json(
      conversations
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
        status: 500,
      }
    );

  }

}


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
          status: 401,
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
          status: 400,
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

          text:
            text || null,

          attachmentUrl:
            attachmentUrl || null,

          attachmentType:
            attachmentType || null,

        },

      });


    return NextResponse.json(
      message
    );

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
        status: 500,
      }
    );

  }

}
