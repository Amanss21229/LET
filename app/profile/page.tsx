"use client";

import {
  useEffect,
  useState,
} from "react";

import Nav from "@/components/Nav";


type ProfileData = {
  name: string;
  email: string;
  image: string;
  phone: string;
  className: string;
  profileComplete: boolean;
};


export default function Profile() {

  const [
    profile,
    setProfile,
  ] = useState<ProfileData | null>(
    null
  );


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    message,
    setMessage,
  ] = useState("");


  useEffect(() => {

    async function loadProfile() {

      try {

        const response =
          await fetch(
            "/api/profile"
          );


        if (
          !response.ok
        ) {

          setProfile(null);

          return;

        }


        const data =
          await response.json();


        setProfile(data);


      } catch {

        setProfile(null);

      } finally {

        setLoading(false);

      }

    }


    loadProfile();

  }, []);


  async function saveProfile(
    event: React.FormEvent
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
        await fetch(
          "/api/profile",
          {

            method: "PATCH",

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


      if (
        !response.ok
      ) {

        setMessage(
          data.error ||
          "Unable to save profile."
        );

        return;

      }


      setProfile({
        ...profile,
        ...data,
      });


      setMessage(
        "Profile saved successfully."
      );


    } catch {

      setMessage(
        "Something went wrong."
      );

    }

  }


  if (loading) {

    return (
      <>
        <Nav />

        <main className="wrap">

          <h1>
            My Profile
          </h1>

          <p>
            Loading profile...
          </p>

        </main>

      </>
    );

  }


  if (!profile) {

    return (
      <>
        <Nav />

        <main
          className="wrap"
          style={{
            maxWidth: 650,
          }}
        >

          <h1>
            My Profile
          </h1>

          <p className="muted">

            Please login with
            Google first.

          </p>

          <br />

          <a
            className="btn primary"
            href="/api/auth/signin/google?callbackUrl=/profile"
          >

            Continue with Google

          </a>

        </main>

      </>
    );

  }


  return (

    <>

      <Nav />


      <main
        className="wrap"
        style={{
          maxWidth: 650,
        }}
      >


        <h1>
          My Profile
        </h1>


        <p className="muted">

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
                  event.target
                    .value,

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
                  event.target
                    .value,

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
                  event.target
                    .value,

              })
            }

            placeholder="Mobile Number"

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
