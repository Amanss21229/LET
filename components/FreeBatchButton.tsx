"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";


export default function FreeBatchButton({
  batchId,
}: {
  batchId: string;
}) {

  const router =
    useRouter();

  const [
    loading,
    setLoading,
  ] = useState(false);


  async function getFreeAccess() {

    if (loading) {
      return;
    }


    setLoading(true);


    try {

      const response =
        await fetch(
          `/api/batches/${batchId}/free-access`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        if (
          response.status === 401
        ) {

          router.push(
            `/login?callbackUrl=/batches/${batchId}`
          );

          return;

        }


        throw new Error(
          data?.error ||
          "Unable to get free access."
        );

      }


      /*
        Access has been created.
        Refresh the server-rendered
        batch page so `hasAccess()`
        becomes true and Buy Now
        disappears.
      */
      router.refresh();

    }
    catch (error) {

      console.error(
        "Free batch enrollment failed:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to get free access."
      );

    }
    finally {

      setLoading(false);

    }

  }


  return (
    <button
      type="button"
      className="btn primary"
      onClick={getFreeAccess}
      disabled={loading}
    >

      {loading
        ? "Getting Access..."
        : "Get Free Access"}

    </button>
  );

}
