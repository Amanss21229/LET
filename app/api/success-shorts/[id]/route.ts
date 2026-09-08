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


export async function GET(

  _req: Request,

  {
    params,
  }: {

    params: Promise<{
      id: string;
    }>;

  }

) {

  try {

    const {
      id,
    } =
      await params;


    const short =
      await prisma.successShort.findUnique({

        where: {

          id,

        },

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


    if (!short) {

      return NextResponse.json(
        {
          error:
            "Success Short not found",
        },
        {
          status: 404,
        }
      );

    }


    return NextResponse.json(
      short
    );

  }

  catch (error) {

    console.error(
      "Success Short GET error:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to load Success Short",
      },
      {
        status: 500,
      }
    );

  }

}


export async function PUT(

  req: Request,

  {
    params,
  }: {

    params: Promise<{
      id: string;
    }>;

  }

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

    const {
      id,
    } =
      await params;


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


    const short =
      await prisma.successShort.findUnique({

        where: {

          id,

        },

      });


    if (!short) {

      return NextResponse.json(
        {
          error:
            "Success Short not found",
        },
        {
          status: 404,
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


    const duplicate =
      await prisma.successShort.findFirst({

        where: {

          slug,

          NOT: {

            id,

          },

        },

      });


    if (duplicate) {

      return NextResponse.json(
        {
          error:
            "Another Success Short already uses this title",
        },
        {
          status: 400,
        }
      );

    }


    const updated =
      await prisma.successShort.update({

        where: {

          id,

        },

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
      updated
    );

  }

  catch (error) {

    console.error(
      "Success Short PUT error:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to update Success Short",
      },
      {
        status: 500,
      }
    );

  }

}


export async function DELETE(

  _req: Request,

  {
    params,
  }: {

    params: Promise<{
      id: string;
    }>;

  }

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

    const {
      id,
    } =
      await params;


    const short =
      await prisma.successShort.findUnique({

        where: {

          id,

        },

      });


    if (!short) {

      return NextResponse.json(
        {
          error:
            "Success Short not found",
        },
        {
          status: 404,
        }
      );

    }


    await prisma.successShort.delete({

      where: {

        id,

      },

    });


    return NextResponse.json(
      {
        success:
          true,
      }
    );

  }

  catch (error) {

    console.error(
      "Success Short DELETE error:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to delete Success Short",
      },
      {
        status: 500,
      }
    );

  }

}
