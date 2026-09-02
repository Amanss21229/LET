import BatchContentTabs from
  "@/components/BatchContentTabs";

import BatchDoubtChat from
  "@/components/BatchDoubtChat";

import Nav from "@/components/Nav";

import Enquiry from "@/components/Enquiry";

import BatchLoginButton from
  "@/components/BatchLoginButton";

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


  /*
  Tutor priority:

  1. Batch-specific tutor
  2. Global tutor
  3. Default fallback
  */

  const defaultTutorContent = {

  heading:
    "About Aman",

  subheading:
    "LET - Learn Earn Teach",

  text:
    "Welcome to LET",

  imageUrl:
    "",

  links:
    [],

  headingSize:
    "32px",

  subheadingSize:
    "20px",

  textSize:
    "16px",

};


/*
  Tutor priority:

  1. Batch-specific tutor
  2. Global tutor
  3. Default fallback
*/

const tutorContent: any =

  batch.tutorContent ||

  tutor?.content ||

  defaultTutorContent;

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


  const customPoints: string[] = Array.isArray(batch.customPoints)
    ? batch.customPoints
    .filter(
      (point): point is string =>
        typeof point === "string"
    )
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


            <BatchLoginButton />
            
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

  <BatchContentTabs

    batchId={
      batch.id
    }

    classSections={
      classSections
    }

    notesSections={
      notesSections
    }

    practiceSections={
      practiceSections
    }

    notifications={
      batch.notifications
    }

    tutorContent={
      tutorContent
    }

  />

</>
