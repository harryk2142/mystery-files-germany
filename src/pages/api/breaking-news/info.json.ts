import { headlines } from "@features/breaking-news/headlines.ts";
import type { APIRoute } from "astro";

export const GET = (() => {
    return new Response(
        JSON.stringify({
            total: headlines.length,
        }),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        },
    );
}) satisfies APIRoute;
