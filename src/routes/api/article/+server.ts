import type { APIResponse } from "$lib/responses";
import { json, type RequestEvent } from "@sveltejs/kit";
import { verifyJWT } from "$lib/jwt";
import { prisma } from "$lib/db";
import { isArticle } from "$lib/article";
import { gzip } from "node-gzip";
import { PINATA } from "$lib/pinata";
import { VerifyCookie } from "$lib/helpers/verifyCookie";

export async function POST(event: RequestEvent): Promise<Response> {
    const { request, cookies } = event;

    const data = await request.json();

    const user = await VerifyCookie(cookies);

    if (user instanceof Response) {
        return user;
    }

    if (!isArticle(data)) {
        const resp: APIResponse<string> = {
            success: 0,
            error: 1,
            message: "title, blurb, text, & category parameters are all required!",
        };
        return json(resp, {
            status: 400,
        });
    }

    const found_category = await prisma.category.findFirst({
        where: {
            name: data.category,
        },
    });

    if (!found_category) {
        const resp: APIResponse<string> = {
            success: 0,
            error: 1,
            message: "Invalid category name!",
        };
        return json(resp, {
            status: 400,
        });
    }

    data.author = user.address;
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
                categoryId: found_category.id,
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
