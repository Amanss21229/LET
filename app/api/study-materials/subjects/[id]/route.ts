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


  const name =
    String(
      body?.name || ""
    ).trim();


  if (!name) {

    return NextResponse.json(
      {
        error:
          "Subject name is required",
      },
      {
        status: 400,
      }
    );

  }


  const subject =
    await prisma.studySubject.findUnique({

      where: {
        id,
      },

    });


  if (!subject) {

    return NextResponse.json(
      {
        error:
          "Subject not found",
      },
      {
        status: 404,
      }
    );

  }


  const slug =
    createSlug(name);


  if (!slug) {

    return NextResponse.json(
      {
        error:
          "Invalid subject name",
      },
      {
        status: 400,
      }
    );

  }


  const duplicate =
    await prisma.studySubject.findFirst({

      where: {

        categoryId:
          subject.categoryId,

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
          "This subject already exists",
      },
      {
        status: 400,
      }
    );

  }


  const updated =
    await prisma.studySubject.update({

      where: {
        id,
      },

      data: {
        name,
        slug,
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

    await prisma.studySubject.delete({

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
          "Unable to delete subject",
      },
      {
        status: 500,
      }
    );

  }

}
