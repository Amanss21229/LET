import { NextRequest } from "next/server";

import { firebaseAdminAuth } from "@/lib/firebase-admin";

import { prisma } from "@/lib/prisma";


export async function getFirebaseUser(
  request: NextRequest
) {

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

    return null;

  }


  const idToken =
    authorization.replace(
      "Bearer ",
      ""
    );


  try {

    /*
      Verify Firebase token.
    */

    const decodedToken =
      await firebaseAdminAuth.verifyIdToken(
        idToken
      );


    /*
      Find user in Neon.
    */

    const user =
      await prisma.user.findFirst({

        where: {

          firebaseUid:
            decodedToken.uid,

        },

      });


    if (!user) {

      return null;

    }


    return {

      user,

      firebaseUid:
        decodedToken.uid,

      token:
        decodedToken,

    };

  }

  catch (error) {

    console.error(

      "Firebase token verification failed:",

      error

    );


    return null;

  }

}
