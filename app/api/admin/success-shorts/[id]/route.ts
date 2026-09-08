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


    const existingShort =
      await prisma.successShort.findUnique({

        where: {

          id,

        },

      });


    if (!existingShort) {

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


    const slug =
      createSlug(
        title
      );


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


    const updatedShort =
      await prisma.successShort.update({

        where: {

          id,

        },

        data: {

          title,

          slug,

          youtubeUrl,

          seoKeywords:
            seoKeywords || null,

        },

      });


    return NextResponse.json(
      updatedShort
    );

  }

  catch {

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


    const existingShort =
      await prisma.successShort.findUnique({

        where: {

          id,

        },

      });


    if (!existingShort) {

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

        message:
          "Success Short deleted successfully",
      }
    );

  }

  catch {

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
