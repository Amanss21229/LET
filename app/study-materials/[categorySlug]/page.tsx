import Nav from
  "@/components/Nav";

import Enquiry from
  "@/components/Enquiry";

import Link from
  "next/link";

import type {
  Metadata,
} from "next";

import {
  prisma,
} from "@/lib/prisma";

import {
  notFound,
} from "next/navigation";

import {
  getCategoryUrl,
} from "@/lib/seo";


export const dynamic =
  "force-dynamic";

export async function generateMetadata({

  params,

}: {

  params: Promise<{
    categorySlug: string;
  }>;

}): Promise<Metadata> {

  const {
    categorySlug,
  } =
    await params;


  const category =
    await prisma.studyCategory.findUnique({

      where: {

        slug:
          categorySlug,

      },

    });


  if (!category) {

    return {

      title:
        "Study Materials Not Found | LET",

    };

  }


  const url =
    getCategoryUrl(
      category.slug
    );


  return {

    title:
      `${category.name} Study Materials | LET`,

    description:
      `Explore ${category.name} study materials organised by subject. Access notes, PDFs, planners and useful learning resources on LET.`,

    alternates: {

      canonical:
        url,

    },

    openGraph: {

      title:
        `${category.name} Study Materials | LET`,

      description:
        `Explore study materials and subjects for ${category.name}.`,

      url,

      type:
        "website",

    },

  };

}


export default async function CategoryPage({

  params,

}: {

  params: Promise<{
    categorySlug: string;
  }>;

}) {

  const {
    categorySlug,
  } =
    await params;


  const category =
    await prisma.studyCategory.findUnique({

      where: {

        slug:
          categorySlug,

      },

      include: {

        subjects: {

          orderBy: [

            {
              sortOrder:
                "asc",
            },

            {
              createdAt:
                "desc",
            },

          ],

        },

      },

    });


  if (!category) {

    return notFound();

  }


  return (

    <>

      <Nav />


      <main className="wrap">

        <Link
          href="/study-materials"
          className="muted"
        >

          ← Study Materials

        </Link>


        <section className="hero">

          <p className="yellow">

            CATEGORY

          </p>


          <h1>

            {category.name}

          </h1>


          <p className="muted">

            Select a subject.

          </p>

        </section>


        <section
          className="study-subject-list"
        >

          {category.subjects.map(

            (
              subject
            ) => (

              <Link

                key={
                  subject.id
                }

                href={
                  `/study-materials/${category.slug}/${subject.slug}`
                }

                className={
                  "study-subject-card"
                }

              >

                <span>

                  📖

                </span>


                <strong>

                  {subject.name}

                </strong>


                <small>

                  View materials →

                </small>

              </Link>

            )

          )}

        </section>


        {category.subjects.length ===
          0 && (

          <section className="card">

            <p className="muted">

              No subjects available yet.

            </p>

          </section>

        )}

      </main>


      <Enquiry />

    </>

  );

}
