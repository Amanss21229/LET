import Nav from
  "@/components/Nav";

import Enquiry from
  "@/components/Enquiry";

import Link from
  "next/link";

import {
  prisma,
} from "@/lib/prisma";


export const dynamic =
  "force-dynamic";


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


  return (

    <>

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
