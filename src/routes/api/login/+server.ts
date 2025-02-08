import type { APIResponse } from "$lib/responses";
import { json, type RequestEvent } from "@sveltejs/kit";
import { verifyMessage } from "ethers";
import { prisma } from "$lib/db";
import { createJWT, type AuthPayload } from "$lib/jwt";

interface RegisterRequest {
    address: string;
    nonce: string;
    signature: string;
}

function isRegisterRequest(data: unknown): data is RegisterRequest {
    return (
        typeof data === "object" &&
        data != null &&
        typeof (data as RegisterRequest).nonce === "string" &&
        typeof (data as RegisterRequest).address === "string" &&
        typeof (data as RegisterRequest).signature === "string"
    );
}

export async function POST(event: RequestEvent): Promise<Response> {
    const { request } = event;

    const data = request.json();

    if (!isRegisterRequest(data)) {
        const resp: APIResponse<string> = {
            success: 0,
            error: 1,
            message: "address, signature, & nonce are required fields!",
        };
        return json(resp, { status: 400 });
    }

    const message = `Please sign: ${data.nonce}`;

    try {
        const signerAddress = verifyMessage(message, data.signature);

        if (signerAddress.toLowerCase() !== data.address.toLowerCase()) {
            // Signature Verification Failed!
            const resp: APIResponse<string> = {
                success: 0,
                error: 1,
                message: "Signature verification failed!",
            };
            return json(resp, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: {
                address: {
                    equals: data.address.toLowerCase(),
                    mode: "insensitive",
                },
            },
        });

        if (user !== null) {
            const payload: AuthPayload = {
                address: user.address,
            };

            const jwt = await createJWT(payload);

            let tokenCookie = `authToken=${jwt}; HttpOnly; Path=/; Max-Age=86400;`; // Add Secure

            if (process.env.NODE_ENV === "production") {
                tokenCookie += " Secure";
            }

            const resp: APIResponse<string> = {
                success: 1,
                error: 0,
                message: "Successfully logged in!",
            };

            return json(resp, {
                status: 200,
                headers: {
                    "Set-Cookie": tokenCookie,
                },
            });
        }

        try {
            const new_user = await prisma.user.create({
                data: {
                    address: data.address.toLowerCase(),
                },
            });

            const payload: AuthPayload = {
                address: new_user.address,
            };

            const jwt = await createJWT(payload);

            let tokenCookie = `authToken=${jwt}; HttpOnly; Path=/; Max-Age=86400;`; // Add Secure

            if (process.env.NODE_ENV === "production") {
                tokenCookie += " Secure";
            }

            const resp: APIResponse<string> = {
                success: 1,
                error: 0,
                message: "Successfully logged in!",
            };

            return json(resp, {
                status: 200,
                headers: {
                    "Set-Cookie": tokenCookie,
                },
            });
        } catch {
            // DB Creation Error
            const resp: APIResponse<string> = {
                success: 0,
                error: 1,
                message: "There was an error logging in.",
            };
            return json(resp, { status: 500 });
        }
    } catch {
        // Signature Verification Failed!
        const resp: APIResponse<string> = {
            success: 0,
            error: 1,
            message: "Signature verification failed!",
        };
        return json(resp, { status: 400 });
    }
}
