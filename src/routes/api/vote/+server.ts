import { prisma } from "$lib/db";
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

    const authCookie = cookies.get("authToken");

    if (!authCookie) {
        const resp: APIResponse<string> = {
            success: 0,
            error: 1,
            message: "authToken missing!",
        };
        return json(resp, {
            status: 400,
        });
    }

    const verification = await verifyJWT(authCookie);

    if (!verification) {
        const resp: APIResponse<string> = {
            success: 0,
            error: 1,
            message: "Invalid authToken!",
        };
        return json(resp, {
            status: 400,
        });
    }

    const user = await prisma.user.findFirst({
        where: {
            address: {
                equals: verification.address,
                mode: "insensitive",
            },
        },
    });

    if (user == null) {
        const resp: APIResponse<string> = {
            success: 0,
            error: 1,
            message: "Invalid authToken!",
        };
        return json(resp, {
            status: 400,
        });
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

    if (data.vote > 1) {
        score = 1;
    } else if (data.vote < -1) {
        score = 1;
    } else {
        score = 0;
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
