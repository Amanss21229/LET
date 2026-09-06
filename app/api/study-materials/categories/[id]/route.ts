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
          "Category name is required",
      },
      {
        status: 400,
      }
    );

  }


  const slug =
    createSlug(name);


  try {

    const category =
      await prisma.studyCategory.update({

        where: {
          id,
        },

        data: {

          name,

          slug,

        },

      });


    return NextResponse.json(
      category
    );

  }

  catch {

    return NextResponse.json(
      {
        error:
          "Unable to update category",
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

    await prisma.studyCategory.delete({

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
          "Unable to delete category",
      },
      {
        status: 500,
      }
    );

  }

}
