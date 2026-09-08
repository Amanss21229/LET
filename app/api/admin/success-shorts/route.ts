import {
  NextResponse,
} from "next/server";

import {
  prisma,
} from "@/lib/prisma";

import {
  verifyAdminSession,
} from "@/lib/admin-auth";

import {
  createSlug,
} from "@/lib/study-materials";

import {
  getYouTubeVideoId,
} from "@/lib/success-shorts";


export async function GET() {

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


  try {

    const shorts =
      await prisma.successShort.findMany({

        orderBy: {

          createdAt:
            "desc",

        },

        include: {

          _count: {

            select: {

              likes:
                true,
              
              views:
                true,

              shares:
                true,

            },

          },

        },

      });


    const formattedShorts =
      shorts.map(

        (
          short
        ) => ({

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

          viewCount:
            short._count.views,

          likeCount:
            short._count.likes,

          shareCount:
            short._count.shares,

          createdAt:
            short.createdAt,

          updatedAt:
            short.updatedAt,

        })

      );


    return NextResponse.json(
      formattedShorts
    );

  }

  catch {

    return NextResponse.json(
      {
        error:
          "Unable to load Success Shorts",
      },
      {
        status: 500,
      }
    );

  }

}


export async function POST(
  req: Request
) {

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


  try {

    const body =
      await req.json();


    const title =
      String(
        body?.title || ""
      ).trim();


    const youtubeUrl =
      String(
        body?.youtubeUrl || ""
      ).trim();

        const youtubeVideoId =
          getYouTubeVideoId(
            youtubeUrl
          );

    const seoKeywords =
      String(
        body?.seoKeywords || ""
      ).trim();

    const seoDescription =
      String(
        body?.seoDescription || ""
      ).trim();

    if (
  !title ||
  !youtubeUrl
) {

  return NextResponse.json(

    {
      error:
        "Title and YouTube URL are required",
    },

    {
      status:
        400,
    }

  );

}


if (!youtubeVideoId) {

  return NextResponse.json(

    {
      error:
        "Please enter a valid YouTube URL",
    },

    {
      status:
        400,
    }

  );

}


    const slug =
      createSlug(
        title
      );


    const existing =
      await prisma.successShort.findUnique({

        where: {

          slug,

        },

      });


    if (existing) {

      return NextResponse.json(
        {
          error:
            "A Success Short with this title already exists",
        },
        {
          status: 400,
        }
      );

    }


    const short =
      await prisma.successShort.create({

        data: {

          title,

          slug,

          youtubeUrl,

          youtubeVideoId,

          seoKeywords,

          seoDescription:
            seoDescription || null,

        },

      });


    return NextResponse.json(

      short,

      {
        status: 201,
      }

    );

  }

  catch {

    return NextResponse.json(
      {
        error:
          "Unable to create Success Short",
      },
      {
        status: 500,
      }
    );

  }

}
