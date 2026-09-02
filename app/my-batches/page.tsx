"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import NavClient from "@/components/NavClient";

import {
  useFirebaseAuth,
} from "@/hooks/useFirebaseAuth";

import {
  firebaseFetch,
} from "@/lib/firebase-api";

import {
  loginWithGoogle,
} from "@/lib/firebase-auth";


type Batch = {

  id: string;

  title: string;

  imageUrl: string | null;

};


type AccessRow = {

  id: string;

  batchId: string;

  batch: Batch;

};


export default function MyBatchesPage() {


  const {

    firebaseUser,

    loading:
      authLoading,

  } =
    useFirebaseAuth();


  const [

    rows,

    setRows,

  ] =
    useState<AccessRow[]>([]);


  const [

    loading,

    setLoading,

  ] =
    useState(true);


  const [

    error,

    setError,

  ] =
    useState("");


  const [

    loginLoading,

    setLoginLoading,

  ] =
    useState(false);


  useEffect(() => {


    async function loadBatches() {


      if (authLoading) {

        return;

      }


      if (!firebaseUser) {

        setRows([]);

        setLoading(false);

        return;

      }


      try {

        setLoading(true);

        setError("");


        const response =
          await firebaseFetch(
            "/api/batches/my"
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(

            data.error ||

            "Unable to load batches"

          );

        }


        setRows(
          data.batches || []
        );

      }

      catch (error: any) {

        console.error(
          error
        );


        setError(

          error?.message ||

          "Unable to load batches"

        );

      }

      finally {

        setLoading(false);

      }

    }


    loadBatches();


  }, [
    firebaseUser,
    authLoading,
  ]);


  async function handleLogin() {

    try {

      setLoginLoading(true);

      await loginWithGoogle();

    }

    catch {

      setError(
        "Google login failed."
      );

    }

    finally {

      setLoginLoading(false);

    }

  }


  if (
    authLoading ||
    loading
  ) {

    return (

      <>

        <NavClient />

        <main
          className="wrap"
        >

          <h1>
            My Batches
          </h1>

          <p>
            Loading...
          </p>

        </main>

      </>

    );

  }


  if (!firebaseUser) {

    return (

      <>

        <NavClient />


        <main
          className="wrap"
        >

          <h1>
            My Batches
          </h1>


          <p>

            Please login with
            Google to view your
            batches.

          </p>


          <br />


          <button

            className="btn primary"

            onClick={
              handleLogin
            }

            disabled={
              loginLoading
            }

          >

            {loginLoading

              ? "Opening Google..."

              : "Continue with Google"

            }

          </button>


        </main>

      </>

    );

  }


  return (

    <>

      <NavClient />


      <main
        className="wrap"
      >

        <h1>
          My Batches
        </h1>


        {error && (

          <p
            className="muted"
          >
            {error}
          </p>

        )}


        <div
          className="grid"
        >

          {rows.map((row) => (

            <Link

              className="card"

              href={
                `/batches/${row.batchId}`
              }

              key={
                row.id
              }

            >

              {row.batch.imageUrl && (

                <img

                  src={
                    row.batch.imageUrl
                  }

                  alt={
                    row.batch.title
                  }

                  className="batch-image"

                />

              )}


              <h3>
                {row.batch.title}
              </h3>


              <p
                className="yellow"
              >

                ✓ Full Access

              </p>

            </Link>

          ))}

        </div>


        {!rows.length &&
          !error && (

          <p
            className="muted"
          >

            You don't have access
            to any batch yet.

          </p>

        )}

      </main>

    </>

  );

}
