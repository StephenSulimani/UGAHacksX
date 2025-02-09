<script lang="ts">
    import Header from "../components/Header.svelte";
    import ArticleCard from "../components/ArticleCard.svelte";
    import { page } from '$app/stores';
    import type { Article } from "$lib/article";
    import { onMount } from "svelte";
    import type { FullArticle } from "./+page";
    import type { PageProps } from "./$types";
    let { data }: PageProps = $props();

    const full_articles = data.full_articles;

    console.log()

    onMount(() => {
        console.log(full_articles)
    })
</script>

<Header />
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 mx-auto max-w-screen-lg">
    {#each full_articles as article}
        <ArticleCard
            cid={article.cid}
            title={article.article.title}
            category={article.article.category}
            blurb={article.article.blurb}
            author={article.article.author}
        />
    {/each}
</div>
