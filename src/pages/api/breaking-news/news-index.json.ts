import { headlines } from "@features/breaking-news/headlines";

export async function GET() {
    return new Response(JSON.stringify(headlines), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
