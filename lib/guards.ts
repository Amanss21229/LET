import {
  cookies,
} from "next/headers";

import {
  firebaseAdminAuth,
} from "@/lib/firebase-admin";

import {
  prisma,
} from "@/lib/prisma";


type CurrentUser = {

  id: string;

  firebaseUid:
    string | null;

  email:
    string | null;

} | null;



export async function currentUser():
  Promise<CurrentUser> {

  try {

    const cookieStore =
      await cookies();


    const sessionCookie =
      cookieStore.get(
        "firebase-session"
      )?.value;


    if (!sessionCookie) {

      return null;

    }


    /*
      Verify secure Firebase
      server session.
    */

    const decodedToken =
      await firebaseAdminAuth.verifySessionCookie(
        sessionCookie,
        true
      );


    /*
      Find LET database user.
    */

    let user =
      await prisma.user.findFirst({

        where: {

          firebaseUid:
            decodedToken.uid,

        },

      });


    /*
      Fallback:
      Find existing account
      by Firebase email.
    */

    if (
      !user &&
      decodedToken.email
    ) {

      user =
        await prisma.user.findFirst({

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
      Automatically connect
      Firebase UID.
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

      id:
        user.id,

      firebaseUid:
        user.firebaseUid,

      email:
        user.email,

    };

  }

  catch (error) {

    console.error(
      "Unable to get current user:",
      error
    );


    return null;

  }

}



export async function hasAccess(

  userId: string,

  batchId: string

) {

  const access =
    await prisma.batchAccess.findUnique({

      where: {

        userId_batchId: {

          userId,

          batchId,

        },

      },

    });


  return Boolean(access);

}
