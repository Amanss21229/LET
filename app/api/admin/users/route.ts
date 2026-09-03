import {
  NextResponse,
} from "next/server";

import {
  prisma,
} from "@/lib/prisma";

import {
  verifyAdminSession,
} from "@/lib/admin-auth";


export async function GET() {

  try {

    const isAdmin =
      await verifyAdminSession();


    if (!isAdmin) {

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


    const users =
      await prisma.user.findMany({

        orderBy: {

          createdAt:
            "desc",

        },


        select: {

          id: true,

          name: true,

          email: true,

          phone: true,

          className: true,

          createdAt: true,

          profileComplete: true,


          accesses: {

            select: {

              batch: {

                select: {

                  id: true,

                  title: true,

                },

              },

            },

          },

        },

      });


    const formattedUsers =
      users.map(

        (user) => ({

          id:
            user.id,


          name:
            user.name ||
            "Not completed",


          email:
            user.email ||
            "-",


          phone:
            user.phone ||
            "-",


          className:
            user.className ||
            "-",


          profileComplete:
            user.profileComplete,


          createdAt:
            user.createdAt,


          batches:

            user.accesses.map(

              (access) =>

                access.batch.title

            ),

        })

      );


    return NextResponse.json({

      users:
        formattedUsers,

    });

  }

  catch (error) {

    console.error(

      "Admin users error:",

      error

    );


    return NextResponse.json(

      {

        error:
          "Unable to load users",

      },

      {

        status:
          500,

      }

    );

  }

}
