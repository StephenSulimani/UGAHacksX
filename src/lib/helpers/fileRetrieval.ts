import type { Article } from "$lib/article";
import { PINATA } from "$lib/pinata";
import pkg from "node-gzip";

export async function RetrieveArticle(cid: string): Promise<Article | false> {
    const { ungzip } = pkg;
    try {
        const data = await PINATA.gateways.get(cid);
        const blob = data.data! as Blob;
        const buffer = Buffer.from(await blob.arrayBuffer());
        const extracted = await ungzip(buffer);

        const data_obj = extracted.toString();

        const article = JSON.parse(data_obj) as Article;

        return article;
    } catch {
        return false;
    }
}
