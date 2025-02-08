import type { APIResponse } from "$lib/responses";
import { json, type RequestEvent } from "@sveltejs/kit";
import { verifyJWT } from "$lib/jwt";
import { prisma } from "$lib/db";
import { isArticle } from "$lib/article";
import { gzip } from "node-gzip";
import { PINATA } from "$lib/pinata";

export async function POST(event: RequestEvent): Promise<Response> {
    const { request, cookies } = event;

    const data = await request.json();

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

    if (!isArticle(data)) {
        const resp: APIResponse<string> = {
            success: 0,
            error: 1,
            message: "title, data, blurb, & text parameters are all required!",
        };
        return json(resp, {
            status: 400,
        });
    }

    data.author = verification.address;
    data.date = new Date().toISOString();

    const data_str = JSON.stringify(data);

    const compressed = await gzip(data_str);

    const file = new File([compressed], "Article.gz", {
        type: "application/gzip",
    });

    try {
        const upload = await PINATA.upload.file(file);
        const db_file = await prisma.article.create({
            data: {
                cid: upload.IpfsHash,
                userId: user.id,
            },
        });

        if (db_file !== null) {
            const resp: APIResponse<object> = {
                success: 1,
                error: 0,
                message: {
                    cid: db_file.cid,
                },
            };
            return json(resp, {
                status: 200,
            });
        }

        const resp: APIResponse<string> = {
            success: 0,
            error: 1,
            message: "There was an unknown error uploading the article.",
        };
        return json(resp, {
            status: 500,
        });
    } catch (e) {
        console.log(e);
        const resp: APIResponse<string> = {
            success: 0,
            error: 1,
            message: "There was an unknown error uploading the article. (Pinata)",
        };
        return json(resp, {
            status: 500,
        });
    }
}
