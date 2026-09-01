import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { cookies } from "next/headers";

const isAdmin = async () => {
  const cookieStore =
    await cookies();

  return (
    cookieStore
      .get("let_admin")
      ?.value === "true"
  );
};

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const admin =
      await isAdmin();

    if (!admin) {
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

    const batch =
      await prisma.batch.findUnique({
        where: {
          id,
        },
      });

    if (!batch) {
      return NextResponse.json(
        {
          error: "Batch not found",
        },
        {
          status: 404,
        }
      );
    }

    /* =====================
       CREATE SECTION
    ===================== */

    if (
      body.action ===
      "section"
    ) {
      if (
        !body.title ||
        !body.kind
      ) {
        return NextResponse.json(
          {
            error:
              "Title and kind are required",
          },
          {
            status: 400,
          }
        );
      }

      if (
        ![
          "CLASS",
          "NOTES",
          "PRACTICE",
        ].includes(body.kind)
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid section type",
          },
          {
            status: 400,
          }
        );
      }

      const section =
        await prisma.batchSection.create({
          data: {
            batchId: id,

            kind: body.kind,

            title: body.title,

            sortOrder:
              body.sortOrder || 0,
          },
        });

      return NextResponse.json(
        section
      );
    }

    /* =====================
       CREATE CONTENT ITEM
    ===================== */

    if (
      body.action ===
      "item"
    ) {
      if (
        !body.sectionId ||
        !body.title ||
        !body.url
      ) {
        return NextResponse.json(
          {
            error:
              "Section, title and URL are required",
          },
          {
            status: 400,
          }
        );
      }

      const section =
        await prisma.batchSection.findUnique({
          where: {
            id: body.sectionId,
          },
        });

      if (!section) {
        return NextResponse.json(
          {
            error:
              "Section not found",
          },
          {
            status: 404,
          }
        );
      }

      if (
        section.batchId !== id
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid section",
          },
          {
            status: 400,
          }
        );
      }

      const item =
        await prisma.contentItem.create({
          data: {
            sectionId:
              body.sectionId,

            title:
              body.title,

            url:
              body.url,

            fileType:
              body.fileType ||
              null,

            scheduledAt:
              body.scheduledAt
                ? new Date(
                    body.scheduledAt
                  )
                : null,
          },
        });

      return NextResponse.json(
        item
      );
    }

    /* =====================
       CREATE NOTIFICATION
    ===================== */

    if (
      body.action ===
      "notification"
    ) {
      if (
        !body.text &&
        !body.attachmentUrl
      ) {
        return NextResponse.json(
          {
            error:
              "Text or attachment is required",
          },
          {
            status: 400,
          }
        );
      }

      const notification =
        await prisma.notification.create({
          data: {
            batchId: id,

            text:
              body.text || null,

            attachmentUrl:
              body.attachmentUrl ||
              null,

            attachmentType:
              body.attachmentType ||
              null,
          },
        });

      return NextResponse.json(
        notification
      );
    }

    return NextResponse.json(
      {
        error:
          "Invalid action",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.error(
      "Batch content error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
