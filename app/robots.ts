import type {
  MetadataRoute,
} from "next";

import {
  getAppUrl,
} from "@/lib/seo";


const siteUrl =
  getAppUrl();


export default function robots():
  MetadataRoute.Robots {


  return {


    rules: [

      {

        userAgent:

          "*",

        allow:

          "/",

        disallow: [

          "/admin",

          "/api/",

        ],

      },

    ],


    sitemap:

      `${siteUrl}/sitemap.xml`,

  };

}
