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
  getGoogleDriveFileId,
} from "@/lib/study-materials";


export async function GET(
  req: Request
) {

  const url =
    new URL(req.url);


  const subjectId =
    url.searchParams.get(
      "subjectId"
    );


  if (!subjectId) {

    return NextResponse.json(
      {
        error:
          "subjectId is required",
      },
      {
        status: 400,
      }
    );

  }


  const materials =
    await prisma.studyMaterial.findMany({

      where: {
        subjectId,
      },

      orderBy: {

        createdAt:
          "desc",

      },

    });


  return NextResponse.json(
    materials
  );

}


export async function POST(
  req: Request
) {

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


  try {

    const body =
      await req.json();


    const subjectId =
      String(
        body?.subjectId || ""
      );


    const title =
      String(
        body?.title || ""
      ).trim();


    const googleDriveUrl =
      String(
        body?.googleDriveUrl || ""
      ).trim();


    if (
      !subjectId ||
      !title ||
      !googleDriveUrl
    ) {

      return NextResponse.json(
        {
          error:
            "All fields are required",
        },
        {
          status: 400,
        }
      );

    }


    if (
      !getGoogleDriveFileId(
        googleDriveUrl
      )
    ) {

      return NextResponse.json(
        {
          error:
            "Please enter a valid Google Drive file link",
        },
        {
          status: 400,
        }
      );

    }


    const slug =
      createSlug(title);


    const existing =
      await prisma.studyMaterial.findUnique({

        where: {

          subjectId_slug: {

            subjectId,

            slug,

          },

        },

      });


    if (existing) {

      return NextResponse.json(
        {
          error:
            "A material with this name already exists",
        },
        {
          status: 400,
        }
      );

    }


    const material =
      await prisma.studyMaterial.create({

        data: {

          subjectId,

          title,

          slug,

          googleDriveUrl,

        },

      });


    return NextResponse.json(
      material
    );

  }

  catch {

    return NextResponse.json(
      {
        error:
          "Unable to create study material",
      },
      {
        status: 500,
      }
    );

  }

}
