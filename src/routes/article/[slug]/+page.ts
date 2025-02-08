import type { Article } from "$lib/article";
import type { RequestEvent } from "@sveltejs/kit";

export interface FullArticle {
    cid: string;
    article: Article;
}

export const load = async (event: RequestEvent) => {
    const { params } = event;
    const resp = await event.fetch(`/api/article/${params.slug}`);

    const j_data = await resp.json();

    const article = j_data.message.article as Article;

    const page_resp: { full_article: FullArticle } = {
        full_article: {
            cid: params.slug!,
            article: article!,
        },
    };

    return page_resp;
};
