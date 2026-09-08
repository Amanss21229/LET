"use client";

import {

  useEffect,
  useState,

} from "react";


type SuccessShort = {

  id:
    string;

  title:
    string;

  slug:
    string;

  youtubeUrl:
    string;

  seoKeywords:
    string | null;

  seoDescription:
  string | null;

  viewCount:
    number;

  likeCount:
    number;

  shareCount:
    number;

  createdAt:
    string;

};


export default function
SuccessShortsManagement() {


  const [

    shorts,

    setShorts,

  ] =
    useState<SuccessShort[]>([]);


  const [

    loading,

    setLoading,

  ] =
    useState(true);


  const [

    title,

    setTitle,

  ] =
    useState("");


  const [

    youtubeUrl,

    setYoutubeUrl,

  ] =
    useState("");


  const [

    seoKeywords,

    setSeoKeywords,

  ] =
    useState("");

  const [
    
    seoDescription,
    
    setSeoDescription,

  ] =    
    useState("");

  const [

    editingId,

    setEditingId,

  ] =
    useState<string | null>(
      null
    );


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


  const [

    message,

    setMessage,

  ] =
    useState("");


  async function loadShorts() {

    try {

      setLoading(
        true
      );


      const response =
        await fetch(
          "/api/admin/success-shorts",
          {
            cache:
              "no-store",
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data?.error ||
          "Unable to load Success Shorts"
        );

      }


      setShorts(
        Array.isArray(data)
          ? data
          : []
      );

    }

    catch (
      err
    ) {

      setError(

        err instanceof Error

          ? err.message

          : "Unable to load Success Shorts"

      );

    }

    finally {

      setLoading(
        false
      );

    }

  }


  useEffect(

    () => {

      loadShorts();

    },

    []

  );


  function resetForm() {

    setTitle("");

    setYoutubeUrl("");

    setSeoKeywords("");

    setSeoDescription("");

    setEditingId(
      null
    );

  }


  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();


    setError("");

    setMessage("");


    if (
      !title.trim() ||
      !youtubeUrl.trim()
    ) {

      setError(
        "Title and YouTube URL are required"
      );

      return;

    }


    try {

      setSaving(
        true
      );


      const endpoint =
        editingId

          ? `/api/admin/success-shorts/${editingId}`

          : "/api/admin/success-shorts";


      const method =
        editingId

          ? "PUT"

          : "POST";


      const response =
        await fetch(

          endpoint,

          {

            method,

            headers: {

              "Content-Type":
                "application/json",

            },

            body:

              JSON.stringify({

                title,

                youtubeUrl,

                seoKeywords,

                seoDescription,

              }),

          }

        );


      const text =
  await response.text();


let data:
  unknown = null;


if (text) {

  try {

    data =
      JSON.parse(
        text
      );

  }

  catch {

    data =
      null;

  }

}


      if (!response.ok) {

  const errorData =
    data as {
      error?: string;
    } | null;


  throw new Error(

    errorData?.error ||

    "Unable to save Success Short"

  );

      }


      setMessage(

        editingId

          ? "Success Short updated successfully"

          : "Success Short added successfully"

      );


      resetForm();


      await loadShorts();

    }

    catch (
      err
    ) {

      setError(

        err instanceof Error

          ? err.message

          : "Unable to save Success Short"

      );

    }

    finally {

      setSaving(
        false
      );

    }

  }


  function handleEdit(
    short:
      SuccessShort
  ) {

    setError("");

    setMessage("");


    setEditingId(
      short.id
    );


    setTitle(
      short.title
    );


    setYoutubeUrl(
      short.youtubeUrl
    );


    setSeoKeywords(
      short.seoKeywords || ""
    );

    setSeoDescription(
      short.seoDescription || ""
    );

    window.scrollTo({

      top:
        0,

      behavior:
        "smooth",

    });

  }


  async function handleDelete(
    id:
      string
  ) {

    const confirmed =
      window.confirm(

        "Are you sure you want to delete this Success Short?"

      );


    if (!confirmed) {

      return;

    }


    setError("");

    setMessage("");


    try {

      const response =
        await fetch(

          `/api/admin/success-shorts/${id}`,

          {

            method:
              "DELETE",

          }

        );


      let data:
        unknown = null;


      const text =
        await response.text();


      if (text) {

        try {

          data =
            JSON.parse(
              text
            );

        }

        catch {

          data =
            null;

        }

      }


      if (!response.ok) {

        const errorData =
          data as {
            error?: string;
          } | null;


        throw new Error(

          errorData?.error ||

          "Unable to delete Success Short"

        );

      }


      setMessage(
        "Success Short deleted successfully"
      );


      if (
        editingId === id
      ) {

        resetForm();

      }


      await loadShorts();

    }

    catch (
      err
    ) {

      setError(

        err instanceof Error

          ? err.message

          : "Unable to delete Success Short"

      );

    }

  }


  return (

    <section
      className="card"
    >

      <h2>

        📱 Shorts Management

      </h2>


      <p
        className="muted"
      >

        Add, edit and manage
        your Success Shorts.

      </p>


      <form
        onSubmit={
          handleSubmit
        }
      >

        <div
          className="form-group"
        >

          <label>

            Short Title

          </label>


          <input

            type="text"

            value={
              title
            }

            onChange={

              (
                event
              ) =>

                setTitle(
                  event.target.value
                )

            }

            placeholder={
              "Enter Success Short title"
            }

            required

          />

        </div>


        <div
          className="form-group"
        >

          <label>

            YouTube Short URL

          </label>


          <input

            type="url"

            value={
              youtubeUrl
            }

            onChange={

              (
                event
              ) =>

                setYoutubeUrl(
                  event.target.value
                )

            }

            placeholder={
              "Paste YouTube Shorts URL"
            }

            required

          />

        </div>


        <div
          className="form-group"
        >

          <label>

            SEO Keywords

          </label>


          <textarea

            value={
              seoKeywords
            }

            onChange={

              (
                event
              ) =>

                setSeoKeywords(
                  event.target.value
                )

            }

            placeholder={
              "Example: NEET preparation, physics, motivation"
            }

            rows={

              3

            }

          />

        </div>

        <div
  className="form-group"
>

  <label>

    SEO Description

  </label>


  <textarea

    value={
      seoDescription
    }

    onChange={

      (
        event
      ) =>

        setSeoDescription(
          event.target.value
        )

    }

    placeholder={
      "Optional short description for Google and social sharing"
    }

    rows={
      3
    }

  />

</div>


        {error && (

          <p>

            {error}

          </p>

        )}


        {message && (

          <p>

            {message}

          </p>

        )}


        <div
          style={{

            display:
              "flex",

            gap:
              "10px",

            flexWrap:
              "wrap",

          }}
        >

          <button

            type="submit"

            disabled={
              saving
            }

          >

            {

              saving

                ? "Saving..."

                : editingId

                  ? "Update Short"

                  : "Add Short"

            }

          </button>


          {editingId && (

            <button

              type="button"

              onClick={
                resetForm
              }

            >

              Cancel Edit

            </button>

          )}

        </div>

      </form>


      <hr />


      <h3>

        Your Success Shorts

      </h3>


      {loading && (

        <p
          className="muted"
        >

          Loading...

        </p>

      )}


      {!loading &&

        shorts.length === 0 && (

          <p
            className="muted"
          >

            No Success Shorts added yet.

          </p>

        )}


      {!loading &&

        shorts.map(

          (
            short
          ) => (

            <div

              key={
                short.id
              }

              className="card"

              style={{

                marginTop:
                  "12px",

              }}

            >

              <h3>

                {short.title}

              </h3>


              <p
                className="muted"
              >

                👁️ Views: {

                  short.viewCount

                }

                {" · "}

                ❤️ Likes: {

                  short.likeCount

                }

                 {" · "}

                🔗 Shares: {

                  short.shareCount

                }

              </p>


              {short.seoKeywords && (

                <p
                  className="muted"
                >

                  SEO: {

                    short.seoKeywords

                  }

                </p>

              )}


              <div
                style={{

                  display:
                    "flex",

                  gap:
                    "10px",

                  flexWrap:
                    "wrap",

                }}
              >

                <button

                  type="button"

                  onClick={

                    () =>

                      handleEdit(
                        short
                      )

                  }

                >

                  Edit

                </button>


                <button

                  type="button"

                  onClick={

                    () =>

                      handleDelete(
                        short.id
                      )

                  }

                >

                  Delete

                </button>

              </div>

            </div>

          )

        )}

    </section>

  );

}
