import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  cookies,
} from "next/headers";

import {
  prisma,
} from "@/lib/prisma";

import {
  getFirebaseUser,
} from "@/lib/firebase-server-auth";


export async function GET(
  request: NextRequest,

  {
    params,
  }: {

    params:
      Promise<{
        id: string;
      }>;

  }
) {

  try {

    const { id } =
      await params;


    const firebaseUser =
      await getFirebaseUser(
        request
      );


    const isAdmin =
      (await cookies())
        .get("let_admin")
        ?.value === "true";


    if (
      !firebaseUser &&
      !isAdmin
    ) {

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


    const conversation =
      await prisma.conversation.findUnique({

        where: {
          id,
        },

      });


    if (!conversation) {

      return NextResponse.json(
        {
          error:
            "Conversation not found",
        },
        {
          status: 404,
        }
      );

    }


    /*
      Normal user can only
      read own conversation.
    */

    if (
      firebaseUser &&
      !isAdmin &&
      conversation.userId !==
        firebaseUser.user.id
    ) {

      return NextResponse.json(
        {
          error:
            "Forbidden",
        },
        {
          status: 403,
        }
      );

    }


    const messages =
      await prisma.message.findMany({

        where: {

          conversationId:
            id,

        },

        include: {

          sender: true,

        },

        orderBy: {

          createdAt:
            "asc",

        },

      });


    return NextResponse.json(
      messages
    );

  }

  catch (error) {

    console.error(
      "Messages GET error:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to load messages",
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

    params:
      Promise<{
        id: string;
      }>;

  }
) {

  try {

    const { id } =
      await params;


    const firebaseUser =
      await getFirebaseUser(
        request
      );


    const isAdmin =
      (await cookies())
        .get("let_admin")
        ?.value === "true";


    if (
      !firebaseUser &&
      !isAdmin
    ) {

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


    const conversation =
      await prisma.conversation.findUnique({

        where: {
          id,
        },

      });


    if (!conversation) {

      return NextResponse.json(
        {
          error:
            "Conversation not found",
        },
        {
          status: 404,
        }
      );

    }


    /*
      User can only reply
      to own conversation.
    */

    if (
      firebaseUser &&
      !isAdmin &&
      conversation.userId !==
        firebaseUser.user.id
    ) {

      return NextResponse.json(
        {
          error:
            "Forbidden",
        },
        {
          status: 403,
        }
      );

    }


    const body =
      await request.json();


    let senderId;


    /*
      Firebase user message
    */

    if (
      firebaseUser &&
      !isAdmin
    ) {

      senderId =
        firebaseUser.user.id;

    }


    /*
      Admin message

      Current database schema
      requires a senderId.

      We use conversation owner
      as database sender reference
      temporarily.

      Admin UI can still
      identify admin message
      through the admin workflow.
    */

    else {

      senderId =
        conversation.userId;

    }


    const message =
      await prisma.message.create({

        data: {

          conversationId:
            id,

          senderId,

          text:
            body.text || null,

          attachmentUrl:
            body.attachmentUrl || null,

          attachmentType:
            body.attachmentType || null,

        },

      });


    await prisma.conversation.update({

      where: {
        id,
      },

      data: {

        updatedAt:
          new Date(),

      },

    });


    return NextResponse.json(
      message
    );

  }

  catch (error) {

    console.error(
      "Message POST error:",
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
