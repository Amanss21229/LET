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


  const tutor =
    await prisma.tutorPage.findUnique({
      where: {
        id: "main",
      },
    });


  const tutorContent: any =
    tutor?.content || {
      heading:
        "About Aman",

      subheading:
        "LET - Learn Earn Teach",

      text:
        "Welcome to LET",

      imageUrl: "",

      links: [],
    };


  const user =
    await currentUser();


  const access =
    user
      ? await hasAccess(
          user.id,
          id
        )
      : false;


  const whatsappMessage =
    encodeURIComponent(
      `Hello Aman, I want to purchase this batch: ${batch.title}`
    );


  const customPoints = 
    Array.isArray(batch.customPoints)
  ? batch.customPoints
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

        <section className="card">

          {batch.imageUrl && (

            <img
              src={
                batch.imageUrl
              }
              alt={
                batch.title
              }
              className="batch-banner"
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

          </p>


          <hr />


          <h3>
            Batch Information
          </h3>


          <p>

            <b>
              Teacher:
            </b>

            {" "}

            {batch.teacherName}

          </p>


          {batch.startDate && (

            <p>

              <b>
                Batch Start Date:
              </b>

              {" "}

              {batch.startDate.toLocaleDateString()}

            </p>

          )}


          {batch.endDate && (

            <p>

              <b>
                Batch End Date:
              </b>

              {" "}

              {batch.endDate.toLocaleDateString()}

            </p>

          )}


          {batch.syllabusDate && (

            <p>

              <b>
                Syllabus Completion:
              </b>

              {" "}

              {batch.syllabusDate.toLocaleDateString()}

            </p>

          )}


          <hr />


          <h3>
            About Batch
          </h3>


          <p>
            {batch.about}
          </p>


          {customPoints.length > 0 && (

            <div>

              <h3>
                Highlights
              </h3>


              <ul>

                {customPoints.map(
                  (
                    point,
                    index
                  ) => (

                    <li
                      key={index}
                    >
                      {point}
                    </li>

                  )
                )}

              </ul>

            </div>

          )}


          <hr />


          <h2 className="yellow">

            ₹{batch.price}

          </h2>


          {batch.buyEnabled && (

            <a

              className="btn primary"

              href={
                `https://wa.me/919153021229?text=${whatsappMessage}`
              }

              target="_blank"

            >

              Buy Now

            </a>

          )}


        </section>


        {/* =====================
            NOT LOGGED IN
        ===================== */}

        {!user && (

          <section className="card">

            <h2>
              🔒 Login Required
            </h2>


            <p>

              Please login with Google
              to explore this batch.

            </p>


            <a
              href="/api/auth/signin/google"
              className="btn primary"
            >

              Continue with Google

            </a>

          </section>

        )}


        {/* =====================
            LOGGED IN BUT LOCKED
        ===================== */}

        {user &&
          !access && (

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


              <button className="btn">

                🔒 About Tutor

              </button>

            </div>


            <section className="card">

              <h2>
                🔒 Batch Locked
              </h2>


              <p>

                You are logged in,
                but you don't have
                access to this batch.

              </p>


              <p className="muted">

                Contact LET to purchase
                or get access.

              </p>

            </section>

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
                (
                  section
                ) => (

                  <div
                    className="card"
                    key={section.id}
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
                      (
                        item
                      ) => (

                        <div
                          className="msg"
                          key={item.id}
                        >

                          <b>
                            {item.title}
                          </b>


                          <br />


                          <a

                            href={item.url}

                            target="_blank"

                            className="yellow"

                          >

                            ▶ Join Live Class

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
                (
                  section
                ) => (

                  <div
                    className="card"
                    key={section.id}
                  >

                    <h3>

                      📁{" "}

                      {section.title}

                    </h3>


                    {section.items.map(
                      (
                        item
                      ) => (

                        <div
                          className="msg"
                          key={item.id}
                        >

                          <b>
                            {item.title}
                          </b>


                          <br />


                          <a

                            href={item.url}

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
                (
                  section
                ) => (

                  <div
                    className="card"
                    key={section.id}
                  >

                    <h3>

                      📁{" "}

                      {section.title}

                    </h3>


                    {section.items.map(
                      (
                        item
                      ) => (

                        <div
                          className="msg"
                          key={item.id}
                        >

                          <b>
                            {item.title}
                          </b>


                          <br />


                          <a

                            href={item.url}

                            target="_blank"

                            className="yellow"

                          >

                            📝 Open Practice Sheet

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
                (
                  notification
                ) => (

                  <div
                    className="msg"
                    key={notification.id}
                  >

                    {notification.text && (

                      <p>
                        {notification.text}
                      </p>

                    )}


                    {notification.attachmentUrl && (

                      <>

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

                  Private tutor chat
                  will be available
                  here.

                </p>


                <p>

                  💡 You will be able
                  to send text, images,
                  audio, PDF and links.

                </p>

              </div>

            </section>


            {/* =================
                ABOUT TUTOR
            ================= */}

            <section
              className="content-section"
            >

              <h2>
                👨‍🏫 About Tutor
              </h2>


              <div className="card tutor-card">

                {tutorContent.imageUrl && (

                  <img

                    src={
                      tutorContent.imageUrl
                    }

                    alt="Tutor"

                    className="tutor-image"

                  />

                )}


                {tutorContent.heading && (

              <h2
                style={{
                  fontSize:
                    tutorContent.headingSize ||
                    "32px",
                }}
                >
                {tutorContent.heading}
              </h2>

                )}


                {tutorContent.subheading && (

              <h4
                className="muted"
                style={{
                  fontSize:
                    tutorContent.subheadingSize ||
                    "20px",
                }}
                >
                {tutorContent.subheading}
              </h4>

                )}


                {tutorContent.text && (

                  <p
                    style={{
                      fontSize:
                        tutorContent.textSize ||
                        "16px",
                    }}
                    >
                    {tutorContent.text}
                  </p>

                )}


                {Array.isArray(
                  tutorContent.links
                ) &&

                  tutorContent.links.map(
                    (
                      link: any,
                      index: number
                    ) => (

                      <p
                        key={index}
                      >

                        <a

                          href={link.url}

                          target="_blank"

                          className="yellow"

                        >

                          🔗 {link.title}

                        </a>

                      </p>

                    )
                  )}

              </div>

            </section>

          </>

        )}


      </main>


      <Enquiry />

    </>
  );
}
