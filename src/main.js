// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import "@/assets/scss/main.scss";
import { BootstrapVue } from "bootstrap-vue";

import DefaultLayout from "~/layouts/Default.vue";

// Add fonts
require("typeface-dosis");
require("typeface-maven-pro");
require("typeface-nunito");

const siteUrl = "https://buffalostartupmap.com/";
const siteName = "Buffalo Startup Map";
// const metaImage = siteUrl + "meta/meta-img.png";
// const siteDesc = "This is a great description!"";

export default function(Vue, { router, head, isClient }) {
  // Set default layout as a global component
  Vue.use(BootstrapVue);
  Vue.component("Layout", DefaultLayout);

// Add extra meta tags
   head.meta.push({
    property: "og:type",
    content: "website"
  });
   head.meta.push({
    property: "og:title",
    content: siteName
  });
      head.meta.push({
        property: "og:site_name",
        content: siteName
      });
  head.meta.push({
    property: "og:url",
    content: siteUrl
  });
  // head.meta.push({
  //   property: "og:description",
  //   content: siteDesc
  // });
  // head.meta.push({
  //   property: "og:image",
  //   content: metaImage
  // });
  head.meta.push({
    name: "twitter:card",
    content: "summary_large_image"
  });
  head.meta.push({
    name: "twitter:title",
    content: siteName
  });
  head.meta.push({
    name: "twitter:url",
    content: siteUrl
  });
  // head.meta.push({
  //   name: "twitter:description",
  //   content: siteDesc
  // });
  // head.meta.push({
  //   name: "twitter:image",
  //   content: metaImage
  // });
  // Google Search Console
  head.meta.push({
    name: "google-site-verification",
    content: "bLOQwgU2NzWGPGeL0JJVed9CcZBGPUu09l3I1Usuf90"
  });
}
