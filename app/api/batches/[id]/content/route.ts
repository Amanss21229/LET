import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import {
  verifyAdminSession,
} from "@/lib/admin-auth";


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
      await verifyAdminSession();

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
   EDIT SECTION
===================== */

if (body.action === "editSection") {

  if (!body.sectionId || !body.title?.trim()) {
    return NextResponse.json(
      {
        error:
          "Section ID and title are required",
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

  if (!section || section.batchId !== id) {
    return NextResponse.json(
      {
        error: "Section not found",
      },
      {
        status: 404,
      }
    );
  }

  const updatedSection =
    await prisma.batchSection.update({
      where: {
        id: body.sectionId,
      },

      data: {
        title: body.title.trim(),
      },
    });

  return NextResponse.json(
    updatedSection
  );
}

    /* =====================
   DELETE SECTION
===================== */

if (body.action === "deleteSection") {

  if (!body.sectionId) {
    return NextResponse.json(
      {
        error:
          "Section ID is required",
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

  if (!section || section.batchId !== id) {
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

  await prisma.batchSection.delete({
    where: {
      id: body.sectionId,
    },
  });

  return NextResponse.json({
    success: true,
  });
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
   EDIT CONTENT ITEM
===================== */

if (body.action === "editItem") {

  if (
    !body.itemId ||
    !body.title?.trim()
  ) {
    return NextResponse.json(
      {
        error:
          "Item ID and title are required",
      },
      {
        status: 400,
      }
    );
  }

  const item =
    await prisma.contentItem.findUnique({
      where: {
        id: body.itemId,
      },

      include: {
        section: true,
      },
    });

  if (
    !item ||
    item.section.batchId !== id
  ) {
    return NextResponse.json(
      {
        error:
          "Content item not found",
      },
      {
        status: 404,
      }
    );
  }

  const updatedItem =
    await prisma.contentItem.update({
      where: {
        id: body.itemId,
      },

      data: {
        title: body.title.trim(),

        url:
          body.url !== undefined
            ? body.url
            : item.url,

        fileType:
          body.fileType !== undefined
            ? body.fileType || null
            : item.fileType,

        scheduledAt:
          body.scheduledAt !== undefined
            ? body.scheduledAt
              ? new Date(
                  body.scheduledAt
                )
              : null
            : item.scheduledAt,
      },
    });

  return NextResponse.json(
    updatedItem
  );
}

    /* =====================
   DELETE CONTENT ITEM
===================== */

if (body.action === "deleteItem") {

  if (!body.itemId) {
    return NextResponse.json(
      {
        error:
          "Item ID is required",
      },
      {
        status: 400,
      }
    );
  }

  const item =
    await prisma.contentItem.findUnique({
      where: {
        id: body.itemId,
      },

      include: {
        section: true,
      },
    });

  if (
    !item ||
    item.section.batchId !== id
  ) {
    return NextResponse.json(
      {
        error:
          "Content item not found",
      },
      {
        status: 404,
      }
    );
  }

  await prisma.contentItem.delete({
    where: {
      id: body.itemId,
    },
  });

  return NextResponse.json({
    success: true,
  });
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

        /* =====================
   EDIT NOTIFICATION
===================== */

if (body.action === "editNotification") {

  if (!body.notificationId) {
    return NextResponse.json(
      {
        error: "Notification ID is required",
      },
      {
        status: 400,
      }
    );
  }

  const notification =
    await prisma.notification.findUnique({
      where: {
        id: body.notificationId,
      },
    });

  if (
    !notification ||
    notification.batchId !== id
  ) {
    return NextResponse.json(
      {
        error: "Notification not found",
      },
      {
        status: 404,
      }
    );
  }

  const updatedNotification =
    await prisma.notification.update({
      where: {
        id: body.notificationId,
      },

      data: {
        text:
          body.text !== undefined
            ? body.text || null
            : notification.text,

        attachmentUrl:
          body.attachmentUrl !== undefined
            ? body.attachmentUrl || null
            : notification.attachmentUrl,

        attachmentType:
          body.attachmentType !== undefined
            ? body.attachmentType || null
            : notification.attachmentType,
      },
    });

  return NextResponse.json(
    updatedNotification
  );
}


/* =====================
   DELETE NOTIFICATION
===================== */

if (body.action === "deleteNotification") {

  if (!body.notificationId) {
    return NextResponse.json(
      {
        error: "Notification ID is required",
      },
      {
        status: 400,
      }
    );
  }

  const notification =
    await prisma.notification.findUnique({
      where: {
        id: body.notificationId,
      },
    });

  if (
    !notification ||
    notification.batchId !== id
  ) {
    return NextResponse.json(
      {
        error: "Notification not found",
      },
      {
        status: 404,
      }
    );
  }

  await prisma.notification.delete({
    where: {
      id: body.notificationId,
    },
  });

  return NextResponse.json({
    success: true,
  });
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
