import Nav from
  "@/components/Nav";

import Enquiry from
  "@/components/Enquiry";

import {
  prisma,
} from "@/lib/prisma";

import {
  notFound,
} from "next/navigation";

import StudyMaterialSearch from
  "@/components/StudyMaterialSearch";


export const dynamic =
  "force-dynamic";


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
