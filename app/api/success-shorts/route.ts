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

              comments: true,

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

          const comments =
            short._count.comments;


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

            comments,

            reachScore,

          };

        }

      );

    
    const latestThreshold =
  Date.now() -
  7 * 24 * 60 * 60 * 1000;


formattedShorts.sort(

  (
    a,
    b
  ) => {

    const aCreatedAt =
      new Date(
        a.createdAt
      ).getTime();


    const bCreatedAt =
      new Date(
        b.createdAt
      ).getTime();


    const aIsLatest =
      aCreatedAt >=
      latestThreshold;


    const bIsLatest =
      bCreatedAt >=
      latestThreshold;


    /*
      Latest shorts stay
      at the top.
    */

    if (
      aIsLatest &&
      !bIsLatest
    ) {

      return -1;

    }


    if (
      !aIsLatest &&
      bIsLatest
    ) {

      return 1;

    }


    /*
      Among latest shorts,
      newest comes first.
    */

    if (
      aIsLatest &&
      bIsLatest
    ) {

      return (
        bCreatedAt -
        aCreatedAt
      );

    }


    /*
      Older shorts are ranked
      by overall reach.
    */

    return (

      b.reachScore -

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
