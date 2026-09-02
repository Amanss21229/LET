"use client";

import {
  useEffect,
  useState,
} from "react";

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


type ProfileData = {

  id?: string;

  name: string;

  email: string;

  image: string;

  phone: string;

  className: string;

  profileComplete: boolean;

};


export default function Profile() {


  const {

    firebaseUser,

    databaseUser,

    loading:
      authLoading,

    refreshUser,

  } =
    useFirebaseAuth();


  const [

    profile,

    setProfile,

  ] =
    useState<ProfileData | null>(
      null
    );


  const [

    loading,

    setLoading,

  ] =
    useState(true);


  const [

    message,

    setMessage,

  ] =
    useState("");


  const [

    loginLoading,

    setLoginLoading,

  ] =
    useState(false);


  useEffect(() => {


    async function loadProfile() {


      /*
        Firebase is still loading.
      */

      if (authLoading) {

        return;

      }


      /*
        User is not logged in.
      */

      if (!firebaseUser) {

        setProfile(null);

        setLoading(false);

        return;

      }


      try {

        setLoading(true);


        const response =
          await firebaseFetch(
            "/api/profile"
          );


        if (!response.ok) {

          setProfile(null);

          return;

        }


        const data =
          await response.json();


        setProfile(data);

      }

      catch (error) {

        console.error(
          "Profile load error:",
          error
        );


        setProfile(null);

      }

      finally {

        setLoading(false);

      }

    }


    loadProfile();


  }, [
    firebaseUser,
    authLoading,
  ]);


  async function handleLogin() {

    try {

      setLoginLoading(true);

      await loginWithGoogle();

    }

    catch (error) {

      console.error(
        error
      );

      setMessage(
        "Google login failed."
      );

    }

    finally {

      setLoginLoading(false);

    }

  }


  async function saveProfile(
    event:
      React.FormEvent
  ) {

    event.preventDefault();


    if (!profile) {

      return;

    }


    setMessage(
      "Saving..."
    );


    try {

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
                  profile.name,

                phone:
                  profile.phone,

                className:
                  profile.className,

              }),

          }

        );


      const data =
        await response.json();


      if (!response.ok) {

        setMessage(

          data.error ||

          "Unable to save profile."

        );

        return;

      }


      setProfile(data);


      await refreshUser();


      setMessage(
        "Profile saved successfully."
      );

    }

    catch (error) {

      console.error(
        error
      );


      setMessage(
        "Something went wrong."
      );

    }

  }


  /*
    Authentication loading
  */

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
            My Profile
          </h1>

          <p>
            Loading...
          </p>

        </main>

      </>

    );

  }


  /*
    User not logged in
  */

  if (
    !firebaseUser ||
    !profile
  ) {

    return (

      <>

        <NavClient />


        <main
          className="wrap"
          style={{
            maxWidth: 650,
          }}
        >

          <h1>
            My Profile
          </h1>


          <p
            className="muted"
          >

            Please login with
            Google first.

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
        style={{
          maxWidth: 650,
        }}
      >


        <h1>
          My Profile
        </h1>


        <p
          className="muted"
        >

          Your profile information
          can be edited anytime.

        </p>


        <br />


        <form
          className="card"
          onSubmit={
            saveProfile
          }
        >


          {profile.image && (

            <img

              src={
                profile.image
              }

              alt="Profile"

              style={{

                width: 80,

                height: 80,

                borderRadius:
                  "50%",

                objectFit:
                  "cover",

                marginBottom: 15,

              }}

            />

          )}


          <label>
            Google Email
          </label>


          <input

            className="input"

            value={
              profile.email
            }

            disabled

          />


          <br />


          <label>
            Name
          </label>


          <input

            className="input"

            value={
              profile.name
            }

            onChange={(
              event
            ) =>

              setProfile({

                ...profile,

                name:
                  event.target.value,

              })

            }

            required

          />


          <br />


          <label>
            Class
          </label>


          <input

            className="input"

            value={
              profile.className
            }

            onChange={(
              event
            ) =>

              setProfile({

                ...profile,

                className:
                  event.target.value,

              })

            }

            placeholder="Example: Class 9"

            required

          />


          <br />


          <label>
            Mobile Number
          </label>


          <input

            className="input"

            value={
              profile.phone
            }

            onChange={(
              event
            ) =>

              setProfile({

                ...profile,

                phone:
                  event.target.value,

              })

            }

            placeholder="Mobile Number"

            inputMode="numeric"

            required

          />


          <br />


          <button

            className="btn primary"

            type="submit"

          >

            Save Profile

          </button>


          {message && (

            <p>
              {message}
            </p>

          )}


        </form>


      </main>

    </>

  );

}
