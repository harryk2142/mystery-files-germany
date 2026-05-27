import rss from "@astrojs/rss";
import { BLOG_NAME, SITE_DESCRIPTION_SHORT } from "@consts";

import { getCollection } from "astro:content";

export async function GET(context) {
    const posts = await getCollection("blog");
    return rss({
        title: BLOG_NAME,
        description: SITE_DESCRIPTION_SHORT,
        site: context.site,
        items: posts
            .filter((e) => !e.data.draft)
            .map((post) => ({
                ...post.data,
                link: `/blog/${post.id}/`,
            })),
    });
}
