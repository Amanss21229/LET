"use client";

import {
  useEffect,
  useState,
} from "react";


type HeroSlide = {

  id: string;

  imageUrl: string;

};


export default function HeroImageSlider({

  slides,

}: {

  slides: HeroSlide[];

}) {


  /*
    We start from 0.

    When we reach the cloned
    first image, we immediately
    reset back to the real first
    image without animation.
  */

  const [

    activeIndex,

    setActiveIndex,

  ] =
    useState(0);


  const [

    transitionEnabled,

    setTransitionEnabled,

  ] =
    useState(true);


  /*
    Add the first image again
    at the end.

    Example:

    1 → 2 → 3 → 4 → 5 → 1

    The final 1 is a clone.
  */

  const sliderSlides =

    slides.length > 1

      ? [

          ...slides,

          slides[0],

        ]

      : slides;


  useEffect(() => {

    setActiveIndex(0);

    setTransitionEnabled(true);

  }, [
    slides.length
  ]);


  /* =====================
     AUTO SLIDER
  ===================== */

  useEffect(() => {

    if (
      slides.length <= 1
    ) {

      return;

    }


    const interval =
      window.setInterval(

        () => {

          setTransitionEnabled(
            true
          );


          setActiveIndex(

            (current) =>
              current + 1

          );

        },

        3000

      );


    return () => {

      window.clearInterval(
        interval
      );

    };

  }, [
    slides.length
  ]);


  /* =====================
     SEAMLESS LOOP
  ===================== */

  const handleTransitionEnd =
    () => {


      /*
        If we reached the
        cloned first image,
        instantly move back
        to the real first image.
      */

      if (

        activeIndex ===
        slides.length

      ) {


        setTransitionEnabled(
          false
        );


        setActiveIndex(
          0
        );


        /*
          Re-enable animation
          after the instant reset.
        */

        requestAnimationFrame(

          () => {

            requestAnimationFrame(

              () => {

                setTransitionEnabled(
                  true
                );

              }

            );

          }

        );

      }

    };


  if (
    slides.length === 0
  ) {

    return null;

  }


  return (

    <div

      className="hero-slider-card"

      aria-label="LET featured images"

    >


      <div
        className="hero-slider-viewport"
      >


        <div

          className="hero-slider-track"

          onTransitionEnd={
            handleTransitionEnd
          }

          style={{

            transform:

              `translateX(-${activeIndex * 100}%)`,


            transition:

              transitionEnabled

                ? "transform 0.7s ease-in-out"

                : "none",

          }}

        >


          {sliderSlides.map(

            (
              slide,
              index
            ) => (

              <div

                className="hero-slide"

                key={

                  `${slide.id}-${index}`

                }

              >

                <img

                  src={
                    slide.imageUrl
                  }

                  alt="LET featured learning banner"

                />

              </div>

            )

          )}


        </div>


      </div>


      {/* =====================
          DOTS
      ===================== */}

      {slides.length > 1 && (

        <div
          className="hero-slider-dots"
        >


          {slides.map(

            (
              slide,
              index
            ) => (

              <button

                key={slide.id}

                type="button"

                className={

                  index ===

                  (
                    activeIndex ===
                    slides.length

                      ? 0

                      : activeIndex
                  )

                    ? "active"

                    : ""

                }

                aria-label={

                  `Show image ${index + 1}`

                }

                onClick={() => {


                  setTransitionEnabled(
                    true
                  );


                  setActiveIndex(
                    index
                  );


                }}

              />

            )

          )}


        </div>

      )}


    </div>

  );

}
