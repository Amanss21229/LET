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


export async function GET(
  req: Request
) {

  const url =
    new URL(req.url);


  const categoryId =
    url.searchParams.get(
      "categoryId"
    );


  if (!categoryId) {

    return NextResponse.json(
      {
        error:
          "categoryId is required",
      },
      {
        status: 400,
      }
    );

  }


  const subjects =
    await prisma.studySubject.findMany({

      where: {
        categoryId,
      },

      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          createdAt: "desc",
        },
      ],

    });


  return NextResponse.json(
    subjects
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


    const categoryId =
      String(
        body?.categoryId || ""
      );


    const name =
      String(
        body?.name || ""
      ).trim();


    if (
      !categoryId ||
      !name
    ) {

      return NextResponse.json(
        {
          error:
            "Category and subject name are required",
        },
        {
          status: 400,
        }
      );

    }


    const slug =
      createSlug(name);


    const existing =
      await prisma.studySubject.findUnique({

        where: {

          categoryId_slug: {

            categoryId,

            slug,

          },

        },

      });


    if (existing) {

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


    const subject =
      await prisma.studySubject.create({

        data: {

          categoryId,

          name,

          slug,

        },

      });


    return NextResponse.json(
      subject
    );

  }

  catch {

    return NextResponse.json(
      {
        error:
          "Unable to create subject",
      },
      {
        status: 500,
      }
    );

  }

}
