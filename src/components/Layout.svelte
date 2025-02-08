<script>
    import Header from "./Header.svelte";
    export let id;
    export let title;
    export let excerpt;
    export let author;
    export let votes;
</script>
  
<div class="min-h-screen bg-background">
    <Header {id} {title} {excerpt} {author} {votes} />
    <main class="container mx-auto px-4 py-8">
        <slot></slot>
    </main>
</div>
