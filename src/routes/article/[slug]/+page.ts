import type { Article } from "$lib/article";
import type { RequestEvent } from "@sveltejs/kit";

export const load = async (event: RequestEvent) => {
    const { params } = event;
    const resp = await event.fetch(`/api/article/${params.slug}`);

    const j_data = await resp.json();

    const article = j_data.message.article as Article;

    const page_resp: { article: Article } = {
        article,
    };

    return page_resp;
};
