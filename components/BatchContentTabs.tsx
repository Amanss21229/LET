"use client";

import {

  useState,

} from "react";

import BatchDoubtChat from
  "@/components/BatchDoubtChat";


export default function BatchContentTabs({

  batchId,

  classSections,

  notesSections,

  practiceSections,

  notifications,

  tutorContent,

}: any) {


  const [

    activeTab,

    setActiveTab,

  ] =
    useState(
      ""
    );


  return (

    <>


      {/* =====================
          DASHBOARD BUTTONS
      ===================== */}

      <div
        className="batch-dashboard"
      >


        <button

          className={
            `batch-dashboard-button ${
              activeTab === "classes"
                ? "active"
                : ""
            }`
          }

          onClick={() =>

            setActiveTab(
              "classes"
            )

          }

        >

          <span>

            📚

          </span>

          <b>

            Classes

          </b>

        </button>


        <button

          className={
            `batch-dashboard-button ${
              activeTab === "notes"
                ? "active"
                : ""
            }`
          }

          onClick={() =>

            setActiveTab(
              "notes"
            )

          }

        >

          <span>

            📄

          </span>

          <b>

            Notes

          </b>

        </button>


        <button

          className={
            `batch-dashboard-button ${
              activeTab === "practice"
                ? "active"
                : ""
            }`
          }

          onClick={() =>

            setActiveTab(
              "practice"
            )

          }

        >

          <span>

            📝

          </span>

          <b>

            Practice Sheets

          </b>

        </button>


        <button

          className={
            `batch-dashboard-button ${
              activeTab === "notifications"
                ? "active"
                : ""
            }`
          }

          onClick={() =>

            setActiveTab(
              "notifications"
            )

          }

        >

          <span>

            🔔

          </span>

          <b>

            Notifications

          </b>

        </button>


        <button

          className={
            `batch-dashboard-button ${
              activeTab === "doubt"
                ? "active"
                : ""
            }`
          }

          onClick={() =>

            setActiveTab(
              "doubt"
            )

          }

        >

          <span>

            💬

          </span>

          <b>

            Ask a Doubt

          </b>

        </button>


        <button

          className={
            `batch-dashboard-button ${
              activeTab === "tutor"
                ? "active"
                : ""
            }`
          }

          onClick={() =>

            setActiveTab(
              "tutor"
            )

          }

        >

          <span>

            👨‍🏫

          </span>

          <b>

            About Tutor

          </b>

        </button>

      </div>


      {/* =====================
          CLASSES
      ===================== */}

      {activeTab ===
        "classes" && (

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
              section: any
            ) => (

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
                  (
                    item: any
                  ) => (

                    <div

                      className="msg"

                      key={
                        item.id
                      }

                    >

                      <b>

                        {item.title}

                      </b>


                      <br />


                      <a

                        href={
                          item.url
                        }

                        target="_blank"

                        className="yellow"

                      >

                        ▶ Join Live Class

                      </a>

                    </div>

                  )
                )}

              </div>

            )
          )}

        </section>

      )}


      {/* =====================
          NOTES
      ===================== */}

      {activeTab ===
        "notes" && (

        <section
          className="content-section"
        >

          <h2>

            📄 Notes

          </h2>


          {notesSections.map(
            (
              section: any
            ) => (

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
                  (
                    item: any
                  ) => (

                    <div

                      className="msg"

                      key={
                        item.id
                      }

                    >

                      <b>

                        {item.title}

                      </b>


                      <br />


                      <a

                        href={
                          item.url
                        }

                        target="_blank"

                        rel="noopener noreferrer"

                        className="yellow"

                      >

                        📄 Open PDF

                      </a>

                    </div>

                  )
                )}

              </div>

            )
          )}

        </section>

      )}


      {/* =====================
          PRACTICE
      ===================== */}

      {activeTab ===
        "practice" && (

        <section
          className="content-section"
        >

          <h2>

            📝 Practice Sheets

          </h2>


          {practiceSections.map(
            (
              section: any
            ) => (

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
                  (
                    item: any
                  ) => (

                    <div

                      className="msg"

                      key={
                        item.id
                      }

                    >

                      <b>

                        {item.title}

                      </b>


                      <br />


                      <a

                        href={
                          item.url
                        }

                        target="_blank"

                        rel="noopener noreferrer"

                        className="yellow"

                      >

                        📝 Open Practice Sheet

                      </a>

                    </div>

                  )
                )}

              </div>

            )
          )}

        </section>

      )}


      {/* =====================
          NOTIFICATIONS
      ===================== */}

      {activeTab ===
        "notifications" && (

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

                    {notification.text}

                  </p>

                )}


                {notification.attachmentUrl &&

                  notification.attachmentType?.startsWith(
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


                {notification.attachmentUrl &&

                  notification.attachmentType?.startsWith(
                    "audio/"
                  ) && (

                    <audio

                      controls

                      src={
                        notification.attachmentUrl
                      }

                    />

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
          ASK DOUBT
      ===================== */}

      {activeTab ===
        "doubt" && (

        <section
          className="content-section"
        >

          <h2>

            💬 Ask a Doubt

          </h2>


          <BatchDoubtChat

            batchId={
              batchId
            }

          />

        </section>

      )}


      {/* =====================
          TUTOR
      ===================== */}

      {activeTab ===
        "tutor" && (

        <section
          className="content-section"
        >

          <h2>

            👨‍🏫 About Tutor

          </h2>


          <div
            className="card"
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


            <h2

              style={{

                fontSize:

                  tutorContent.headingSize ||
                  "32px",

              }}

            >

              {tutorContent.heading}

            </h2>


            <h4

              style={{

                fontSize:

                  tutorContent.subheadingSize ||
                  "20px",

              }}

            >

              {tutorContent.subheading}

            </h4>


            <p

              style={{

                fontSize:

                  tutorContent.textSize ||
                  "16px",

              }}

            >

              {tutorContent.text}

            </p>


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

                      href={
                        link.url
                      }

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

      )}

    </>

  );

}
