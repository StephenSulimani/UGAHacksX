import { isArticle } from "$lib/article";
import { prisma } from "$lib/db";
import { RetrieveArticle } from "$lib/helpers/fileRetrieval";
import { VerifyCookie } from "$lib/helpers/verifyCookie";
import { PINATA } from "$lib/pinata";
import type { APIResponse } from "$lib/responses";
import { json, type RequestEvent } from "@sveltejs/kit";
import { gzip } from "node-gzip";

export async function GET(event: RequestEvent): Promise<Response> {
    const { params } = event;

    const cid = params.slug;

    if (!cid) {
        const resp: APIResponse<string> = {
            success: 0,
            error: 1,
            message: "CID missing",
        };
        return json(resp, {
            status: 400,
        });
    }

    const db_article = await prisma.article.findFirst({
        where: {
            cid: cid,
        },
    });

    if (!db_article) {
        const resp: APIResponse<string> = {
            success: 0,
            error: 1,
            message: "Invalid CID",
        };
        return json(resp, {
            status: 404,
        });
    }

    const article = await RetrieveArticle(cid);

    if (!article) {
        const resp: APIResponse<string> = {
            success: 0,
            error: 1,
            message: "There was an error fetching this article.",
        };
        return json(resp, {
            status: 500,
        });
    }

    if (db_article.originalId != null) {
        const prev_article = await prisma.article.findFirst({
            where: {
                id: db_article.originalId,
            },
        });
        if (prev_article) {
            article.prevCID = prev_article.cid;
        }
    }

    if (db_article.nextId != null) {
        const next_article = await prisma.article.findFirst({
            where: {
                id: db_article.nextId,
            },
        });
        if (next_article) {
            article.nextCID = next_article.cid;
        }
    }

    const resp: APIResponse<object> = {
        success: 1,
        error: 0,
        message: {
            article,
        },
    };
    return json(resp, { status: 200 });
}

export async function PATCH(event: RequestEvent): Promise<Response> {
    const { params, request, cookies } = event;

    const data = await request.json();

    const cid = params.slug;

    const original_article = await prisma.article.findFirst({
        where: {
            cid: {
                equals: cid,
                mode: "insensitive",
            },
        },
    });

    if (!original_article) {
        const resp: APIResponse<string> = {
            success: 0,
            error: 1,
            message: "This article cannot be located.",
        };
        return json(resp, {
            status: 404,
        });
    }

    const user = await VerifyCookie(cookies);

    if (user instanceof Response) {
        return user;
    }

    if (!isArticle(data)) {
        const resp: APIResponse<string> = {
            success: 0,
            error: 1,
            message: "title, blurb, & text parameters are all required!",
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
                originalId: original_article.id,
                categoryId: original_article.categoryId,
            },
        });

        await prisma.article.update({
            where: {
                id: original_article.id,
            },
            data: {
                nextId: db_file.id,
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
    } catch {
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
