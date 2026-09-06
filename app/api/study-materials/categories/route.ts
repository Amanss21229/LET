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

  const categories =
    await prisma.studyCategory.findMany({

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
    categories
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


    if (!slug) {

      return NextResponse.json(
        {
          error:
            "Invalid category name",
        },
        {
          status: 400,
        }
      );

    }


    const existing =
      await prisma.studyCategory.findUnique({

        where: {
          slug,
        },

      });


    if (existing) {

      return NextResponse.json(
        {
          error:
            "This category already exists",
        },
        {
          status: 400,
        }
      );

    }


    const category =
      await prisma.studyCategory.create({

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
          "Unable to create category",
      },
      {
        status: 500,
      }
    );

  }

}
