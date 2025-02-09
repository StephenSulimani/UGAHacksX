import { prisma } from "$lib/db";
import { VerifyCookie } from "$lib/helpers/verifyCookie";
import { verifyJWT } from "$lib/jwt";
import type { APIResponse } from "$lib/responses";
import { json, type RequestEvent } from "@sveltejs/kit";

export interface VoteRequest {
    cid: string;
    vote: number;
}

function isVoteRequest(data: unknown): data is VoteRequest {
    return (
        typeof data === "object" &&
        data !== null &&
        typeof (data as VoteRequest).cid === "string" &&
        typeof (data as VoteRequest).vote === "number"
    );
}

export async function POST(event: RequestEvent): Promise<Response> {
    const { request, cookies } = event;

    const user = await VerifyCookie(cookies);

    if (user instanceof Response) {
        return user;
    }

    const data = await request.json();

    if (!isVoteRequest(data)) {
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

    let score = 0;

    if (data.vote >= 1) {
        score = 1;
    } else if (data.vote <= -1) {
        score = -1;
    } else {
        score = 0;
    }


    const existingVote = await prisma.vote.findFirst({
        where: {
            userId: user.id,
            articleId: article.id,
        },
    });

    if (existingVote) {
        await prisma.vote.update({
            where: {
                id: existingVote.id,
            },
            data: {
                score: score,
            },
        });
        const resp: APIResponse<string> = {
            success: 1,
            error: 0,
            message: "Your vote has been received!",
        };
        return json(resp, { status: 200 });
    }

    const vote = await prisma.vote.create({
        data: {
            userId: user.id,
            articleId: article.id,
            score: score,
        },
    });

    if (!vote) {
        const resp: APIResponse<string> = {
            success: 0,
            error: 1,
            message: "There was an error recording your vote.",
        };
        return json(resp, {
            status: 400,
        });
    }

    const resp: APIResponse<string> = {
        success: 1,
        error: 0,
        message: "Your vote has been recorded!",
    };
    return json(resp, {
        status: 200,
    });
}
