import type {
  MetadataRoute,
} from "next";


export default function manifest():
  MetadataRoute.Manifest {

  return {

    name:
      "LET Online — Learn • Earn • Teach",

    short_name:
      "LET Online",

    description:
      "LET Online is an educational platform for study materials, learning batches, practice resources and academic support.",

    start_url:
      "/",

    display:
      "standalone",

    background_color:
      "#090909",

    theme_color:
      "#090909",

    orientation:
      "portrait-primary",

    icons: [

      {
        src:
          "/icon-192.png",

        sizes:
          "192x192",

        type:
          "image/png",
      },

      {
        src:
          "/icon-512.png",

        sizes:
          "512x512",

        type:
          "image/png",
      },

    ],

  };

}
