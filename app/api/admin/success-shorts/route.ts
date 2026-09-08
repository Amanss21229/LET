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

          seoKeywords:
            short.seoKeywords,

          viewCount:
            short.viewCount,

          likeCount:
            short._count.likes,

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


    const seoKeywords =
      String(
        body?.seoKeywords || ""
      ).trim();


    if (
      !title ||
      !youtubeUrl
    ) {

    const isYouTubeUrl =
  youtubeUrl.includes(
    "youtube.com"
  ) ||
  youtubeUrl.includes(
    "youtu.be"
  );


if (!isYouTubeUrl) {

  return NextResponse.json(
    {
      error:
        "Please enter a valid YouTube URL",
    },
    {
      status: 400,
    }
  );

}

      return NextResponse.json(
        {
          error:
            "Title and YouTube URL are required",
        },
        {
          status: 400,
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

          seoKeywords:

            seoKeywords || null,

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
