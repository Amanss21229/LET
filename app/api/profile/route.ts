import {
  NextResponse,
} from "next/server";

import {
  requireUser,
} from "@/lib/guards";

import {
  prisma,
} from "@/lib/prisma";


export async function GET() {
  try {

    const user =
      await requireUser();

    return NextResponse.json({
      id: user.id,

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

      profileComplete:
        user.profileComplete,
    });

  } catch {

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


export async function PATCH(
  req: Request
) {

  try {

    const user =
      await requireUser();

    const body =
      await req.json();


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


    if (
      !name ||
      !phone ||
      !className
    ) {

      return NextResponse.json(
        {
          error:
            "All profile fields are required",
        },
        {
          status: 400,
        }
      );

    }


    const updatedUser =
      await prisma.user.update({

        where: {
          id: user.id,
        },

        data: {

          name,

          phone,

          className,

          profileComplete: true,

        },

      });


    return NextResponse.json(
      updatedUser
    );


  } catch {

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
