export interface Article {
    title: string;
    author?: string;
    date?: string;
    blurb: string;
    text: string;
    category: string;
    nextCID?: string;
    prevCID?: string;
}

export function isArticle(data: unknown): data is Article {
    return (
        typeof data === "object" &&
        data !== null &&
        typeof (data as Article).title === "string" &&
        typeof (data as Article).blurb === "string" &&
        typeof (data as Article).text === "string" &&
        typeof (data as Article).category === "string"
    );
}
