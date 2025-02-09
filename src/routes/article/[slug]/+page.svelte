<script lang="ts">
    import type { PageProps } from "./$types";
    let { data }: PageProps = $props();
    import { isConnected, userAddress } from "$lib/stores/authStore";
    import Header from "../../../components/Header.svelte";
    import { goto, invalidateAll } from "$app/navigation";
    import Comments from "../../../components/Comments.svelte";

    const article = data.full_article.article;
    const cid = data.full_article.cid;

    let editing = $state(false);
    let copied = $state(false);
    /*
    onMount(async () => {
        await VerifyAuth();
        isConnected.subscribe((connected) => {
            if (!connected) {
                goto("/");
                return;
            }
        });
    });
*/
    let title = $state(article.title);
    let description = $state(article.blurb);
    let content = $state(article.text.replace(/\n/g, "<br>"));

    let contentElement: HTMLTextAreaElement | undefined = $state();

    let showModal = $state(false);
    let message = $state("");

    function closeModal() {
        showModal = false;
        goto(`/article/${message}`);
    }

    async function createArticle() {
        const resp = await fetch(`/api/article/${cid}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: title,
                blurb: description,
                text: content,
                category: article.category,
            }),
        });

        const data = await resp.json();

        message = data.message.cid;

        showModal = true;
    }

    // Handle keyboard shortcuts
    function handleKeydown(event: KeyboardEvent) {
        // Check for CTRL + I
        if (event.ctrlKey && event.key === "i") {
            event.preventDefault();
            insertTag("i");
        }

        // Check for CTRL + B
        if (event.ctrlKey && event.key === "b") {
            event.preventDefault();
            insertTag("b");
        }

        // Check for CTRL + U
        if (event.ctrlKey && event.key === "u") {
            event.preventDefault();
            insertTag("u");
        }
    }
    function insertTag(tag: string) {
        const start = contentElement.selectionStart;
        const end = contentElement.selectionEnd;
        const text = contentElement.value;
        const before = text.substring(0, start);
        const after = text.substring(end);
        const selectedText = text.substring(start, end);

        content = `${before}<${tag}>${selectedText}</${tag}>${after}`;

        // Set cursor position after the inserted tag
        setTimeout(() => {
            contentElement.selectionStart = contentElement.selectionEnd =
                start + tag.length + 2 + selectedText.length;
            contentElement.focus();
        }, 0);
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(message);
        copied = true;
    }

    function edit() {
        editing = true;
    }
</script>

<Header />
{#if copied}
    <div
        class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-6 py-3 rounded-md shadow-lg"
    >
        CID copied to clipboard!
    </div>
{/if}

{#if article}
    {#if !editing}
        <div class="max-w-screen mx-auto p-6 bg-white rounded-lg shadow-lg">
            <!-- Title and Edit Btn Wrapper-->
            <div class="flex justify-between items-start">
                <h1 class="text-3xl font-bold text-gray-900">
                    {article.title}
                </h1>
                {#if $userAddress == article.author}
                    <button
                        onclick={edit}
                        class="mt-3 px-4 py-2 text-white bg-blue-500 hover:bg-purple-600 rounded-lg transition-all"
                    >
                        Edit
                    </button>
                {/if}
            </div>
            <!-- Author -->
            <p class="mt-2 text-sm text-gray-600">
                By <span class="font-semibold text-gray-800"
                    >{article.author}</span
                >
            </p>

            <!-- Body -->
            <div class="mt-6 space-y-4 text-lg text-gray-700">
                <p>{@html content}</p>
            </div>
            <div class="flex justify-between p-4">
                <!-- Back button -->
                {#if article.prevCID}
                    <button
                        onclick={() => {
                            invalidateAll();
                            window.location = `/article/${article.prevCID}`;
                        }}
                        class="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition duration-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-5 h-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Previous Version
                    </button>
                {/if}
                {#if article.nextCID}
                    <!-- Next button -->
                    <button
                        onclick={() => {
                            invalidateAll();
                            window.location = `/article/${article.nextCID}`;
                        }}
                        class="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400 transition duration-300"
                    >
                        Next Version
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-5 h-5 ml-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                {/if}
            </div>
        </div>
    {:else}
        {#if showModal}
            <div
                class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
            >
                <div
                    class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-auto overflow-hidden"
                >
                    <h2 class="text-xl font-bold text-center text-green-500">
                        Congratulations!
                    </h2>
                    <h2 class="tex-lg font-bold text-center text-green-500">
                        Article CID:
                    </h2>

                    <p class="mt-2 text-center break-words">{message}</p>
                    <button
                        onclick={copyToClipboard}
                        class="mt-4 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-700 w-full"
                    >
                        Copy CID
                    </button>
                    <button
                        onclick={closeModal}
                        class="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 w-full"
                    >
                        View Article
                    </button>
                </div>
            </div>
        {/if}
        <!--Edit Article-->
        <div
            class="min-h-screen flex items-center justify-center bg-gray-100 p-4"
        >
            <div class="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">
                <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">
                    Edit Article
                </h1>

                <form class="space-y-6">
                    <!-- Title Input -->
                    <div>
                        <label
                            for="title"
                            class="block text-lg font-medium text-gray-700"
                            >Title:</label
                        >
                        <input
                            type="text"
                            id="title"
                            bind:value={title}
                            class="mt-2 block w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter article title"
                        />
                    </div>

                    <!-- Description Input -->
                    <div>
                        <label
                            for="description"
                            class="block text-lg font-medium text-gray-700"
                            >Description</label
                        >
                        <textarea
                            id="description"
                            bind:value={description}
                            class="mt-2 block w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter article description"
                        ></textarea>
                    </div>

                    <!-- Content Input -->
                    <div>
                        <label
                            for="content"
                            class="block text-lg font-medium text-gray-700"
                            >Content:</label
                        >
                        <textarea
                            id="article-content"
                            bind:value={content}
                            bind:this={contentElement}
                            class="mt-2 block w-full h-72 px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Write your article here..."
                            onkeydown={handleKeydown}
                        ></textarea>
                    </div>

                    <!-- Description of Shortcuts -->
                    <div class="text-sm text-gray-500 mt-2">
                        <p class="text-center">
                            You can use <span class="font-semibold"
                                >CTRL + i</span
                            >
                            for
                            <i>italics</i>
                            , <span class="font-semibold">CTRL + b</span> for
                            <b>bold</b> text, and
                            <span class="font-semibold">CTRL + u</span>
                            for <u>underlined</u> text.
                        </p>
                    </div>

                    <!-- Submit Button -->
                    <div class="mt-6">
                        <button
                            onclick={createArticle}
                            type="submit"
                            class="w-full py-3 px-5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                        >
                            Save Article
                        </button>
                    </div>
                </form>
                <!-- Comment Section -->
            </div>
        </div>
    {/if}
    {#if !editing}
        <Comments {cid} />
    {/if}
{/if}
