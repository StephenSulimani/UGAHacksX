<script lang="ts">
    import { isConnected, userAddress } from "$lib/stores/authStore";
    async function Logout(): Promise<boolean> {
        const response = await fetch("/api/logout");

        isConnected.set(false);
        userAddress.set("");

        return response.status == 200;
    }
</script>

<button on:click={Logout}>Logout</button>
