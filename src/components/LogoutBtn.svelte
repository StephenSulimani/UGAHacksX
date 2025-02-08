<script lang="ts">
    import { isConnected, userAddress } from "$lib/stores/authStore";
    async function Logout(): Promise<boolean> {
        const response = await fetch("/api/logout");

        isConnected.set(false);
        userAddress.set("");

        return response.status == 200;
    }
</script>

<button
    on:click={Logout}
    class="bg-red-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-600 transition-colors duration-200 shadow-md"
>
    Logout
</button>
