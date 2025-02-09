import { prisma } from "$lib/db";
import { VerifyCookie } from "$lib/helpers/verifyCookie";
import type { APIResponse } from "$lib/responses";
import { json, type RequestEvent } from "@sveltejs/kit";

export interface CommentRequest {
    cid: string;
    message: string;
}

function isCommentRequest(data: unknown): data is CommentRequest {
    return (
        typeof data === "object" &&
        data !== null &&
        typeof (data as CommentRequest).cid === "string" &&
        typeof (data as CommentRequest).message === "string"
    );
}

export async function POST(event: RequestEvent): Promise<Response> {
    const { request, cookies } = event;

    const user = await VerifyCookie(cookies);

    if (user instanceof Response) {
        return user;
    }

    const data = await request.json();

    if (!isCommentRequest(data)) {
        const resp: APIResponse<string> = {
            success: 0,
            error: 1,
            message: "cid & vote are required fields!",
        };
        return json(resp, {
            status: 400,
        });
    }

    const article = await prisma.article.findFirst({
        where: {
            cid: data.cid,
        },
    });

    if (!article) {
        const resp: APIResponse<string> = {
            success: 0,
            error: 1,
            message: "Invalid cid",
        };
        return json(resp, {
            status: 400,
        });
    }

    const comment = await prisma.comment.create({
        data: {
            userId: user.id,
            articleId: article.id,
            message: data.message,
        },
    });

    if (!comment) {
        const resp: APIResponse<string> = {
            success: 0,
            error: 1,
            message: "There was an error recording your comment.",
        };
        return json(resp, {
            status: 400,
        });
    }

    const resp: APIResponse<string> = {
        success: 1,
        error: 0,
        message: "Your comment has been recorded!",
    };
    return json(resp, {
        status: 200,
    });
}
