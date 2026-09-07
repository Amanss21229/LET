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
  getAppUrl,
  getCategoryUrl,
  getStudyMaterialsUrl,
} from "@/lib/seo";

import {
  getBreadcrumbStructuredData,
  getStudyMaterialsCollectionStructuredData,
} from "@/lib/structured-data";


export const dynamic =
  "force-dynamic";

export const metadata: Metadata = {

  title:
  "Study Materials, Notes & PDFs | LET",

  description:
  "Explore study materials, notes, PDFs, planners and educational resources organised by class, stream and subject. Find useful learning resources for school, board, NEET and JEE preparation on LET.",

  alternates: {

    canonical:
      getStudyMaterialsUrl(),

  },

  openGraph: {

    title:
      "Study Materials | LET - Learn Earn Teach",

    description:
      "Explore study materials organised by class, stream and subject.",

    url:
      getStudyMaterialsUrl(),

    type:
      "website",

  },

};


export default async function StudyMaterialsPage() {

  const categories =
    await prisma.studyCategory.findMany({

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

    });

  const breadcrumbSchema =
    getBreadcrumbStructuredData([

      {

        name:
          "Home",

        url:
          getAppUrl(),

      },

      {

        name:
          "Study Materials",

        url:
          getStudyMaterialsUrl(),

      },

    ]);


  const collectionSchema =
    getStudyMaterialsCollectionStructuredData();


  const categoriesSchema = {

    "@context":
      "https://schema.org",

    "@type":
      "ItemList",

    name:
      "LET Study Material Categories",

    numberOfItems:
      categories.length,

    itemListElement:

      categories.map(

        (
          category,
          index
        ) => ({

          "@type":
            "ListItem",

          position:
            index + 1,

          name:
            category.name,

          url:
            getCategoryUrl(
              category.slug
            ),

        })

      ),

  };


  return (

  <>


    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{

        __html:
          JSON.stringify(
            breadcrumbSchema
          ),

      }}
    />


    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{

        __html:
          JSON.stringify(
            collectionSchema
          ),

      }}
    />


    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{

        __html:
          JSON.stringify(
            categoriesSchema
          ),

      }}
    />


    <Nav />


      <main className="wrap">

        <section className="hero">

          <p className="yellow">

            LET STUDY MATERIALS

          </p>


          <h1>

            Study Materials

          </h1>


          <p className="muted">

            Explore study materials
            by class and stream.

          </p>

        </section>


        {categories.length === 0 ? (

          <section className="card">

            <h2>

              No Study Materials Yet

            </h2>


            <p className="muted">

              Study materials will
              be available soon.

            </p>

          </section>

        ) : (

          <section
            className="study-category-list"
          >

            {categories.map(
              (
                category
              ) => (

                <Link

                  key={
                    category.id
                  }

                  href={
                    `/study-materials/${category.slug}`
                  }

                  className={
                    "study-category-card"
                  }

                >

                  <span>

                    📚

                  </span>


                  <strong>

                    {category.name}

                  </strong>


                  <small>

                    Explore subjects →

                  </small>

                </Link>

              )
            )}

          </section>

        )}

      </main>


      <Enquiry />

    </>

  );

}
