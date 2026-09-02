import Nav from "@/components/Nav";
import { currentUser } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MyBatchesPage() {
  const user = await currentUser();

  if (!user) {
    return (
      <>
        <Nav />

        <main className="wrap">
          <h1>My Batches</h1>

          <p>
            Please{" "}
            <a
              className="yellow"
              href="/api/auth/signin/google?callbackUrl=/my-batches"
            >
              login with Google
            </a>{" "}
            to view your batches.
          </p>
        </main>
      </>
    );
  }

  const rows = await prisma.batchAccess.findMany({
    where: {
      userId: user.id,
    },

    include: {
      batch: true,
    },
  });

  return (
    <>
      <Nav />

      <main className="wrap">
        <h1>My Batches</h1>

        <div className="grid">
          {rows.map((row) => (
            <Link
              className="card"
              href={`/batches/${row.batchId}`}
              key={row.id}
            >
              {row.batch.imageUrl && (
                <img
                  src={row.batch.imageUrl}
                  alt={row.batch.title}
                  className="batch-image"
                />
              )}

              <h3>{row.batch.title}</h3>

              <p className="yellow">
                ✓ Full Access
              </p>
            </Link>
          ))}
        </div>

        {!rows.length && (
          <p className="muted">
            You don't have access to any batch yet.
          </p>
        )}
      </main>
    </>
  );
}
