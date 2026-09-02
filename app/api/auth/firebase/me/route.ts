import { NextRequest, NextResponse } from "next/server";

import { firebaseAdminAuth } from "@/lib/firebase-admin";

import { prisma } from "@/lib/prisma";


export async function GET(
  request: NextRequest
) {

  try {

    const authorization =
      request.headers.get(
        "authorization"
      );


    if (

      !authorization ||

      !authorization.startsWith(
        "Bearer "
      )

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


    const idToken =
      authorization.replace(
        "Bearer ",
        ""
      );


    /*
      Verify Firebase token.
    */

    const decodedToken =
      await firebaseAdminAuth.verifyIdToken(
        idToken
      );


    const firebaseUid =
      decodedToken.uid;


    /*
      Find LET user.
    */

    const user =
      await prisma.user.findFirst({

        where: {
          firebaseUid,
        },

      });


    if (!user) {

      return NextResponse.json(

        {
          error:
            "User not found",
        },

        {
          status: 404,
        }

      );

    }


    return NextResponse.json({

      user: {

        id:
          user.id,

        firebaseUid:
          user.firebaseUid,

        name:
          user.name,

        email:
          user.email,

        image:
          user.image,

        phone:
          user.phone,

        className:
          user.className,

        profileComplete:
          user.profileComplete,

      },

    });

  }

  catch (error) {

    console.error(
      "Firebase authentication error:",
      error
    );


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

}
