"use client";

import {

  useEffect,

  useState,

} from "react";


import {

  useFirebaseAuth,

} from "@/hooks/useFirebaseAuth";


import {

  firebaseFetch,

} from "@/lib/firebase-api";


export default function
ProfileCompletionPopup() {


  const {

    firebaseUser,

    databaseUser,

    loading,

    refreshUser,

  } =
    useFirebaseAuth();


  const [

    open,

    setOpen,

  ] =
    useState(false);


  const [

    name,

    setName,

  ] =
    useState("");


  const [

    className,

    setClassName,

  ] =
    useState("");


  const [

    phone,

    setPhone,

  ] =
    useState("");


  const [

    saving,

    setSaving,

  ] =
    useState(false);


  const [

    error,

    setError,

  ] =
    useState("");


  /*
    Wait 10 seconds after
    logged-in user is available.
  */

  useEffect(() => {

    if (

      loading ||

      !firebaseUser ||

      !databaseUser

    ) {

      return;

    }


    /*
      Already completed.

      No popup required.
    */

    if (

      databaseUser.profileComplete

    ) {

      setOpen(false);

      return;

    }


    /*
      Pre-fill available
      information.
    */

    setName(

      databaseUser.name ||

      firebaseUser.displayName ||

      ""

    );


    setClassName(

      databaseUser.className ||

      ""

    );


    setPhone(

      databaseUser.phone ||

      ""

    );


    /*
      Show popup after
      exactly 10 seconds.
    */

    const timer =
      window.setTimeout(

        () => {

          setOpen(true);

        },

        10000

      );


    return () => {

      window.clearTimeout(
        timer
      );

    };

  }, [

    firebaseUser,

    databaseUser,

    loading,

  ]);


  async function
  saveProfile() {


    if (

      !name.trim() ||

      !className.trim() ||

      !phone.trim()

    ) {

      setError(

        "Please fill Name, Class and Mobile Number."

      );

      return;

    }


    try {

      setSaving(true);

      setError("");


      const response =
        await firebaseFetch(

          "/api/profile",

          {

            method:
              "PATCH",


            headers: {

              "Content-Type":

                "application/json",

            },


            body:

              JSON.stringify({

                name:
                  name.trim(),

                className:
                  className.trim(),

                phone:
                  phone.trim(),

              }),

          }

        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(

          data.error ||

          "Unable to save profile."

        );

      }


      /*
        Refresh global user state.
      */

      await refreshUser();


      setOpen(false);

    }

    catch (error: any) {

      console.error(
        error
      );


      setError(

        error.message ||

        "Unable to save profile."

      );

    }

    finally {

      setSaving(false);

    }

  }


  if (!open) {

    return null;

  }


  return (

    <div
      className="profile-popup-overlay"
    >

      <div
        className="profile-popup"
      >


        <h2>

          👋 Complete Your Profile

        </h2>


        <p
          className="muted"
        >

          Please complete your
          profile to get a better
          experience.

        </p>


        <br />


        <label>

          Name

        </label>


        <input

          className="input"

          placeholder="Enter your name"

          value={name}

          onChange={(e) =>

            setName(
              e.target.value
            )

          }

        />


        <br />


        <label>

          Class

        </label>


        <input

          className="input"

          placeholder="Example: Class 10"

          value={className}

          onChange={(e) =>

            setClassName(
              e.target.value
            )

          }

        />


        <br />


        <label>

          Mobile Number

        </label>


        <input

          className="input"

          type="tel"

          inputMode="numeric"

          placeholder="Enter mobile number"

          value={phone}

          onChange={(e) =>

            setPhone(
              e.target.value
            )

          }

        />


        {error && (

          <p
            className="profile-popup-error"
          >

            {error}

          </p>

        )}


        <button

          className="btn primary profile-popup-save"

          onClick={
            saveProfile
          }

          disabled={
            saving
          }

        >

          {

            saving

              ? "Saving..."

              : "Save Profile"

          }

        </button>


      </div>

    </div>

  );

}
