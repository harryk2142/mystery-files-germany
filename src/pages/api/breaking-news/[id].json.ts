import { headlines } from "@features/breaking-news/headlines";
import type { APIRoute } from "astro";

export const GET = (({ params }) => {
    const id = Number(params.id);
    const headline = headlines[id];

    if (!headline) {
        return new Response(
            JSON.stringify({
                error: "Not found",
            }),
            {
                status: 404,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }

    return new Response(
        JSON.stringify({
            headline,
        }),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        },
    );
}) satisfies APIRoute;
export function getStaticPaths() {
    return headlines.map((_, index) => ({
        params: {
            id: index.toString(),
        },
    }));
}
