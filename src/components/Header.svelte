<script>
    import ConnectBtn from "./ConnectBtn.svelte";
    import { isConnected, userAddress } from "$lib/stores/authStore";
    import LogoutBtn from "./LogoutBtn.svelte";
    import HomeBtn from "./HomeBtn.svelte";
</script>

<header class="bg-purple-600 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">Fiesta</h1>
        {#if $isConnected}
            <div class="relative group">
                <div
                    class="w-10 h-10 bg-white rounded-full cursor-pointer flex items-center justify-center text-purple-600 font-bold"
                >
                    {$userAddress.slice(0, 2)}
                </div>
                <div
                    class="absolute mt-2 py-2 w-auto bg-white rounded-md shadow-xl z-20 hidden group-hover:block left-1/2 -translate-x-1/2"
                >
                    <p
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        {$userAddress}
                    </p>
                </div>
            </div>
            <a href="/new" class="bg-purple-400 text-white px-4 py-2 rounded-full font-semibold hover:bg-purple-500 transition-colors duration-200 shadow-md">Create Article</a>
            <LogoutBtn />
        {:else}
            <ConnectBtn />
        {/if}
    </div>
</header>
