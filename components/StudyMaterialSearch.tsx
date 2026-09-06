"use client";


import Link from
  "next/link";

import {
  useMemo,
  useState,
} from "react";


type Material = {

  id: string;

  title: string;

  slug: string;

  createdAt: string;

};


type Props = {

  categorySlug: string;

  subjectSlug: string;

  materials: Material[];

};


export default function StudyMaterialSearch({

  categorySlug,

  subjectSlug,

  materials,

}: Props) {


  const [
    query,
    setQuery,
  ] =
    useState("");


  const filteredMaterials =
    useMemo(() => {

      const search =
        query
          .trim()
          .toLowerCase();


      if (!search) {

        return materials;

      }


      return materials.filter(

        (
          material
        ) =>

          material.title
            .toLowerCase()
            .includes(
              search
            )

      );

    }, [

      materials,

      query,

    ]);


  return (

    <>

      <input

        className="input"

        placeholder={
          "🔍 Search study materials..."
        }

        value={
          query
        }

        onChange={
          (
            event
          ) =>

            setQuery(
              event.target.value
            )
        }

      />


      <div
        className="study-material-list"
      >

        {filteredMaterials.map(

          (
            material
          ) => (

            <Link

              key={
                material.id
              }

              href={
                `/study-materials/${categorySlug}/${subjectSlug}/${material.slug}`
              }

              className={
                "study-material-card"
              }

            >

              <span>

                📄

              </span>


              <div>

                <strong>

                  {material.title}

                </strong>


                <small>

                  View material →

                </small>

              </div>

            </Link>

          )

        )}

      </div>


      {filteredMaterials.length ===
        0 && (

        <section className="card">

          <p className="muted">

            No study materials found.

          </p>

        </section>

      )}

    </>

  );

}
