<script lang="ts">
    import { goto } from "$app/navigation";

    export let destination: string = "/"; // Default to home page

    const navigate = () => {
        goto(destination);
    };
</script>