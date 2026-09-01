import Nav from "@/components/Nav";

import Enquiry from "@/components/Enquiry";

import {
  prisma,
} from "@/lib/prisma";

import {
  currentUser,
  hasAccess,
} from "@/lib/guards";

import {
  notFound,
} from "next/navigation";

export const dynamic =
  "force-dynamic";

export default async function Batch({
  params,
}: {
  params: Promise<{
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

      include: {
        sections: {
          include: {
            items: {
              orderBy: {
                createdAt: "desc",
              },
            },
          },

          orderBy: {
            sortOrder: "asc",
          },
        },

        notifications: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

  if (!batch) {
    return notFound();
  }

  const user =
    await currentUser();

  const access = user
    ? await hasAccess(
        user.id,
        id
      )
    : false;

  const whatsappMessage =
    encodeURIComponent(
      `Hello Aman, I want to purchase this batch: ${batch.title}`
    );

  const points =
    Array.isArray(
      batch.customPoints
    )
      ? (batch.customPoints as string[])
      : [];

  const classSections =
    batch.sections.filter(
      (section) =>
        section.kind ===
        "CLASS"
    );

  const notesSections =
    batch.sections.filter(
      (section) =>
        section.kind ===
        "NOTES"
    );

  const practiceSections =
    batch.sections.filter(
      (section) =>
        section.kind ===
        "PRACTICE"
    );

  return (
    <>
      <Nav />

      <main className="wrap">

        {/* =====================
            BATCH DETAILS
        ===================== */}

        <div className="card">

          {batch.imageUrl && (
            <img
              src={
                batch.imageUrl
              }
              alt={
                batch.title
              }
            />
          )}

          <h1>
            {batch.title}
          </h1>

          <p className="muted">
            Class{" "}
            {batch.className}
            {" • "}
            {batch.medium}
            {" • Teacher: "}
            {batch.teacherName}
          </p>

          <p>
            {batch.about}
          </p>

          {points.map(
            (point, index) => (
              <p key={index}>
                • {point}
              </p>
            )
          )}

          <h2 className="yellow">
            ₹{batch.price}
          </h2>

          {batch.buyEnabled && (
            <a
              className="btn primary"
              href={`https://wa.me/919153021229?text=${whatsappMessage}`}
              target="_blank"
            >
              Buy Now
            </a>
          )}
        </div>

        {/* =====================
            LOCKED CONTENT
        ===================== */}

        {!access && (
          <>
            <div className="tabs">
              <button className="btn">
                🔒 Classes
              </button>

              <button className="btn">
                🔒 Notes
              </button>

              <button className="btn">
                🔒 Practice Sheets
              </button>

              <button className="btn">
                🔒 Notifications
              </button>

              <button className="btn">
                🔒 Ask a Doubt
              </button>
            </div>

            <div className="card">
              <h2>
                🔒 Content Locked
              </h2>

              <p>
                Login and get batch
                access from the LET
                admin to unlock all
                content.
              </p>
            </div>
          </>
        )}

        {/* =====================
            AUTHORISED CONTENT
        ===================== */}

        {access && (
          <>

            {/* =================
                CLASSES
            ================= */}

            <section
              className="content-section"
            >
              <h2>
                📚 Classes
              </h2>

              {classSections.length ===
                0 && (
                <p className="muted">
                  No classes available
                  yet.
                </p>
              )}

              {classSections.map(
                (section) => (
                  <div
                    className="card"
                    key={
                      section.id
                    }
                  >
                    <h3>
                      📁{" "}
                      {section.title}
                    </h3>

                    {section.items.length ===
                      0 && (
                      <p className="muted">
                        No classes added.
                      </p>
                    )}

                    {section.items.map(
                      (item) => (
                        <div
                          className="msg"
                          key={
                            item.id
                          }
                        >
                          <b>
                            {
                              item.title
                            }
                          </b>

                          <br />

                          <a
                            href={
                              item.url
                            }
                            target="_blank"
                            className="yellow"
                          >
                            ▶ Join Live
                            Class
                          </a>

                          {item.scheduledAt && (
                            <p>
                              📅{" "}
                              {item.scheduledAt.toLocaleString()}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )
              )}
            </section>

            {/* =================
                NOTES
            ================= */}

            <section
              className="content-section"
            >
              <h2>
                📄 Notes
              </h2>

              {notesSections.length ===
                0 && (
                <p className="muted">
                  No notes available
                  yet.
                </p>
              )}

              {notesSections.map(
                (section) => (
                  <div
                    className="card"
                    key={
                      section.id
                    }
                  >
                    <h3>
                      📁{" "}
                      {section.title}
                    </h3>

                    {section.items.map(
                      (item) => (
                        <div
                          className="msg"
                          key={
                            item.id
                          }
                        >
                          <b>
                            {
                              item.title
                            }
                          </b>

                          <br />

                          <a
                            href={
                              item.url
                            }
                            target="_blank"
                            className="yellow"
                          >
                            📄 Open PDF
                          </a>

                          {item.scheduledAt && (
                            <p>
                              📅{" "}
                              {item.scheduledAt.toLocaleString()}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )
              )}
            </section>

            {/* =================
             PRACTICE SHEETS
            ================= */}

            <section
              className="content-section"
            >
              <h2>
                📝 Practice Sheets
              </h2>

              {practiceSections.length ===
                0 && (
                <p className="muted">
                  No practice sheets
                  available yet.
                </p>
              )}

              {practiceSections.map(
                (section) => (
                  <div
                    className="card"
                    key={
                      section.id
                    }
                  >
                    <h3>
                      📁{" "}
                      {section.title}
                    </h3>

                    {section.items.map(
                      (item) => (
                        <div
                          className="msg"
                          key={
                            item.id
                          }
                        >
                          <b>
                            {
                              item.title
                            }
                          </b>

                          <br />

                          <a
                            href={
                              item.url
                            }
                            target="_blank"
                            className="yellow"
                          >
                            📝 Open Practice
                            Sheet
                          </a>

                          {item.scheduledAt && (
                            <p>
                              📅{" "}
                              {item.scheduledAt.toLocaleString()}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )
              )}
            </section>

            {/* =================
             NOTIFICATIONS
            ================= */}

            <section
              className="content-section"
            >
              <h2>
                🔔 Notifications
              </h2>

              {batch.notifications
                .length === 0 && (
                <p className="muted">
                  No notifications
                  yet.
                </p>
              )}

              {batch.notifications.map(
                (notification) => (
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
                      <>
                        {/* IMAGE */}

                        {notification.attachmentType?.startsWith(
                          "image/"
                        ) && (
                          <img
                            src={
                              notification.attachmentUrl
                            }
                            alt="Notification"
                            className="notification-image"
                          />
                        )}

                        {/* AUDIO */}

                        {notification.attachmentType?.startsWith(
                          "audio/"
                        ) && (
                          <audio
                            controls
                            src={
                              notification.attachmentUrl
                            }
                          />
                        )}

                        {/* OTHER FILE */}

                        {!notification.attachmentType?.startsWith(
                          "image/"
                        ) &&
                          !notification.attachmentType?.startsWith(
                            "audio/"
                          ) && (
                            <p>
                              <a
                                href={
                                  notification.attachmentUrl
                                }
                                target="_blank"
                                className="yellow"
                              >
                                📎 Open Attachment
                              </a>
                            </p>
                          )}
                      </>
                    )}

                    <small>
                      {notification.createdAt.toLocaleString()}
                    </small>
                  </div>
                )
              )}
            </section>

            {/* =================
             ASK A DOUBT
            ================= */}

            <section
              className="content-section"
            >
              <h2>
                💬 Ask a Doubt
              </h2>

              <div className="card">
                <p className="muted">
                  Private doubt chat
                  will be completed
                  in Phase 5.
                </p>
              </div>
            </section>

          </>
        )}
      </main>

      <Enquiry />
    </>
  );
}
