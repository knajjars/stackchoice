import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

import { SITE_DESCRIPTION, SITE_TITLE } from "~/consts";

export async function GET(context) {
  const baasProviders = await getCollection("baasProvider");
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: baasProviders.map((baas) => ({
      ...baas.data,
      link: `/baas/${baas.data.slug}/`,
    })),
  });
}
