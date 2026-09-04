import Nav from
  "@/components/Nav";

import Enquiry from
  "@/components/Enquiry";

import HeroImageSlider from
  "@/components/HeroImageSlider";

import {
  prisma,
} from "@/lib/prisma";

import Link from
  "next/link";


export const dynamic =
  "force-dynamic";


type HeroSlide = {

  id: string;

  imageUrl: string;

};


export default async function Home() {


  const batches =
    await prisma.batch.findMany({

      orderBy: {

        createdAt:
          "desc",

      },

    });


  /* =====================
     LOAD HERO IMAGES
  ===================== */

  const heroSettings =
    await prisma.tutorPage.findUnique({

      where: {

        id:
          "hero-slider",

      },

    });


  const heroContent =

    heroSettings?.content &&

    typeof heroSettings.content ===
      "object" &&

    !Array.isArray(
      heroSettings.content
    )

      ? (

          heroSettings.content as {

            slides?: unknown;

          }

        )

      : {};


  const heroSlides:
    HeroSlide[] =

    Array.isArray(
      heroContent.slides
    )

      ? heroContent.slides

          .filter(

            (
              slide
            ): slide is HeroSlide =>

              !!slide &&

              typeof slide ===
                "object" &&

              typeof (
                slide as HeroSlide
              ).id ===
                "string" &&

              typeof (
                slide as HeroSlide
              ).imageUrl ===
                "string" &&

              (
                slide as HeroSlide
              ).imageUrl
                .trim()
                .length > 0

          )

          .slice(
            0,
            20
          )

      : [];


  return (

    <>

      <Nav />


      <main className="wrap">


        {/* =====================
            HERO
        ===================== */}

        <section

          className={

            heroSlides.length

              ? "hero hero-with-slider"

              : "hero"

          }

        >


          {/* LEFT SIDE */}

          <div className="hero-copy">


            <p className="yellow">

              LET • LEARN • EARN • TEACH

            </p>


            <h1>

              Learn smarter.

              <br />


              <span className="yellow">

                Grow stronger.

              </span>

            </h1>


            <p className="muted">

              A modern learning platform
              by Aman.

            </p>


          </div>


          {/* RIGHT SIDE */}

          {heroSlides.length > 0 && (

            <HeroImageSlider

              slides={
                heroSlides
              }

            />

          )}


        </section>


        {/* =====================
            ALL BATCHES
        ===================== */}

        <h2>

          All Batches

        </h2>


        <div className="grid">


          {batches.length

            ? (

                batches.map(
                  (b) => (

                    <Link

                      className="card"

                      key={b.id}

                      href={
                        `/batches/${b.id}`
                      }

                    >


                      {b.imageUrl ? (

                        <img

                          src={
                            b.imageUrl
                          }

                          alt={
                            b.title
                          }

                          className="batch-image"

                        />

                      ) : (

                        <div

                          className="batch-image-placeholder"

                        >

                          LET

                        </div>

                      )}


                      <h3>

                        {b.title}

                      </h3>


                      <p className="muted">

                        Class{" "}

                        {b.className}

                        {" • "}

                        {b.medium}

                      </p>


                      <b className="yellow">

                        ₹{b.price}

                      </b>


                      <p>

                        <button className="btn primary">

                          Explore Batch

                        </button>

                      </p>


                    </Link>

                  )
                )

              )

            : (

                <p className="muted">

                  No batches yet.

                  Admin can create the
                  first batch.

                </p>

              )}


        </div>


      </main>


      <Enquiry />


    </>

  );

}

