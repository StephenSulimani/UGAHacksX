import { prisma } from "$lib/db";
import { RetrieveArticle } from "$lib/helpers/fileRetrieval";
import type { APIResponse } from "$lib/responses";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
    const { params } = event;

    const cid = params.slug;

    if (!cid) {
        const resp: APIResponse<string> = {
            success: 0,
            error: 1,
            message: "CID missing",
        };
        return json(resp, {
            status: 400,
        });
    }

    const db_article = await prisma.article.findFirst({
        where: {
            cid: cid,
        },
    });

    if (!db_article) {
        const resp: APIResponse<string> = {
            success: 0,
            error: 1,
            message: "Invalid CID",
        };
        return json(resp, {
            status: 404,
        });
    }

    const article = await RetrieveArticle(cid);

    if (!article) {
        const resp: APIResponse<string> = {
            success: 0,
            error: 1,
            message: "There was an error fetching this article.",
        };
        return json(resp, {
            status: 500,
        });
    }

    console.log(article);

    const resp: APIResponse<object> = {
        success: 1,
        error: 0,
        message: {
            article,
        },
    };
    return json(resp, { status: 200 });
}
