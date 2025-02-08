<script lang="ts">
    import { onMount } from "svelte";
    import wallet from "../../components/ConnectWallet.svelte";
    import { isConnected, userAddress } from "$lib/stores/authStore";
    import { goto } from "$app/navigation";
    import Header from "../../components/Header.svelte";

    isConnected.subscribe(() => {
        if (!$isConnected) {
            goto("/");
        }
    });

    onMount(async () => {
        if ($isConnected == false) {
            goto("/");
            return;
        }
    });

    let title: string = "";
    let author: string = "";
    let date: string = new Date().toISOString().split("T")[0];
    let blurb: string = "";
    let text: string = "";
    let category: string = "";
    let isSubmitting: boolean = false;
    let successMessage: string | null = null;
    let errorMessage: string | null = null;

    const handleSubmit = async (event: Event) => {
        event.preventDefault();
        isSubmitting = true;
        successMessage = null;
        errorMessage = null;

        // Validate form fields
        if (!title || !category || !blurb || !text) {
            errorMessage = "Please fill out all fields";
            isSubmitting = false;
            return;
        }

        try {
            const response = await fetch("/arc/submit-form", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    author,
                    category,
                    date,
                    blurb,
                    text,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit article");
            }

            const data = await response.json();
            console.log("Form submission response:", data);
            successMessage = "Article submitted successfully!";
            title = "";
            blurb = "";
            text = "";
            category = "";
        } catch (error) {
            console.error(error);
            errorMessage = "Failed to submit article";
        } finally {
            isSubmitting = false;
        }
    };
</script>

<Header id="" title="" author="" excerpt="" category=""/>
<form
    on:submit={handleSubmit}
    class="p-4 border rounded-md shadow-md max-w-md mx-auto"
>
    <h2 class="text-xl font-semibold mb-4">Submit Your Information</h2>

    <!-- Title Input -->
    <div class="mb-4">
        <label for="title" class="block text-sm font-medium text-gray-700"
            >Title</label
        >
        <input
            type="text"
            id="title"
            bind:value={title}
            class="mt-1 p-2 border rounded w-full"
            required
        />
    </div>

    <!--Category Input-->
    <div class="mb-4">
        <label for="category" class="block text-sm font-medium text-gray-700"
            >Category</label
        >
        <input
            type="text"
            id="category"
            bind:value={category}
            class="mt-1 p-2 border rounded w-full"
            required
        />

    <!-- Blurb Input -->
    <div class="mb-4">
        <label for="blurb" class="block text-sm font-medium text-gray-700"
            >blurb</label
        >
        <input
            type="blurb"
            id="blurb"
            bind:value={blurb}
            class="mt-1 p-2 border rounded w-full"
            required
        />
    </div>

    <!-- Message Input -->
    <div class="mb-4">
        <label for="text" class="block text-sm font-medium text-gray-700"
            >text</label
        >
        <textarea
            id="text"
            bind:value={text}
            class="mt-1 p-2 border rounded w-full"
            rows="4"
            required
        ></textarea>
    </div>

    <!-- Error and Success Messages -->
    {#if errorMessage}
        <p class="text-red-500">{errorMessage}</p>
    {/if}
    {#if successMessage}
        <p class="text-green-500">{successMessage}</p>
    {/if}

    <!-- Submit Button -->
    <button
        type="submit"
        class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={isSubmitting}
    >
        {#if isSubmitting}
            Submitting...
        {:else}
            Submit
        {/if}
    </button>
</form>

