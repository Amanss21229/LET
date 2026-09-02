import { prisma } from "@/lib/prisma";


export async function hasAccess(
  userId: string,
  batchId: string
) {

  const access =
    await prisma.batchAccess.findUnique({

      where: {
        userId_batchId: {
          userId,
          batchId,
        },
      },

    });


  return Boolean(access);

}
