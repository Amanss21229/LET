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
    !authorization.startsWith("Bearer ")
  ) {

    return null;

  }


  const idToken =
    authorization.replace(
      "Bearer ",
      ""
    );


  try {

    const decodedToken =
      await firebaseAdminAuth.verifyIdToken(
        idToken
      );


    let user =
      await prisma.user.findUnique({

        where: {
          firebaseUid:
            decodedToken.uid,
        },

      });


    /*
      Extra safety:
      If Firebase UID is not linked yet,
      find the existing user by email.
    */

    if (
      !user &&
      decodedToken.email
    ) {

      user =
        await prisma.user.findUnique({

          where: {
            email:
              decodedToken.email,
          },

        });

    }


    if (!user) {

      return null;

    }


    /*
      Automatically link Firebase UID
      with existing user if needed.
    */

    if (
      user.firebaseUid !==
      decodedToken.uid
    ) {

      user =
        await prisma.user.update({

          where: {
            id:
              user.id,
          },

          data: {
            firebaseUid:
              decodedToken.uid,
          },

        });

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
