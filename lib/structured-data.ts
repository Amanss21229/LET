import {
  getAppUrl,
  getStudyMaterialsUrl,
  siteName,
  siteLegalName,
} from "@/lib/seo";


export function getOrganizationStructuredData() {

  const appUrl =
    getAppUrl();


  return {

    "@context":
      "https://schema.org",

    "@type":
      "Organization",

    "@id":
      `${appUrl}/#organization`,

    name:
      siteName,

    alternateName:
      siteLegalName,

    url:
      appUrl,

    logo: {

      "@type":
        "ImageObject",

      url:
        `${appUrl}/let-icon.png`,

    },

    image:
      `${appUrl}/let-icon.png`,

  };

}


export function getWebsiteStructuredData() {

  const appUrl =
    getAppUrl();


  return {

    "@context":
      "https://schema.org",

    "@type":
      "WebSite",

    name:
      siteName,

    url:
      appUrl,

  };

}


export function getStudyMaterialsCollectionStructuredData() {

  return {

    "@context":
      "https://schema.org",

    "@type":
      "CollectionPage",

    name:
      "LET Study Materials",

    description:
      "Explore study materials, notes, PDFs, planners and educational resources organised by class, stream and subject.",

    url:
      getStudyMaterialsUrl(),

    isPartOf: {

      "@type":
        "WebSite",

      name:
        siteName,

      url:
        getAppUrl(),

    },

  };

}


export function getBreadcrumbStructuredData(

  items: Array<{

    name:
      string;

    url:
      string;

  }>

) {

  return {

    "@context":
      "https://schema.org",

    "@type":
      "BreadcrumbList",

    itemListElement:

      items.map(

        (
          item,
          index
        ) => ({

          "@type":
            "ListItem",

          position:
            index + 1,

          name:
            item.name,

          item:
            item.url,

        })

      ),

  };

}
