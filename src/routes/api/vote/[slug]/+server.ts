import { prisma } from "$lib/db";
import type { APIResponse } from "$lib/responses";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent) {
    const { params } = event;

    const cid = params.slug;

    if (!cid) {
        const resp: APIResponse<string> = {
            success: 0,
            error: 1,
            message: "Invalid CID!",
        };
        return json(resp, {
            status: 404,
        });
    }

    const article = await prisma.article.findFirst({
        where: {
            cid: cid,
        },
    });

    if (!article) {
        const resp: APIResponse<string> = {
            success: 0,
            error: 1,
            message: "Invalid CID!",
        };
        return json(resp, {
            status: 404,
        });
    }

    const votes = await prisma.vote.findMany({
        where: {
            articleId: article.id,
        },
    });

    let score = 0;

    for (const vote of votes) {
        score += vote.score;
    }

    const resp: APIResponse<object> = {
        success: 1,
        error: 0,
        message: {
            score: score,
        },
    };
    return json(resp, {
        status: 200,
    });
}
