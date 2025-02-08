import { prisma } from "$lib/db";
import type { APIResponse } from "$lib/responses";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
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

    const comments = await prisma.comment.findMany({
        where: {
            articleId: article.id,
        },
    });

    const formatted_comments: object[] = [];

    for (const c of comments) {
        const commenter = await prisma.user.findFirst({
            where: {
                id: c.userId,
            },
        });

        if (!commenter) {
            continue;
        }

        formatted_comments.push({
            message: c.message,
            address: commenter.address,
        });
    }

    const resp: APIResponse<object> = {
        success: 1,
        error: 0,
        message: {
            comments: formatted_comments,
        },
    };
    return json(resp, {
        status: 200,
    });
}
