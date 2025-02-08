<script lang="ts">
    import Header from "../../components/Header.svelte";
    import { isConnected } from "$lib/stores/authStore";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    onMount(() => {
        isConnected.subscribe((connected) => {
            if (!connected) {
                goto("/");
                return;
            }
        });
    });

    let title = "";
    let description = "";
    let category = "";
    let content = "";
    let contentElement: HTMLTextAreaElement;

    let showModal = false;
    let message = "";

    function closeModal() {
        showModal = false;
    }

    async function createArticle() {
        const resp = await fetch("/api/article", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: title,
                category: category,
                blurb: description,
                text: content,
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
    }
</script>

<Header />
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
                on:click={copyToClipboard}
                class="mt-4 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-700 w-full"
            >
                Copy CID
            </button>
            <button
                on:click={closeModal}
                class="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 w-full"
            >
                Dismiss
            </button>
        </div>
    </div>
{/if}
<div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">
        <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">
            Create New Article
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

            <!-- Category Input -->
            <div>
                <label
                    for="category"
                    class="block text-lg font-medium text-gray-700"
                    >Category:</label
                >
                <input
                    type="text"
                    id="category"
                    bind:value={category}
                    class="mt-2 block w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter article category"
                />
            </div>

            <!-- Description Input -->
            <div>
                <label
                    for="description"
                    class="block text-lg font-medium text-gray-700"
                    >Description:</label
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
                    on:keydown={handleKeydown}
                ></textarea>
            </div>

            <!-- Description of Shortcuts -->
            <div class="text-sm text-gray-500 mt-2">
                <p class="text-center">
                    You can use <span class="font-semibold">CTRL + i</span> for
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
                    on:click={createArticle}
                    type="submit"
                    class="w-full py-3 px-5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                    Create Article
                </button>
            </div>
        </form>
    </div>
</div>

<style>
    /* You can add custom styles here if needed */
</style>
