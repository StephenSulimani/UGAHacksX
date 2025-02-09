<script lang="ts">
    import { onMount } from "svelte";
    import Header from "./Header.svelte";
    import { ThumbsUp, ThumbsDown, Newspaper } from "lucide-svelte";

    let { cid, title, blurb, author, category } = $props();

    let date = new Date().toISOString();

    let voteCount = $state(0);
    let userVote = $state(0);

    onMount(async () => {
        await fetchVoteCount();
    });

    async function fetchVoteCount() {
        try {
            const response = await fetch(`/api/vote/${cid}`, {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();

            if (response.status == 200) {
                voteCount = data.message.score;
                userVote = data.message.userVote;
            }
        } catch (error) {
            console.error(error);
        }
    }
    async function vote(voteValue) {
        try {
            const response = await fetch(`/api/vote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cid,
                    vote: voteValue,
                }),
            });

            const data = await response.json();
            if (response.status == 200) {
                if (userVote === voteValue) {
                    userVote = data.message.userVote;
                    voteCount = data.message.score;
                }
            }
            await fetchVoteCount();
        } catch (error) {
            console.error(error);
        }

        fetchVoteCount();
    }
</script>

<div
    class="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden max-w-sm flex flex-col"
>
    <div class="p-6">
        <!-- Category tag -->
        <span
            class="inline-block px-3 py-1 text-xs font-medium bg-purple-100 text-purple-600 rounded-full mb-4 w-auto"
        >
            {category}
        </span>

        <!-- Title -->
        <h2
            class="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-purple-600 transition-colors"
        >
            {title}
        </h2>

        <!-- Blurb -->
        <p class="text-gray-600 text-sm mb-4 line-clamp-3">
            {blurb}
        </p>

        <!-- Author and date section -->
        <div class="flex-grow mb-4 mt-auto">
            <!-- Author info -->
            <div class="flex-1">
                <div class="relative group">
                    <div
                        class="w-10 h-10 bg-purple-200 rounded-full cursor-pointer flex items-center justify-center text-purple-600 font-bold"
                    >
                        {author.slice(0, 2)}
                    </div>
                    <div
                        class="absolute mt-2 py-2 w-auto bg-white rounded-md shadow-xl z-20 hidden group-hover:block left-1/2 -translate-x-1/2"
                    >
                        <p
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            {author}
                        </p>
                    </div>
                </div>
                <div class="text-xs text-gray-500">
                    {new Date(date).toLocaleDateString()}
                </div>
            </div>
        </div>

        <!-- Votes and Read More -->
        <div class="mt-auto flex items-center justify-between gap-4">
            <div
                class=" inline-flex items-center w-full gap-2 bg-gray-100 rounded-lg px-1 py-2"
            >
                <button
                    class="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    onclick={() => vote(1)}
                    disabled={userVote === 1}
                >
                    <ThumbsUp class="h-4 w-4 text-gray-600 " />
                </button>
                <span
                    class="text-sm font-medium text-gray-600 min-w-[2rem] text-center"
                >
                    {voteCount} votes
                </span>
                <button
                    class="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    onclick={() => vote(-1)}
                    disabled={userVote === -1}
                >
                    <ThumbsDown class="h-4 w-4 text-gray-600" />
                </button>
            </div>

            <a
                href={`/article/${cid}`}
                class="inline-flex items-center justify-center w-full px-2 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-300 group"
            >
                Read More
                <svg
                    class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                </svg>
            </a>
        </div>
    </div>

</div>
