import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  verifyAdminSession,
} from "@/lib/admin-auth";

import {
  prisma,
} from "@/lib/prisma";

import {
  getFirebaseUser,
} from "@/lib/firebase-server-auth";


/* =====================
   GET MESSAGES
===================== */

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


    const adminSession =
      await verifyAdminSession();


    const isAdmin =
      !firebaseUser &&
      adminSession;

    
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

          status:
            401,

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

          status:
            404,

        }

      );

    }


    /*
      Student can only open
      their own conversation.
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

          status:
            403,

        }

      );

    }


    /*
      MARK MESSAGES AS READ

      Admin opens chat:
      USER messages become read.

      User opens chat:
      TUTOR messages become read.
    */

    if (isAdmin) {

      await prisma.message.updateMany({

        where: {

          conversationId:
            id,


          senderRole:
            "USER",


          readAt:
            null,

        },


        data: {

          readAt:
            new Date(),

        },

      });

    }

    else {

      await prisma.message.updateMany({

        where: {

          conversationId:
            id,


          senderRole:
            "TUTOR",


          readAt:
            null,

        },


        data: {

          readAt:
            new Date(),

        },

      });

    }


    const messages =
      await prisma.message.findMany({

        where: {

          conversationId:
            id,

        },


        include: {

          sender:
            true,

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

        status:
          500,

      }

    );

  }

}


/* =====================
   SEND MESSAGE
===================== */

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


    const adminSession =
      await verifyAdminSession();


    const isAdmin =
      !firebaseUser &&
      adminSession;


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

          status:
            401,

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

          status:
            404,

        }

      );

    }


    /*
      Student can only send
      to their own chat.
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

          status:
            403,

        }

      );

    }


    const body =
      await request.json();


    if (

      !body.text?.trim() &&

      !body.attachmentUrl

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
      CREATE MESSAGE

      USER:
      senderId = actual student

      TUTOR:
      senderId = null

      This prevents the
      wrong-name problem.
    */

    const message =
      await prisma.message.create({

        data: {

          conversationId:
            id,


          senderId:

            isAdmin

              ? null

              : firebaseUser?.user.id ||
                null,


          senderRole:

            isAdmin

              ? "TUTOR"

              : "USER",


          text:
            body.text?.trim() ||
            null,


          attachmentUrl:
            body.attachmentUrl ||
            null,


          attachmentType:
            body.attachmentType ||
            null,

        },


        include: {

          sender:
            true,

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

        status:
          500,

      }

    );

  }

}
