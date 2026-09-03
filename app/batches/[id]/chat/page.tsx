import {
  notFound,
  redirect,
} from "next/navigation";

import {
  prisma,
} from "@/lib/prisma";

import {
  currentUser,
  hasAccess,
} from "@/lib/guards";

import BatchDoubtChat from
  "@/components/BatchDoubtChat";


export const dynamic =
  "force-dynamic";


export default async function ChatPage({

  params,

}: {

  params:
    Promise<{
      id: string;
    }>;

}) {


  const { id } =
    await params;


  const batch =
    await prisma.batch.findUnique({

      where: {

        id,

      },

    });


  if (!batch) {

    return notFound();

  }


  const user =
    await currentUser();


  if (!user) {

    redirect(
      `/batches/${id}`
    );

  }


  const access =
    await hasAccess(

      user.id,

      id

    );


  if (!access) {

    redirect(
      `/batches/${id}`
    );

  }


  return (

    <BatchDoubtChat

      batchId={
        batch.id
      }

      batchTitle={
        batch.title
      }

    />

  );

}
