<script>
    import ConnectBtn from "./ConnectBtn.svelte";
    import { isConnected, userAddress, CheckAuth } from "$lib/stores/authStore";
    import LogoutBtn from "./LogoutBtn.svelte";
    import HomeBtn from "./HomeBtn.svelte";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import SearchBar from "./SearchBar.svelte";
    onMount(async () => {
        await CheckAuth();
    });

    function homepage() {
        goto("/");
        return;
    }
</script>

<svelte:head>
    <title>StealthScribe</title>
</svelte:head>

<header class="bg-purple-600 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
        <!--Left side: Stealth Scribe and User-->
        <div class="flex items-center space-x-4 sm:space-x-3">
            <h1 class="text-2xl font-bold">
                <button onclick={homepage}>StealthScribe</button>
            </h1>
            {#if $isConnected}
                <div class="relative group">
                    <div class="w-10 h-10 bg-white rounded-full cursor-pointer flex items-center justify-center text-purple-600 font-bold">
                        {$userAddress.slice(0, 2)}
                    </div>
                    <div class="absolute mt-2 py-2 w-auto bg-white rounded-md shadow-xl z-20 hidden group-hover:block left-1/2 -translate-x-1/2">
                        <p class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            {$userAddress}
                        </p>
                    </div>
                </div>
            {/if}
        </div>
        <!--Right side: Create Article and Connect Wallet-->
        <div class="flex items-center space-x-4 sm:space-x-3">
            <SearchBar />
            {#if $isConnected}
                <a
                    href="/new"
                    class="bg-purple-400 text-whit lg:px-4 py-2 sm:px-2 sm:py-2 rounded-full font-semibold hover:bg-purple-500 transition-colors duration-200 shadow-md">
                    Create Article
                </a>
                <LogoutBtn />
            {:else}
                <ConnectBtn />
            {/if}
        </div>
    </div>
</header>
