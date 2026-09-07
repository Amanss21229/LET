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


  return (

    <>

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
