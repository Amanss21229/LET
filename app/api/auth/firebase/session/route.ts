import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  firebaseAdminAuth,
} from "@/lib/firebase-admin";


export async function POST(
  request: NextRequest
) {

  try {

    const body =
      await request.json();


    const idToken =
      body?.idToken;


    if (!idToken) {

      return NextResponse.json(
        {
          error:
            "Firebase ID token is required",
        },
        {
          status: 400,
        }
      );

    }


    /*
      Verify Firebase token first.
    */

    await firebaseAdminAuth.verifyIdToken(
      idToken
    );


    /*
      Create secure Firebase
      session cookie.

      5 days session.
    */

    const expiresIn =
      5 * 24 * 60 * 60 * 1000;


    const sessionCookie =
      await firebaseAdminAuth.createSessionCookie(
        idToken,
        {
          expiresIn,
        }
      );


    const response =
      NextResponse.json(
        {
          success: true,
        }
      );


    response.cookies.set(
      "firebase-session",
      sessionCookie,
      {

        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        path: "/",

        maxAge:
          5 * 24 * 60 * 60,

      }
    );


    return response;

  }

  catch (error) {

    console.error(
      "Firebase session creation failed:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to create session",
      },
      {
        status: 401,
      }
    );

  }

}



export async function DELETE() {

  const response =
    NextResponse.json({
      success: true,
    });


  response.cookies.set(
    "firebase-session",
    "",
    {

      httpOnly: true,

      secure:
        process.env.NODE_ENV ===
        "production",

      sameSite: "lax",

      path: "/",

      maxAge: 0,

    }
  );


  return response;

      }
