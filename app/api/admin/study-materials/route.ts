import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { verifyAdminSession } from "@/lib/admin-auth";


/* =====================================
   GET
   LOAD ALL STUDY MATERIALS DATA
===================================== */

export async function GET() {

  try {

    const isAdmin =
      await verifyAdminSession();


    if (!isAdmin) {

      return NextResponse.json(

        {
          error: "Forbidden",
        },

        {
          status: 403,
        }

      );

    }


    const categories =
      await prisma.studyCategory.findMany({

        orderBy: {

          sortOrder: "asc",

        },


        include: {

          subjects: {

            orderBy: {

              sortOrder: "asc",

            },


            include: {

              materials: {

                orderBy: {

                  createdAt: "desc",

                },

              },

            },

          },

        },

      });


    return NextResponse.json({

      categories,

    });

  }

  catch (error) {

    console.error(

      "Study materials load error:",

      error

    );


    return NextResponse.json(

      {

        error:
          "Unable to load study materials",

      },

      {

        status:
          500,

      }

    );

  }

}
