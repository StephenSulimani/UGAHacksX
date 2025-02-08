<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import HomeButton from "../../components/HomeButton.svelte";

    let article = "";
    let articleId = "";
    let isLoading = true;

    // Extract article ID from URL params
    $: articleId = $page.params.id;

    // Fetch article details from an API or mock data
    onMount(async () => {
        try {
            const res = await fetch(`/api/articles/${articleId}`);
            const result = await res.json();

            if (!result.success) throw new Error("Failed to load article");
            
            article = await result.article;
        } catch (error) {
            console.error("Error fetching article:", error);
        } finally {
            isLoading = false;
        }
    });

    const goBack = () => {
        goto("/articles");
    };
</script>

{#if isLoading}
    <p class="text-center text-gray-500 mt-10">Loading article...</p>
{:else if !article}
    <p class="text-center text-red-500 mt-10">Article not found.</p>
{:else}
    <div class="max-w-3xl mx-auto p-6">
        <!-- Home Button -->
        <HomeButton />

        <!-- Back to Articles -->
        <button 
            class="mt-4 text-blue-500 hover:underline" 
            on:click={goBack}>
            ← Back to Articles
        </button>

        <!-- Article Title -->
        <h1 class="text-4xl font-bold mt-6">{article.title}</h1>

        <!-- Author and Date -->
        <p class="text-gray-600 mt-2">
            By <span class="font-semibold">{article.author}</span> | Published on {article.date}
        </p>

        <!-- Article Content -->
        <div class="mt-6 text-lg leading-relaxed">
            {@html article.content} 
        </div>

        <!-- Like and Comment Section -->
        <div class="flex items-center gap-6 mt-6">
            <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                👍 Like ({article.likes})
            </button>
            <button class="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400">
                💬 Comments ({article.comments.length})
            </button>
        </div>

        <!-- Social Sharing -->
        <div class="mt-6 flex gap-4">
            <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Share on Twitter
            </button>
            <button class="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900">
                Share on Facebook
            </button>
        </div>

        <!-- Related Articles -->
        <div class="mt-10">
            <h2 class="text-2xl font-semibold mb-4">Related Articles</h2>
            <ul class="list-disc pl-5 text-blue-500">
                {#each article.related as relatedArticle}
                    <li>
                        <a href="/article/{relatedArticle.id}" class="hover:underline">
                            {relatedArticle.title}
                        </a>
                    </li>
                {/each}
            </ul>
        </div>
    </div>
{/if}
