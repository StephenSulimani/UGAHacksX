import { prisma } from "$lib/db";
import { VerifyCookie } from "$lib/helpers/verifyCookie";
import { createJWT, verifyJWT, type AuthPayload } from "$lib/jwt";
import type { APIResponse } from "$lib/responses";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
    const { cookies } = event;

    const user = await VerifyCookie(cookies);

    if (user instanceof Response) {
        return user;
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
