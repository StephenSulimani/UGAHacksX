<script lang="ts">
    import type { PageProps } from "./$types";
    let { data }: PageProps = $props();
    import EditBtn from "../../../components/EditBtn.svelte";
    import { userAddress } from "$lib/stores/authStore";
    import Header from "../../../components/Header.svelte";

    const article = data.article;
</script>

<Header />
{#if article}
    <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <!-- Title and Edit Btn Wrapper-->
        <div class="flex justify-between items-start">
            <h1 class="text-3xl font-bold text-gray-900">{article.title}</h1>
            {#if $userAddress == article.author}
                <EditBtn editUrl={`/edit/${article.id}`} />
            {/if}
        </div>
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
