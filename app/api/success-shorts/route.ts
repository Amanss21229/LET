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
  createSuccessShortSlug,
  getYouTubeVideoId,
} from "@/lib/success-shorts";


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

        orderBy: {

          createdAt:
            "desc",

        },

      });


    return NextResponse.json(
      shorts
    );

  }

  catch (error) {

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


    const seoDescription =
      String(
        body?.seoDescription || ""
      ).trim();


    if (
      !title ||
      !youtubeUrl ||
      !seoKeywords
    ) {

      return NextResponse.json(
        {
          error:
            "Title, YouTube URL and SEO keywords are required",
        },
        {
          status: 400,
        }
      );

    }


    const youtubeVideoId =
      getYouTubeVideoId(
        youtubeUrl
      );


    if (!youtubeVideoId) {

      return NextResponse.json(
        {
          error:
            "Please enter a valid YouTube or YouTube Shorts URL",
        },
        {
          status: 400,
        }
      );

    }


    const slug =
      createSuccessShortSlug(
        title
      );


    if (!slug) {

      return NextResponse.json(
        {
          error:
            "Invalid short title",
        },
        {
          status: 400,
        }
      );

    }


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

  catch (error) {

    console.error(
      "Success Shorts POST error:",
      error
    );


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
