"use client";

import {
  useFirebaseAuth,
} from "@/hooks/useFirebaseAuth";


export default function AuthLoading({

  children,

}: {

  children:
    React.ReactNode;

}) {


  const {
    loading,
  } =
    useFirebaseAuth();


  if (loading) {

    return (

      <div

        style={{

          minHeight:
            "100vh",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          flexDirection:
            "column",

          gap:
            "12px",

        }}

      >

        <div>

          Loading LET...

        </div>


        <div

          style={{

            fontSize:
              "14px",

            opacity:
              0.6,

          }}

        >

          Please wait

        </div>

      </div>

    );

  }


  return (

    <>

      {children}

    </>

  );

}
