<script lang="ts">
    import { page } from '$app/stores';
    import ReadMoreButton from '../../components/ReadMoreButton.svelte';

    let article = null;
    let isLoading = true;
    let error = null;

    onMount(async () => {
        const articleId = $page.params.id; // Get the ID from the URL parameter

        try {
            // Fetch article data based on articleId. Replace this with your actual data fetching logic.
            const res = await fetch(`/api/articles/${articleId}`); // Example API call
            const result = await res.json();
            if(!result.success) throw new Error(result.message);
            article = result.article;
        } catch (err) {
            error = err.message;
        } finally {
            isLoading = false;
        }
    });
</script>

{#if isLoading}
    <p>Loading...</p>
{:else if error}
    <p>{error}</p>
{:else}
    <ReadMoreButton 
        title={article.title} 
        author={article.author} 
        date={article.date} 
        text={article.text} 
    />
{/if}