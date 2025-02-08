<script lang="ts">
    import { goto } from "$app/navigation";

    export let destination: string = "/"; // Default to home page

    const navigate = () => {
        goto(destination);
    };
</script>

<!--<button 
    class="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400" 
    on:click={navigate}>
    ← Home
</button>
-->