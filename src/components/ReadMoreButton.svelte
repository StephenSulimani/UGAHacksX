<script lang="ts">
    import { onMount } from "svelte";
    import Home from "./HomeBtn.svelte";
  
    export let title: string = "My One and Only Article";
    export let author: string = "The Sole Author";
    export let date: string = "2025-02-08";
    export let blurb: string = "This articleis the first one.";
    export let text: string = "This is my only article, and this is the body of the text.";
    
    let article = null;
    let isLoading = true;
    let error = null;
  
    onMount(async () => {
      const mockArticle = {
        title,
        author,
        date,
        text,
      };

      setTimeout(() => {
        article = mockArticle;
        isLoading = false;
      }, 500);
    });
</script>

<main class="max-w-3xl mx-auto p-6">
    {#if isLoading}
        <p class="text-center">Loading article...</p>
    {:else if error}
        <p class="text-center text-red-500">{error}</p>
    {:else}
        <h1 class="text-3xl font-bold mb-4">{title}</h1>
        <p class="text-gray-600 mb-2">By {author} • {new Date(date).toLocaleDateString()}</p>
        <div class="border-b mb-4"></div>
        <p class="text-lg leading-relaxed">{text}</p>
    {/if}
</main>
