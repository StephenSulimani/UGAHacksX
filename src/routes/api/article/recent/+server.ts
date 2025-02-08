import { prisma } from "$lib/db";
import type { APIResponse } from "$lib/responses";
import { json } from "@sveltejs/kit";

export async function GET(): Promise<Response> {
    try {
        const articles = await prisma.article.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
        });

        const article_list = articles.map((a) => a.cid);

        const resp: APIResponse<object> = {
            success: 1,
            error: 0,
            message: {
                articles: article_list,
            },
        };

        return json(resp, {
            status: 200,
        });
    } catch {
        const resp: APIResponse<string> = {
            success: 0,
            error: 1,
            message: "There was an error fetching articles.",
        };
        return json(resp, { status: 500 });
    }
}
