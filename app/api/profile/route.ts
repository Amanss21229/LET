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


    const user =
      firebaseUser.user;


    return NextResponse.json({

      id:
        user.id,

      name:
        user.name || "",

      email:
        user.email || "",

      image:
        user.image || "",

      phone:
        user.phone || "",

      className:
        user.className || "",

      city:
        user.city || "",

      state:
        user.state || "",

      stream:
        user.stream || "",

      profileComplete:
        user.profileComplete,

    });

  }

  catch (error) {

    console.error(
      "Profile GET error:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to load profile",
      },
      {
        status: 500,
      }
    );

  }

}


export async function PATCH(
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


    const name =
      String(
        body.name || ""
      ).trim();


    const phone =
      String(
        body.phone || ""
      ).trim();


    const className =
      String(
        body.className || ""
      ).trim();

    const city =
  String(
    body.city || ""
  ).trim();


const state =
  String(
    body.state || ""
  ).trim();


const stream =
  String(
    body.stream || ""
  ).trim();


    if (
      !name ||
      !phone ||
      !className
    ) {

      return NextResponse.json(
        {
          error:
            "Name, class and mobile number are required.",
        },
        {
          status: 400,
        }
      );

    }


    const updatedUser =
      await prisma.user.update({

        where: {
          id:
            firebaseUser.user.id,
        },

        data: {

          name,

          phone,

          className,

          city:
            city || null,

          state:
        state || null,

          stream:
            stream || null,

          profileComplete:
            true,

        },

      });


    return NextResponse.json({

      id:
        updatedUser.id,

      name:
        updatedUser.name || "",

      email:
        updatedUser.email || "",

      image:
        updatedUser.image || "",

      phone:
        updatedUser.phone || "",

      className:
        updatedUser.className || "",

      city:
        updatedUser.city || "",

      state:
        updatedUser.state || "",

      stream:
        updatedUser.stream || "",

      profileComplete:
        updatedUser.profileComplete,

    });

  }

  catch (error) {

    console.error(
      "Profile PATCH error:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to update profile",
      },
      {
        status: 500,
      }
    );

  }

}
