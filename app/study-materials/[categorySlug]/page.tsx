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
  getAppUrl,
  getCategoryUrl,
  getStudyMaterialsUrl,
  siteName,
} from "@/lib/seo";

import {
  getBreadcrumbStructuredData,
} from "@/lib/structured-data";


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

    const categoryUrl =
    getCategoryUrl(
      category.slug
    );


  const breadcrumbSchema = {

    "@context":
      "https://schema.org",

    "@type":
      "BreadcrumbList",

    itemListElement: [

      {

        "@type":
          "ListItem",

        position:
          1,

        name:
          "Home",

        item:
          getAppUrl(),

      },


      {

        "@type":
          "ListItem",

        position:
          2,

        name:
          "Study Materials",

        item:
          getStudyMaterialsUrl(),

      },


      {

        "@type":
          "ListItem",

        position:
          3,

        name:
          category.name,

        item:
          categoryUrl,

      },

    ],

  };


  const collectionSchema = {

    "@context":
      "https://schema.org",

    "@type":
      "CollectionPage",

    name:
      `${category.name} Study Materials`,

    description:
      `Study materials, notes, PDFs and learning resources for ${category.name}.`,

    url:
      categoryUrl,

    isPartOf: {

      "@type":
        "WebSite",

      name:
        siteName,

      url:
        getAppUrl(),

    },

  };


  const subjectsSchema = {

    "@context":
      "https://schema.org",

    "@type":
      "ItemList",

    name:
      `${category.name} Subjects`,

    numberOfItems:
      category.subjects.length,

    itemListElement:

      category.subjects.map(

        (
          subject,
          index
        ) => ({

          "@type":
            "ListItem",

          position:
            index + 1,

          name:
            subject.name,

          url:
            `${categoryUrl}/${subject.slug}`,

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
            subjectsSchema
          ),

      }}
    />


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
