import { prisma } from "$lib/db";
import { createJWT, verifyJWT, type AuthPayload } from "$lib/jwt";
import type { APIResponse } from "$lib/responses";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
    const { cookies } = event;

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

    const payload: AuthPayload = {
        address: user.address,
    };

    const jwt = await createJWT(payload);

    let tokenCookie = `authToken=${jwt}; HttpOnly; Path=/; Max-Age=86400;`; // Add Secure

    if (process.env.NODE_ENV === "production") {
        tokenCookie += " Secure";
    }

    const resp: APIResponse<object> = {
        success: 1,
        error: 0,
        message: {
            address: payload.address,
        },
    };

    return json(resp, {
        status: 200,
        headers: {
            "Set-Cookie": tokenCookie,
        },
    });
}
