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
        error: "Forbidden",
      },
      {
        status: 403,
      }
    );

  }


  const { id } =
    await params;


  const body =
    await req.json();


  const title =
    String(
      body?.title || ""
    ).trim();


  const googleDriveUrl =
    String(
      body?.googleDriveUrl || ""
    ).trim();


  if (
    !title ||
    !googleDriveUrl
  ) {

    return NextResponse.json(
      {
        error:
          "Title and Google Drive link are required",
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


  const material =
    await prisma.studyMaterial.findUnique({

      where: {
        id,
      },

    });


  if (!material) {

    return NextResponse.json(
      {
        error:
          "Study material not found",
      },
      {
        status: 404,
      }
    );

  }


  const slug =
    createSlug(title);


  if (!slug) {

    return NextResponse.json(
      {
        error:
          "Invalid material title",
      },
      {
        status: 400,
      }
    );

  }


  const duplicate =
    await prisma.studyMaterial.findFirst({

      where: {

        subjectId:
          material.subjectId,

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
          "A material with this name already exists",
      },
      {
        status: 400,
      }
    );

  }


  const updated =
    await prisma.studyMaterial.update({

      where: {
        id,
      },

      data: {

        title,

        slug,

        googleDriveUrl,

      },

    });


  return NextResponse.json(
    updated
  );

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
        error: "Forbidden",
      },
      {
        status: 403,
      }
    );

  }


  const { id } =
    await params;


  try {

    await prisma.studyMaterial.delete({

      where: {
        id,
      },

    });


    return NextResponse.json(
      {
        success: true,
      }
    );

  }

  catch {

    return NextResponse.json(
      {
        error:
          "Unable to delete study material",
      },
      {
        status: 500,
      }
    );

  }

}
