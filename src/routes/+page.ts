import type { Article } from "$lib/article";
import type { RequestEvent } from "@sveltejs/kit";

export interface FullArticle  {
    cid: string;
    article: Article;
}

export const load = async (event: RequestEvent) => {
    const resp = await event.fetch(`/api/article/recent`);

    const j_data = await resp.json();

    const article_cids = j_data.message.articles as string[];

    const articles: FullArticle[] = [];

    for (let cid of article_cids) {
        const resp = await event.fetch(`/api/article/${cid}`);
        const j_data = await resp.json();
        const article = j_data.message.article as Article;
        articles.push({cid, article});
    }

    const page_resp: { full_articles: FullArticle[] } = {
        full_articles: articles,
    };

    console.log(page_resp)

    return page_resp;
};