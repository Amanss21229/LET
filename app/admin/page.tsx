"use client";

import {
  useEffect,
  useState,
} from "react";

import Nav from "@/components/Nav";
import FileUpload from "@/components/FileUpload";

const emptyBatch = {
  title: "",
  className: "",
  medium: "Hindi",
  teacherName: "Aman",
  price: 0,
  about: "",
  imageUrl: "",
  customPoints: [] as string[],
};

type Batch = {
  id: string;
  title: string;
  className: string;
  medium: string;
};

type Section = {
  id: string;
  title: string;
  kind: string;
  items?: any[];
};

export default function Admin() {
  const [ok, setOk] =
    useState(false);

  const [password, setPassword] =
    useState("");

  const [tab, setTab] =
    useState("All Users");

  const [batches, setBatches] =
    useState<Batch[]>([]);

  const [batchForm, setBatchForm] =
    useState<any>(emptyBatch);

  const [message, setMessage] =
    useState("");

  /* =========================
     MANAGE BATCH STATES
  ========================= */

  const [selectedBatch, setSelectedBatch] =
    useState("");

  const [manageTab, setManageTab] =
    useState("Classes");

  const [batchData, setBatchData] =
    useState<any>(null);

  const [sectionTitle, setSectionTitle] =
    useState("");

  const [itemTitle, setItemTitle] =
    useState("");

  const [itemUrl, setItemUrl] =
    useState("");

  const [itemType, setItemType] =
    useState("");

  const [itemDate, setItemDate] =
    useState("");

  const [selectedSection, setSelectedSection] =
    useState("");

  const [notificationText, setNotificationText] =
    useState("");

  const [
    notificationUrl,
    setNotificationUrl,
  ] = useState("");

  const [
    notificationType,
    setNotificationType,
  ] = useState("");

  /* =========================
     LOAD BATCHES
  ========================= */

  const loadBatches = async () => {
    try {
      const response = await fetch(
        "/api/batches"
      );

      const data =
        await response.json();

      setBatches(data);
    } catch {
      console.error(
        "Unable to load batches"
      );
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  /* =========================
     ADMIN LOGIN
  ========================= */

  const login = async () => {
    const response = await fetch(
      "/api/admin/login",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          password,
        }),
      }
    );

    if (response.ok) {
      setOk(true);
    } else {
      window.location.href = "/";
    }
  };

  /* =========================
     CREATE BATCH
  ========================= */

  const createBatch = async () => {
    if (!batchForm.title) {
      setMessage(
        "Please enter batch title"
      );

      return;
    }

    const response = await fetch(
      "/api/batches",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          batchForm
        ),
      }
    );

    if (response.ok) {
      setMessage(
        "Batch created successfully!"
      );

      setBatchForm(emptyBatch);

      loadBatches();
    } else {
      setMessage(
        "Unable to create batch"
      );
    }
  };

  /* =========================
     USER ACCESS
  ========================= */

  const manageAccess = async (
    id: string,
    grant: boolean
  ) => {
    const email = prompt(
      "Enter user's registered Gmail address"
    );

    if (!email) return;

    const response = await fetch(
      `/api/batches/${id}/access`,
      {
        method:
          grant ? "POST" : "DELETE",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          email,
        }),
      }
    );

    if (response.ok) {
      alert(
        grant
          ? "Batch access granted!"
          : "Batch access revoked!"
      );
    } else {
      alert(
        "Operation failed"
      );
    }
  };

  /* =========================
     LOAD SELECTED BATCH
  ========================= */

  const loadBatchData = async (
    batchId: string
  ) => {
    if (!batchId) {
      setBatchData(null);
      return;
    }

    const response = await fetch(
      `/api/batches/${batchId}`
    );

    const data =
      await response.json();

    setBatchData(data);
  };

  const selectBatch = (
    batchId: string
  ) => {
    setSelectedBatch(batchId);

    setSelectedSection("");

    loadBatchData(batchId);
  };

  /* =========================
     CREATE SECTION
  ========================= */

  const createSection = async () => {
    if (!selectedBatch) {
      alert(
        "Please select a batch first"
      );

      return;
    }

    if (!sectionTitle.trim()) {
      alert(
        "Please enter section name"
      );

      return;
    }

    let kind = "CLASS";

    if (manageTab === "Notes") {
      kind = "NOTES";
    }

    if (
      manageTab ===
      "Practice Sheets"
    ) {
      kind = "PRACTICE";
    }

    const response = await fetch(
      `/api/batches/${selectedBatch}/content`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          action: "section",
          kind,
          title: sectionTitle,
        }),
      }
    );

    if (response.ok) {
      setSectionTitle("");

      await loadBatchData(
        selectedBatch
      );

      alert(
        "New section created!"
      );
    } else {
      alert(
        "Unable to create section"
      );
    }
  };

  /* =========================
     ADD CONTENT ITEM
  ========================= */

  const addContentItem =
    async () => {
      if (!selectedSection) {
        alert(
          "Please select a section"
        );

        return;
      }

      if (!itemTitle.trim()) {
        alert(
          "Please enter title"
        );

        return;
      }

      if (!itemUrl.trim()) {
        alert(
          "Please upload/select a file or enter URL"
        );

        return;
      }

      const response = await fetch(
        `/api/batches/${selectedBatch}/content`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            action: "item",

            sectionId:
              selectedSection,

            title:
              itemTitle,

            url:
              itemUrl,

            fileType:
              itemType,

            scheduledAt:
              itemDate || null,
          }),
        }
      );

      if (response.ok) {
        setItemTitle("");
        setItemUrl("");
        setItemType("");
        setItemDate("");

        await loadBatchData(
          selectedBatch
        );

        alert(
          "Content added successfully!"
        );
      } else {
        alert(
          "Unable to add content"
        );
      }
    };

  /* =========================
     CREATE NOTIFICATION
  ========================= */

  const createNotification =
    async () => {
      if (!selectedBatch) {
        alert(
          "Please select a batch"
        );

        return;
      }

      if (
        !notificationText.trim() &&
        !notificationUrl
      ) {
        alert(
          "Please enter notification text or add attachment"
        );

        return;
      }

      const response = await fetch(
        `/api/batches/${selectedBatch}/content`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            action:
              "notification",

            text:
              notificationText,

            attachmentUrl:
              notificationUrl,

            attachmentType:
              notificationType,
          }),
        }
      );

      if (response.ok) {
        setNotificationText("");

        setNotificationUrl("");

        setNotificationType("");

        await loadBatchData(
          selectedBatch
        );

        alert(
          "Notification published!"
        );
      } else {
        alert(
          "Unable to publish notification"
        );
      }
    };

  /* =========================
     FILTER SECTIONS
  ========================= */

  const getSections = (
    kind: string
  ) => {
    if (!batchData?.sections) {
      return [];
    }

    return batchData.sections.filter(
      (section: Section) =>
        section.kind === kind
    );
  };

  /* =========================
     LOGIN PAGE
  ========================= */

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
              placeholder="Admin Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
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

  /* =========================
     MAIN ADMIN DASHBOARD
  ========================= */

  return (
    <>
      <Nav />

      <main className="wrap">
        <h1>
          LET Admin Dashboard
        </h1>

        <div className="admin-panel">

          {/* SIDEBAR */}

          <aside className="card">
            {[
              "All Users",
              "Create Batch",
              "Manage Batch",
              "About Tutor",
              "Chats",
            ].map((item) => (
              <p key={item}>
                <button
                  className="btn"
                  onClick={() =>
                    setTab(item)
                  }
                >
                  {item}
                </button>
              </p>
            ))}
          </aside>

          {/* CONTENT */}

          <section className="card">

            {/* =====================
                ALL USERS
            ===================== */}

            {tab ===
              "All Users" && (
              <>
                <h2>
                  All Users &
                  Batch Access
                </h2>

                <p className="muted">
                  Grant or revoke
                  batch access.
                </p>

                {batches.map(
                  (batch) => (
                    <div
                      className="msg"
                      key={batch.id}
                    >
                      <b>
                        {batch.title}
                      </b>

                      <div className="row">
                        <button
                          className="btn primary"
                          onClick={() =>
                            manageAccess(
                              batch.id,
                              true
                            )
                          }
                        >
                          Grant Access
                        </button>

                        <button
                          className="btn"
                          onClick={() =>
                            manageAccess(
                              batch.id,
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

            {/* =====================
                CREATE BATCH
            ===================== */}

            {tab ===
              "Create Batch" && (
              <>
                <h2>
                  Create Batch
                </h2>

                <input
                  className="input"
                  placeholder="Batch Title"
                  value={
                    batchForm.title
                  }
                  onChange={(e) =>
                    setBatchForm({
                      ...batchForm,
                      title:
                        e.target.value,
                    })
                  }
                />

                <input
                  className="input"
                  placeholder="Class"
                  value={
                    batchForm.className
                  }
                  onChange={(e) =>
                    setBatchForm({
                      ...batchForm,
                      className:
                        e.target.value,
                    })
                  }
                />

                <input
                  className="input"
                  placeholder="Medium"
                  value={
                    batchForm.medium
                  }
                  onChange={(e) =>
                    setBatchForm({
                      ...batchForm,
                      medium:
                        e.target.value,
                    })
                  }
                />

                <input
                  className="input"
                  placeholder="Teacher Name"
                  value={
                    batchForm.teacherName
                  }
                  onChange={(e) =>
                    setBatchForm({
                      ...batchForm,
                      teacherName:
                        e.target.value,
                    })
                  }
                />

                <input
                  className="input"
                  type="number"
                  placeholder="Price"
                  value={
                    batchForm.price
                  }
                  onChange={(e) =>
                    setBatchForm({
                      ...batchForm,
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
                    batchForm.about
                  }
                  onChange={(e) =>
                    setBatchForm({
                      ...batchForm,
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
                  onUploadComplete={(
                    url
                  ) =>
                    setBatchForm({
                      ...batchForm,
                      imageUrl: url,
                    })
                  }
                />

                {batchForm.imageUrl && (
                  <img
                    src={
                      batchForm.imageUrl
                    }
                    alt="Batch"
                    className="upload-preview"
                  />
                )}

                <input
                  className="input"
                  placeholder="Custom points separated by |"
                  onChange={(e) =>
                    setBatchForm({
                      ...batchForm,

                      customPoints:
                        e.target.value
                          .split("|")
                          .filter(Boolean),
                    })
                  }
                />

                <button
                  className="btn primary"
                  onClick={createBatch}
                >
                  Create Batch
                </button>

                <p>
                  {message}
                </p>
              </>
            )}

            {/* =====================
                MANAGE BATCH
            ===================== */}

            {tab ===
              "Manage Batch" && (
              <>
                <h2>
                  Manage Batch
                </h2>

                {/* SELECT BATCH */}

                <select
                  className="input"
                  value={
                    selectedBatch
                  }
                  onChange={(e) =>
                    selectBatch(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select Batch
                  </option>

                  {batches.map(
                    (batch) => (
                      <option
                        key={batch.id}
                        value={batch.id}
                      >
                        {batch.title}
                      </option>
                    )
                  )}
                </select>

                {!selectedBatch && (
                  <p className="muted">
                    Select a batch to
                    manage its content.
                  </p>
                )}

                {selectedBatch && (
                  <>

                    {/* MANAGE TABS */}

                    <div className="tabs">
                      {[
                        "Classes",
                        "Notes",
                        "Practice Sheets",
                        "Notifications",
                      ].map((item) => (
                        <button
                          key={item}
                          className="btn"
                          onClick={() => {
                            setManageTab(
                              item
                            );

                            setSelectedSection(
                              ""
                            );
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>

                    {/* =================
                        CLASSES
                    ================= */}

                    {manageTab ===
                      "Classes" && (
                      <>
                        <h2>
                          📚 Classes
                        </h2>

                        <p className="muted">
                          Create custom
                          categories like
                          Physics, Chemistry,
                          Mathematics etc.
                        </p>

                        {/* CREATE CATEGORY */}

                        <div className="card">
                          <h3>
                            ➕ Create Class
                            Category
                          </h3>

                          <input
                            className="input"
                            placeholder="Example: Mathematics"
                            value={
                              sectionTitle
                            }
                            onChange={(e) =>
                              setSectionTitle(
                                e.target.value
                              )
                            }
                          />

                          <button
                            className="btn primary"
                            onClick={
                              createSection
                            }
                          >
                            Create Category
                          </button>
                        </div>

                        {/* EXISTING */}

                        {getSections(
                          "CLASS"
                        ).map(
                          (
                            section: Section
                          ) => (
                            <div
                              className="msg"
                              key={
                                section.id
                              }
                            >
                              <b>
                                📁{" "}
                                {
                                  section.title
                                }
                              </b>

                              <p>
                                {section.items
                                  ?.length ||
                                  0}{" "}
                                Classes
                              </p>
                            </div>
                          )
                        )}

                        <hr />

                        <h3>
                          ➕ Add Live Class
                        </h3>

                        <select
                          className="input"
                          value={
                            selectedSection
                          }
                          onChange={(e) =>
                            setSelectedSection(
                              e.target.value
                            )
                          }
                        >
                          <option value="">
                            Select Class
                            Category
                          </option>

                          {getSections(
                            "CLASS"
                          ).map(
                            (
                              section: Section
                            ) => (
                              <option
                                key={
                                  section.id
                                }
                                value={
                                  section.id
                                }
                              >
                                {
                                  section.title
                                }
                              </option>
                            )
                          )}
                        </select>

                        <input
                          className="input"
                          placeholder="Class Title"
                          value={
                            itemTitle
                          }
                          onChange={(e) =>
                            setItemTitle(
                              e.target.value
                            )
                          }
                        />

                        <input
                          className="input"
                          placeholder="Live Class URL"
                          value={
                            itemUrl
                          }
                          onChange={(e) =>
                            setItemUrl(
                              e.target.value
                            )
                          }
                        />

                        <input
                          className="input"
                          type="datetime-local"
                          value={
                            itemDate
                          }
                          onChange={(e) =>
                            setItemDate(
                              e.target.value
                            )
                          }
                        />

                        <button
                          className="btn primary"
                          onClick={
                            addContentItem
                          }
                        >
                          Add Live Class
                        </button>
                      </>
                    )}

                    {/* =================
                        NOTES
                    ================= */}

                    {manageTab ===
                      "Notes" && (
                      <>
                        <h2>
                          📄 Notes
                        </h2>

                        <div className="card">
                          <h3>
                            ➕ Create Notes
                            Category
                          </h3>

                          <input
                            className="input"
                            placeholder="Example: Chapter 1"
                            value={
                              sectionTitle
                            }
                            onChange={(e) =>
                              setSectionTitle(
                                e.target.value
                              )
                            }
                          />

                          <button
                            className="btn primary"
                            onClick={
                              createSection
                            }
                          >
                            Create Category
                          </button>
                        </div>

                        {getSections(
                          "NOTES"
                        ).map(
                          (
                            section: Section
                          ) => (
                            <div
                              className="msg"
                              key={
                                section.id
                              }
                            >
                              <b>
                                📁{" "}
                                {
                                  section.title
                                }
                              </b>

                              <p>
                                {section.items
                                  ?.length ||
                                  0}{" "}
                                PDFs
                              </p>
                            </div>
                          )
                        )}

                        <hr />

                        <h3>
                          ➕ Upload Note
                        </h3>

                        <select
                          className="input"
                          value={
                            selectedSection
                          }
                          onChange={(e) =>
                            setSelectedSection(
                              e.target.value
                            )
                          }
                        >
                          <option value="">
                            Select Notes
                            Category
                          </option>

                          {getSections(
                            "NOTES"
                          ).map(
                            (
                              section: Section
                            ) => (
                              <option
                                key={
                                  section.id
                                }
                                value={
                                  section.id
                                }
                              >
                                {
                                  section.title
                                }
                              </option>
                            )
                          )}
                        </select>

                        <input
                          className="input"
                          placeholder="PDF Title"
                          value={
                            itemTitle
                          }
                          onChange={(e) =>
                            setItemTitle(
                              e.target.value
                            )
                          }
                        />

                        <FileUpload
                          accept="application/pdf"
                          label="Upload PDF Note"
                          onUploadComplete={(
                            url,
                            type,
                            name
                          ) => {
                            setItemUrl(url);

                            setItemType(
                              type
                            );

                            if (
                              !itemTitle
                            ) {
                              setItemTitle(
                                name.replace(
                                  /\.pdf$/i,
                                  ""
                                )
                              );
                            }
                          }}
                        />

                        {itemUrl && (
                          <p className="muted">
                            ✓ PDF selected
                            and uploaded
                          </p>
                        )}

                        <input
                          className="input"
                          type="datetime-local"
                          value={
                            itemDate
                          }
                          onChange={(e) =>
                            setItemDate(
                              e.target.value
                            )
                          }
                        />

                        <button
                          className="btn primary"
                          onClick={
                            addContentItem
                          }
                        >
                          Save Note
                        </button>
                      </>
                    )}

                    {/* =================
                      PRACTICE SHEETS
                    ================= */}

                    {manageTab ===
                      "Practice Sheets" && (
                      <>
                        <h2>
                          📝 Practice Sheets
                        </h2>

                        <div className="card">
                          <h3>
                            ➕ Create Practice
                            Category
                          </h3>

                          <input
                            className="input"
                            placeholder="Example: Weekly Test"
                            value={
                              sectionTitle
                            }
                            onChange={(e) =>
                              setSectionTitle(
                                e.target.value
                              )
                            }
                          />

                          <button
                            className="btn primary"
                            onClick={
                              createSection
                            }
                          >
                            Create Category
                          </button>
                        </div>

                        {getSections(
                          "PRACTICE"
                        ).map(
                          (
                            section: Section
                          ) => (
                            <div
                              className="msg"
                              key={
                                section.id
                              }
                            >
                              <b>
                                📁{" "}
                                {
                                  section.title
                                }
                              </b>

                              <p>
                                {section.items
                                  ?.length ||
                                  0}{" "}
                                Practice Sheets
                              </p>
                            </div>
                          )
                        )}

                        <hr />

                        <h3>
                          ➕ Upload Practice
                          Sheet
                        </h3>

                        <select
                          className="input"
                          value={
                            selectedSection
                          }
                          onChange={(e) =>
                            setSelectedSection(
                              e.target.value
                            )
                          }
                        >
                          <option value="">
                            Select Practice
                            Category
                          </option>

                          {getSections(
                            "PRACTICE"
                          ).map(
                            (
                              section: Section
                            ) => (
                              <option
                                key={
                                  section.id
                                }
                                value={
                                  section.id
                                }
                              >
                                {
                                  section.title
                                }
                              </option>
                            )
                          )}
                        </select>

                        <input
                          className="input"
                          placeholder="Practice Sheet Title"
                          value={
                            itemTitle
                          }
                          onChange={(e) =>
                            setItemTitle(
                              e.target.value
                            )
                          }
                        />

                        <FileUpload
                          accept="application/pdf"
                          label="Upload Practice PDF"
                          onUploadComplete={(
                            url,
                            type,
                            name
                          ) => {
                            setItemUrl(url);

                            setItemType(
                              type
                            );

                            if (
                              !itemTitle
                            ) {
                              setItemTitle(
                                name.replace(
                                  /\.pdf$/i,
                                  ""
                                )
                              );
                            }
                          }}
                        />

                        {itemUrl && (
                          <p className="muted">
                            ✓ PDF uploaded
                          </p>
                        )}

                        <input
                          className="input"
                          type="datetime-local"
                          value={
                            itemDate
                          }
                          onChange={(e) =>
                            setItemDate(
                              e.target.value
                            )
                          }
                        />

                        <button
                          className="btn primary"
                          onClick={
                            addContentItem
                          }
                        >
                          Save Practice
                          Sheet
                        </button>
                      </>
                    )}

                    {/* =================
                      NOTIFICATIONS
                    ================= */}

                    {manageTab ===
                      "Notifications" && (
                      <>
                        <h2>
                          🔔 Notifications
                        </h2>

                        <textarea
                          className="input"
                          placeholder="Write notification message..."
                          value={
                            notificationText
                          }
                          onChange={(e) =>
                            setNotificationText(
                              e.target.value
                            )
                          }
                        />

                        <h3>
                          ➕ Add Attachment
                        </h3>

                        <FileUpload
                          accept="image/*,audio/*,application/pdf"
                          label="Upload Image / Audio / PDF"
                          onUploadComplete={(
                            url,
                            type
                          ) => {
                            setNotificationUrl(
                              url
                            );

                            setNotificationType(
                              type
                            );
                          }}
                        />

                        {notificationUrl && (
                          <p className="muted">
                            ✓ Attachment
                            uploaded
                          </p>
                        )}

                        <button
                          className="btn primary"
                          onClick={
                            createNotification
                          }
                        >
                          Publish Notification
                        </button>

                        <hr />

                        <h3>
                          Published
                          Notifications
                        </h3>

                        {batchData
                          ?.notifications
                          ?.map(
                            (
                              notification: any
                            ) => (
                              <div
                                className="msg"
                                key={
                                  notification.id
                                }
                              >
                                {notification.text && (
                                  <p>
                                    {
                                      notification.text
                                    }
                                  </p>
                                )}

                                {notification.attachmentUrl && (
                                  <a
                                    href={
                                      notification.attachmentUrl
                                    }
                                    target="_blank"
                                    className="yellow"
                                  >
                                    Open Attachment
                                  </a>
                                )}

                                <br />

                                <small>
                                  {new Date(
                                    notification.createdAt
                                  ).toLocaleString()}
                                </small>
                              </div>
                            )
                          )}
                      </>
                    )}

                  </>
                )}
              </>
            )}

            {/* =====================
                ABOUT TUTOR
            ===================== */}

            {tab ===
              "About Tutor" && (
              <>
                <h2>
                  About Tutor
                </h2>

                <p className="muted">
                  Phase 4 will create
                  the complete visual
                  About Tutor editor.
                </p>
              </>
            )}

            {/* =====================
                CHATS
            ===================== */}

            {tab ===
              "Chats" && (
              <>
                <h2>
                  Chats
                </h2>

                <p className="muted">
                  Phase 5 will create
                  the complete admin
                  chat interface.
                </p>
              </>
            )}

          </section>
        </div>
      </main>
    </>
  );
}
