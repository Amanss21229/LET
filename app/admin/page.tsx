"use client";

import {
  useEffect,
  useState,
} from "react";

import Nav from "@/components/Nav";

import FileUpload
  from "@/components/FileUpload";

const empty = {

  title: "",

  className: "",

  medium: "Hindi",

  teacherName: "Aman",

  price: 0,

  about: "",

  imageUrl: "",

  customPoints:
    [] as string[],

};

export default function Admin() {

  const [
    ok,
    setOk
  ] =
    useState(false);

  const [
    pw,
    setPw
  ] =
    useState("");

  const [
    tab,
    setTab
  ] =
    useState("All Users");

  const [
    batches,
    setBatches
  ] =
    useState<any[]>([]);

  const [
    form,
    setForm
  ] =
    useState<any>(empty);

  const [
    msg,
    setMsg
  ] =
    useState("");

  const load = () =>

    fetch("/api/batches")
      .then((r) =>
        r.json()
      )
      .then(
        setBatches
      );

  useEffect(() => {

    load();

  }, []);

  const login =
    async () => {

      const response =
        await fetch(
          "/api/admin/login",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                password: pw,
              }),

          }
        );

      if (
        response.ok
      ) {

        setOk(true);

      } else {

        location.href = "/";

      }

    };

  const create =
    async () => {

      if (
        !form.title
      ) {

        setMsg(
          "Batch title is required"
        );

        return;

      }

      const response =
        await fetch(
          "/api/batches",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                form
              ),

          }
        );

      setMsg(

        response.ok

          ? "Batch created successfully"

          : "Error creating batch"

      );

      if (
        response.ok
      ) {

        setForm(empty);

        load();

      }

    };

  const access =
    async (
      id: string,
      grant: boolean
    ) => {

      const email =
        prompt(
          "Enter user's registered Gmail address"
        );

      if (!email) return;

      const response =
        await fetch(
          `/api/batches/${id}/access`,
          {

            method:
              grant
                ? "POST"
                : "DELETE",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                email,
              }),

          }
        );

      if (
        response.ok
      ) {

        alert(
          grant
            ? "Access granted"
            : "Access revoked"
        );

      } else {

        alert(
          "Operation failed"
        );

      }

    };

  if (!ok) {

    return (

      <>

        <Nav />

        <main
          className="wrap"
          style={{
            maxWidth: 500,
          }}
        >

          <h1>
            Admin Access
          </h1>

          <div className="card">

            <input
              className="input"
              type="password"
              value={pw}
              onChange={(e) =>
                setPw(
                  e.target.value
                )
              }
              placeholder="Admin Password"
            />

            <button
              className="btn primary"
              onClick={login}
            >

              Continue

            </button>

          </div>

        </main>

      </>

    );

  }

  return (

    <>

      <Nav />

      <main className="wrap">

        <h1>
          LET Admin Dashboard
        </h1>

        <div
          className="admin-panel"
        >

          <aside
            className="card"
          >

            {[
              "All Users",
              "Create Batch",
              "Manage Batch",
              "About Tutor",
              "Chats",
            ].map(
              (x) => (

                <p key={x}>

                  <button
                    className="btn"
                    onClick={() =>
                      setTab(x)
                    }
                  >

                    {x}

                  </button>

                </p>

              )
            )}

          </aside>

          <section
            className="card"
          >

            {tab ===
              "All Users" && (

              <>

                <h2>
                  All Users & Batch Access
                </h2>

                <p className="muted">

                  Grant or revoke
                  batch access using
                  the registered Gmail.

                </p>

                {batches.map(
                  (b) => (

                    <div
                      className="msg"
                      key={b.id}
                    >

                      <b>
                        {b.title}
                      </b>

                      <div
                        className="row"
                      >

                        <button
                          className="btn primary"
                          onClick={() =>
                            access(
                              b.id,
                              true
                            )
                          }
                        >

                          Grant Access

                        </button>

                        <button
                          className="btn"
                          onClick={() =>
                            access(
                              b.id,
                              false
                            )
                          }
                        >

                          Revoke Access

                        </button>

                      </div>

                    </div>

                  )
                )}

              </>

            )}

            {tab ===
              "Create Batch" && (

              <>

                <h2>
                  Create Batch
                </h2>

                <input
                  className="input"
                  placeholder="Batch Title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title:
                        e.target.value,
                    })
                  }
                />

                <input
                  className="input"
                  placeholder="Class"
                  value={
                    form.className
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      className:
                        e.target.value,
                    })
                  }
                />

                <input
                  className="input"
                  placeholder="Medium"
                  value={
                    form.medium
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      medium:
                        e.target.value,
                    })
                  }
                />

                <input
                  className="input"
                  placeholder="Teacher Name"
                  value={
                    form.teacherName
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      teacherName:
                        e.target.value,
                    })
                  }
                />

                <input
                  className="input"
                  placeholder="Batch Price"
                  type="number"
                  value={
                    form.price
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price:
                        Number(
                          e.target.value
                        ),
                    })
                  }
                />

                <textarea
                  className="input"
                  placeholder="About Batch"
                  value={
                    form.about
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      about:
                        e.target.value,
                    })
                  }
                />

                <h3>
                  Batch Image
                </h3>

                <FileUpload
                  accept="image/*"
                  label="Upload Batch Image"
                  onUploadComplete={
                    (url) =>
                      setForm({
                        ...form,
                        imageUrl: url,
                      })
                  }
                />

                {form.imageUrl && (

                  <img
                    src={
                      form.imageUrl
                    }
                    alt="Batch Preview"
                    className="upload-preview"
                  />

                )}

                <input
                  className="input"
                  placeholder="Custom points separated by |"
                  value={
                    form.customPoints.join(
                      "|"
                    )
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,

                      customPoints:
                        e.target.value
                          .split("|")
                          .filter(
                            Boolean
                          ),

                    })
                  }
                />

                <button
                  className="btn primary"
                  onClick={create}
                >

                  Create Batch

                </button>

                <p>
                  {msg}
                </p>

              </>

            )}

            {tab ===
              "Manage Batch" && (

              <>

                <h2>
                  Manage Batch
                </h2>

                <p className="muted">

                  Batch content API
                  currently exists.
                  The complete visual
                  Manage Batch UI needs
                  to be implemented
                  separately.

                </p>

                {batches.map(
                  (b) => (

                    <div
                      className="msg"
                      key={b.id}
                    >

                      <b>
                        {b.title}
                      </b>

                    </div>

                  )
                )}

              </>

            )}

            {tab ===
              "About Tutor" && (

              <>

                <h2>
                  About Tutor
                </h2>

                <p className="muted">

                  Tutor API exists.
                  Complete visual editor
                  needs to be added.

                </p>

              </>

            )}

            {tab ===
              "Chats" && (

              <>

                <h2>
                  Chats
                </h2>

                <p className="muted">

                  Conversation APIs
                  exist. Complete visual
                  chat UI needs to be
                  added.

                </p>

              </>

            )}

          </section>

        </div>

      </main>

    </>

  );

}
