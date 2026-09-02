"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  loginWithGoogle,
} from "@/lib/firebase-auth";


export default function BatchLoginButton() {

  const router =
    useRouter();


  const [
    loading,
    setLoading,
  ] =
    useState(false);


  const handleLogin =
    async () => {

      try {

        setLoading(true);


        const result =
          await loginWithGoogle();


        /*
          If popup login completed,
          refresh the current page.

          The current batch page will
          then be rendered again with
          the Firebase server session.
        */

        if (result) {

          router.refresh();

        }

      }

      catch (error) {

        console.error(
          "Batch login failed:",
          error
        );


        alert(
          "Google login failed. Please try again."
        );

      }

      finally {

        setLoading(false);

      }

    };


  return (

    <button

      className="btn primary"

      onClick={
        handleLogin
      }

      disabled={
        loading
      }

    >

      {loading
        ? "Opening Google..."
        : "Continue with Google"}

    </button>

  );

                   }
