<script lang="ts">
    import type { PageProps } from "./$types";
    let { data }: PageProps = $props();

    const article = data.article;
</script>

{#if article}
    <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <!-- Title -->
        <h1 class="text-3xl font-bold text-gray-900">{article.title}</h1>

        <!-- Author -->
        <p class="mt-2 text-sm text-gray-600">
            By <span class="font-semibold text-gray-800">{article.author}</span>
        </p>

        <!-- Body -->
        <div class="mt-6 space-y-4 text-lg text-gray-700">
            <p>{article.text}</p>
        </div>
    </div>
{/if}
