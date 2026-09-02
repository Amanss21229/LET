import { NextRequest, NextResponse } from "next/server";

import { firebaseAdminAuth } from "@/lib/firebase-admin";

import { prisma } from "@/lib/prisma";


export async function POST(
  request: NextRequest
) {

  try {

    const authorization =
      request.headers.get("authorization");


    if (
      !authorization ||
      !authorization.startsWith("Bearer ")
    ) {

      return NextResponse.json(
        {
          error: "Unauthorized",
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
      Never trust the Firebase UID
      sent directly from frontend.
    */

    const decodedToken =
      await firebaseAdminAuth.verifyIdToken(
        idToken
      );


    const firebaseUid =
      decodedToken.uid;


    const email =
      decodedToken.email;


    const name =
      decodedToken.name;


    const image =
      decodedToken.picture;


    /*
      Google login should normally
      provide an email.
    */

    if (!email) {

      return NextResponse.json(
        {
          error:
            "Google account email not available",
        },
        {
          status: 400,
        }
      );

    }


    /*
      STEP 1

      Check whether this Firebase UID
      is already connected.
    */

    let user =
      await prisma.user.findFirst({

        where: {
          firebaseUid,
        },

      });


    /*
      STEP 2

      Firebase UID not found.

      Search existing LET user
      using email.
    */

    if (!user) {

      user =
        await prisma.user.findFirst({

          where: {
            email,
          },

        });

    }


    /*
      STEP 3

      Existing user found.

      Link Firebase account.
    */

    if (user) {

      /*
        Safety check.

        Another user should not already
        be linked with this Firebase UID.
      */

      const firebaseUser =
        await prisma.user.findFirst({

          where: {
            firebaseUid,
          },

        });


      if (
        firebaseUser &&
        firebaseUser.id !== user.id
      ) {

        return NextResponse.json(
          {
            error:
              "Firebase account is already linked to another user.",
          },
          {
            status: 409,
          }
        );

      }


      user =
        await prisma.user.update({

          where: {
            id: user.id,
          },

          data: {

            firebaseUid,

            /*
              Update Google image only
              if user does not already
              have an image.
            */

            image:
              user.image || image || null,

          },

        });

    }


    /*
      STEP 4

      New user.

      Create user in Neon.
    */

    else {

      user =
        await prisma.user.create({

          data: {

            firebaseUid,

            email,

            name:
              name || null,

            image:
              image || null,

            profileComplete:
              false,

          },

        });

    }


    /*
      Return safe user data.
    */

    return NextResponse.json({

      success: true,

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
      "Firebase sync error:",
      error
    );


    return NextResponse.json(

      {
        error:
          "Authentication failed",
      },

      {
        status: 500,
      }

    );

  }

}
