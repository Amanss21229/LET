import Nav from
  "@/components/Nav";

import Enquiry from
  "@/components/Enquiry";

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
  getMaterialUrl,
  getStudyMaterialsUrl,
  getSubjectUrl,
  siteName,
} from "@/lib/seo";

import StudyMaterialSearch from
  "@/components/StudyMaterialSearch";


export const dynamic =
  "force-dynamic";

export async function generateMetadata({

  params,

}: {

  params: Promise<{
    categorySlug: string;
    subjectSlug: string;
  }>;

}): Promise<Metadata> {

  const {

    categorySlug,

    subjectSlug,

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


  const subject =
    await prisma.studySubject.findUnique({

      where: {

        categoryId_slug: {

          categoryId:
            category.id,

          slug:
            subjectSlug,

        },

      },

    });


  if (!subject) {

    return {

      title:
        "Study Materials Not Found | LET",

    };

  }


  const url =
    getSubjectUrl(

      category.slug,

      subject.slug

    );


  return {

    title:
      `${subject.name} Study Materials for ${category.name} | LET`,

    description:
      `Explore ${subject.name} study materials for ${category.name}. Find notes, PDFs, planners and useful learning resources on LET.`,

    alternates: {

      canonical:
        url,

    },

    openGraph: {

      title:
        `${subject.name} Study Materials for ${category.name} | LET`,

      description:
        `Browse ${subject.name} notes, PDFs and study resources for ${category.name}.`,

      url,

      type:
        "website",

    },

  };

}


export default async function SubjectPage({

  params,

}: {

  params: Promise<{
    categorySlug: string;
    subjectSlug: string;
  }>;

}) {

  const {

    categorySlug,

    subjectSlug,

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

    return notFound();

  }


  const subject =
    await prisma.studySubject.findUnique({

      where: {

        categoryId_slug: {

          categoryId:
            category.id,

          slug:
            subjectSlug,

        },

      },

      include: {

        materials: {

          orderBy: {

            createdAt:
              "desc",

          },

        },

      },

    });


  if (!subject) {

    return notFound();

  }


  const materials =
    subject.materials.map(

      (
        material
      ) => ({

        id:
          material.id,

        title:
          material.title,

        slug:
          material.slug,

        createdAt:
          material.createdAt.toISOString(),

      })

    );

    const categoryUrl =
    getCategoryUrl(
      category.slug
    );


  const subjectUrl =
    getSubjectUrl(

      category.slug,

      subject.slug

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


      {

        "@type":
          "ListItem",

        position:
          4,

        name:
          subject.name,

        item:
          subjectUrl,

      },

    ],

  };


  const collectionSchema = {

    "@context":
      "https://schema.org",

    "@type":
      "CollectionPage",

    name:
      `${subject.name} Study Materials`,

    description:
      `Study materials, notes, PDFs and learning resources for ${subject.name} in ${category.name}.`,

    url:
      subjectUrl,

    isPartOf: {

      "@type":
        "CollectionPage",

      name:
        `${category.name} Study Materials`,

      url:
        categoryUrl,

    },

  };


  const materialsSchema = {

    "@context":
      "https://schema.org",

    "@type":
      "ItemList",

    name:
      `${subject.name} Study Materials`,

    numberOfItems:
      materials.length,

    itemListElement:

      materials.map(

        (
          material,
          index
        ) => ({

          "@type":
            "ListItem",

          position:
            index + 1,

          name:
            material.title,

          url:
            getMaterialUrl(

              category.slug,

              subject.slug,

              material.slug

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
            materialsSchema
          ),

      }}
    />


    <Nav />


      <main className="wrap">

        <section className="hero">

          <p className="yellow">

            {category.name}

          </p>


          <h1>

            {subject.name}

          </h1>


          <p className="muted">

            Browse and search
            study materials.

          </p>

        </section>


        <StudyMaterialSearch

          categorySlug={
            category.slug
          }

          subjectSlug={
            subject.slug
          }

          materials={
            materials
          }

        />

      </main>


      <Enquiry />

    </>

  );

}
