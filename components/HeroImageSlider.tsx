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


  const [

    activeIndex,

    setActiveIndex,

  ] =
    useState(0);


  useEffect(() => {

    setActiveIndex(0);

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

          setActiveIndex(
            (current) =>

              (
                current + 1
              ) %
              slides.length

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

          style={{

            transform:

              `translateX(-${activeIndex * 100}%)`,

          }}

        >


          {slides.map(
            (slide) => (

              <div

                className="hero-slide"

                key={slide.id}

              >

                <img

                  src={slide.imageUrl}

                  alt="LET featured learning banner"

                />

              </div>

            )
          )}


        </div>


      </div>


      {/* DOTS */}

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

                  index === activeIndex

                    ? "active"

                    : ""

                }

                aria-label={

                  `Show image ${index + 1}`

                }

                onClick={() =>

                  setActiveIndex(
                    index
                  )

                }

              />

            )
          )}

        </div>

      )}


    </div>

  );

}
