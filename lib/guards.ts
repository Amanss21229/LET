import { prisma } from "@/lib/prisma";

type CurrentUser = {
  id: string;
  firebaseUid?: string | null;
  email?: string | null;
} | null;

export async function currentUser(): Promise<CurrentUser> {
  return null;
}

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
