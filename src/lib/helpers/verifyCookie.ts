import { prisma } from "$lib/db";
import { verifyJWT } from "$lib/jwt";
import type { APIResponse } from "$lib/responses";
import { json, type Cookies } from "@sveltejs/kit";
export type User = { id: string; address: string };

export async function VerifyCookie(cookies: Cookies): Promise<Response | User> {
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
    return user;
}
