"use client";

import { useState } from "react";

import BatchDoubtChat from
  "@/components/BatchDoubtChat";


type Item = {
  id: string;
  title: string;
  url: string;
  scheduledAt: Date | string | null;
};


type Section = {
  id: string;
  title: string;
  items: Item[];
};


type Notification = {
  id: string;
  text: string | null;
  attachmentUrl: string | null;
  attachmentType: string | null;
  createdAt: Date | string;
};


type TutorContent = {
  heading?: string;
  subheading?: string;
  text?: string;
  imageUrl?: string;
  links?: any[];
  headingSize?: string;
  subheadingSize?: string;
  textSize?: string;
};


type Props = {

  batchId: string;

  classSections: Section[];

  notesSections: Section[];

  practiceSections: Section[];

  notifications: Notification[];

  tutorContent: TutorContent;

};


export default function BatchContentTabs({

  batchId,

  classSections,

  notesSections,

  practiceSections,

  notifications,

  tutorContent,

}: Props) {


  const [
    activeTab,
    setActiveTab,
  ] = useState("Classes");


  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState<string | null>(
    null
  );


  const changeTab = (
    tab: string
  ) => {

    setActiveTab(tab);

    setSelectedCategory(null);

  };


  const getSections = () => {

    if (
      activeTab === "Classes"
    ) {

      return classSections;

    }


    if (
      activeTab === "Notes"
    ) {

      return notesSections;

    }


    if (
      activeTab ===
      "Practice Sheets"
    ) {

      return practiceSections;

    }


    return [];

  };


  const currentSections =
    getSections();


  const currentSection =
    currentSections.find(
      (
        section
      ) =>
        section.id ===
        selectedCategory
    );


  return (

    <>

      {/* =====================
          MAIN TAB BUTTONS
      ===================== */}

      <div
        className="batch-tabs-grid"
      >

        <button
          className={
            `batch-tab-btn ${
              activeTab === "Classes"
                ? "active"
                : ""
            }`
          }
          onClick={() =>
            changeTab("Classes")
          }
        >

          <span>
            📚
          </span>

          Classes

        </button>


        <button
          className={
            `batch-tab-btn ${
              activeTab === "Notes"
                ? "active"
                : ""
            }`
          }
          onClick={() =>
            changeTab("Notes")
          }
        >

          <span>
            📄
          </span>

          Notes

        </button>


        <button
          className={
            `batch-tab-btn ${
              activeTab ===
              "Practice Sheets"
                ? "active"
                : ""
            }`
          }
          onClick={() =>
            changeTab(
              "Practice Sheets"
            )
          }
        >

          <span>
            📝
          </span>

          Practice Sheets

        </button>


        <button
          className={
            `batch-tab-btn ${
              activeTab ===
              "Notifications"
                ? "active"
                : ""
            }`
          }
          onClick={() =>
            changeTab(
              "Notifications"
            )
          }
        >

          <span>
            🔔
          </span>

          Notifications

        </button>


        <button
          className={
            `batch-tab-btn ${
              activeTab ===
              "Ask a Doubt"
                ? "active"
                : ""
            }`
          }
          onClick={() =>
            changeTab(
              "Ask a Doubt"
            )
          }
        >

          <span>
            💬
          </span>

          Ask a Doubt

        </button>


        <button
          className={
            `batch-tab-btn ${
              activeTab ===
              "About Tutor"
                ? "active"
                : ""
            }`
          }
          onClick={() =>
            changeTab(
              "About Tutor"
            )
          }
        >

          <span>
            👨‍🏫
          </span>

          About Tutor

        </button>

      </div>



      {/* =====================
          CLASSES
      ===================== */}

      {activeTab ===
        "Classes" && (

        <section
          className="content-section"
        >

          <h2>
            📚 Classes
          </h2>


          {!selectedCategory && (

            <>

              {classSections.length ===
                0 ? (

                <p className="muted">

                  No classes available yet.

                </p>

              ) : (

                <div
                  className="category-grid"
                >

                  {classSections.map(
                    (
                      section
                    ) => (

                      <button
                        key={section.id}
                        className="category-btn"
                        onClick={() =>
                          setSelectedCategory(
                            section.id
                          )
                        }
                      >

                        📁

                        <span>

                          {section.title}

                        </span>


                        <small>

                          {
                            section.items
                              .length
                          }{" "}

                          Classes

                        </small>

                      </button>

                    )
                  )}

                </div>

              )}

            </>

          )}


          {selectedCategory &&
            currentSection && (

            <>

              <button
                className="btn"
                onClick={() =>
                  setSelectedCategory(
                    null
                  )
                }
              >

                ← Back to Categories

              </button>


              <div className="card">

                <h3>

                  📁{" "}

                  {
                    currentSection.title
                  }

                </h3>


                {currentSection.items
                  .length === 0 && (

                  <p className="muted">

                    No classes added.

                  </p>

                )}


                {currentSection.items.map(
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
                        rel="noopener noreferrer"
                        className="yellow"
                      >

                        ▶ Join Live Class

                      </a>


                      {item.scheduledAt && (

                        <p>

                          📅{" "}

                          {new Date(
                            item.scheduledAt
                          ).toLocaleString()}

                        </p>

                      )}

                    </div>

                  )
                )}

              </div>

            </>

          )}

        </section>

      )}



      {/* =====================
          NOTES
      ===================== */}

      {activeTab ===
        "Notes" && (

        <section
          className="content-section"
        >

          <h2>
            📄 Notes
          </h2>


          {!selectedCategory && (

            <>

              {notesSections.length ===
                0 ? (

                <p className="muted">

                  No notes available yet.

                </p>

              ) : (

                <div
                  className="category-grid"
                >

                  {notesSections.map(
                    (
                      section
                    ) => (

                      <button
                        key={section.id}
                        className="category-btn"
                        onClick={() =>
                          setSelectedCategory(
                            section.id
                          )
                        }
                      >

                        📁

                        <span>

                          {section.title}

                        </span>


                        <small>

                          {
                            section.items
                              .length
                          }{" "}

                          Notes

                        </small>

                      </button>

                    )
                  )}

                </div>

              )}

            </>

          )}


          {selectedCategory &&
            currentSection && (

            <>

              <button
                className="btn"
                onClick={() =>
                  setSelectedCategory(
                    null
                  )
                }
              >

                ← Back to Categories

              </button>


              <div className="card">

                <h3>

                  📁{" "}

                  {
                    currentSection.title
                  }

                </h3>


                {currentSection.items
                  .length === 0 && (

                  <p className="muted">

                    No notes available.

                  </p>

                )}


                {currentSection.items.map(
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


                      <div className="pdf-actions">

  <a

    href={
      `/api/pdf?url=${encodeURIComponent(
        item.url
      )}`
    }

    target="_blank"

    rel="noopener noreferrer"

    className="yellow"

  >

    📄 Open PDF

  </a>


  <a

    href={
      `/api/pdf?download=1&url=${encodeURIComponent(
        item.url
      )}`
    }

    className="yellow"

  >

    ⬇️ Download PDF

  </a>

</div>


                      {item.scheduledAt && (

                        <p>

                          📅{" "}

                          {new Date(
                            item.scheduledAt
                          ).toLocaleString()}

                        </p>

                      )}

                    </div>

                  )
                )}

              </div>

            </>

          )}

        </section>

      )}



      {/* =====================
          PRACTICE SHEETS
      ===================== */}

      {activeTab ===
        "Practice Sheets" && (

        <section
          className="content-section"
        >

          <h2>
            📝 Practice Sheets
          </h2>


          {!selectedCategory && (

            <>

              {practiceSections
                .length === 0 ? (

                <p className="muted">

                  No practice sheets
                  available yet.

                </p>

              ) : (

                <div
                  className="category-grid"
                >

                  {practiceSections.map(
                    (
                      section
                    ) => (

                      <button
                        key={section.id}
                        className="category-btn"
                        onClick={() =>
                          setSelectedCategory(
                            section.id
                          )
                        }
                      >

                        📁

                        <span>

                          {section.title}

                        </span>


                        <small>

                          {
                            section.items
                              .length
                          }{" "}

                          Sheets

                        </small>

                      </button>

                    )
                  )}

                </div>

              )}

            </>

          )}


          {selectedCategory &&
            currentSection && (

            <>

              <button
                className="btn"
                onClick={() =>
                  setSelectedCategory(
                    null
                  )
                }
              >

                ← Back to Categories

              </button>


              <div className="card">

                <h3>

                  📁{" "}

                  {
                    currentSection.title
                  }

                </h3>


                {currentSection.items
                  .length === 0 && (

                  <p className="muted">

                    No practice sheets
                    available.

                  </p>

                )}


                {currentSection.items.map(
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


                      <div className="pdf-actions">

  <a

    href={
      `/api/pdf?url=${encodeURIComponent(
        item.url
      )}`
    }

    target="_blank"

    rel="noopener noreferrer"

    className="yellow"

  >

    📝 Open Practice Sheet

  </a>


  <a

    href={
      `/api/pdf?download=1&url=${encodeURIComponent(
        item.url
      )}`
    }

    className="yellow"

  >

    ⬇️ Download PDF

  </a>

</div>


                      {item.scheduledAt && (

                        <p>

                          📅{" "}

                          {new Date(
                            item.scheduledAt
                          ).toLocaleString()}

                        </p>

                      )}

                    </div>

                  )
                )}

              </div>

            </>

          )}

        </section>

      )}



      {/* =====================
          NOTIFICATIONS
      ===================== */}

      {activeTab ===
        "Notifications" && (

        <section
          className="content-section"
        >

          <h2>
            🔔 Notifications
          </h2>


          {notifications.length ===
            0 && (

            <p className="muted">

              No notifications yet.

            </p>

          )}


          {notifications.map(
            (
              notification
            ) => (

              <div
                className="msg"
                key={
                  notification.id
                }
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
                            rel="noopener noreferrer"
                            className="yellow"
                          >

                            📎 Open Attachment

                          </a>

                        </p>

                      )}

                  </>

                )}


                <small>

                  {new Date(
                    notification.createdAt
                  ).toLocaleString()}

                </small>

              </div>

            )
          )}

        </section>

      )}



      {/* =====================
          ASK A DOUBT
      ===================== */}

      {activeTab ===
        "Ask a Doubt" && (

        <section
          className="content-section"
        >

          <h2>
            💬 Ask a Doubt
          </h2>


          <div className="card">

            <p className="muted">

              Ask your doubt directly
              to your teacher.

            </p>


            <BatchDoubtChat
              batchId={batchId}
            />

          </div>

        </section>

      )}



      {/* =====================
          ABOUT TUTOR
      ===================== */}

      {activeTab ===
        "About Tutor" && (

        <section
          className="content-section"
        >

          <h2>
            👨‍🏫 About Tutor
          </h2>


          <div
            className="card tutor-card"
          >

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

                {
                  tutorContent.heading
                }

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

                {
                  tutorContent.subheading
                }

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

                {
                  tutorContent.text
                }

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
                      rel="noopener noreferrer"
                      className="yellow"
                    >

                      🔗 {
                        link.title
                      }

                    </a>

                  </p>

                )
              )}

          </div>

        </section>

      )}

    </>

  );

}
