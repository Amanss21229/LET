import {
  NextResponse,
} from "next/server";

import {
  prisma,
} from "@/lib/prisma";

import {
  getSuccessShortReachScore,
} from "@/lib/success-shorts";


export const dynamic =
  "force-dynamic";


export async function GET() {

  try {

    const shorts =
      await prisma.successShort.findMany({

        include: {

          _count: {

            select: {

              likes: true,

              views: true,

              shares: true,

            },

          },

        },

      });


    const formattedShorts =
      shorts.map(

        (
          short
        ) => {

          const likes =
            short._count.likes;


          const views =
            short._count.views;


          const shares =
            short._count.shares;


          const reachScore =
            getSuccessShortReachScore(

              views,

              likes,

              shares

            );


          return {

            id:
              short.id,

            title:
              short.title,

            slug:
              short.slug,

            youtubeUrl:
              short.youtubeUrl,

            youtubeVideoId:
              short.youtubeVideoId,

            seoKeywords:
              short.seoKeywords,

            seoDescription:
              short.seoDescription,

            createdAt:
              short.createdAt,

            likes,

            views,

            shares,

            reachScore,

          };

        }

      );


    formattedShorts.sort(

      (
        a,
        b
      ) => {

        const timeDifference =
          new Date(
            b.createdAt
          ).getTime()

          -

          new Date(
            a.createdAt
          ).getTime();


        /*
          Latest shorts remain
          the primary priority.
        */

        if (timeDifference !== 0) {

          return timeDifference;

        }


        return (

          b.reachScore

          -

          a.reachScore

        );

      }

    );


    return NextResponse.json(
      formattedShorts
    );

  }

  catch (
    error
  ) {

    console.error(

      "Success Shorts GET error:",

      error

    );


    return NextResponse.json(

      {

        error:
          "Unable to load Success Shorts",

      },

      {

        status:
          500,

      }

    );

  }

}
