<script lang="ts">
  import { onMount } from 'svelte';

  export let cid: string; // Article CID passed as a prop

  interface Comment {
    message: string;
    address: string;
  }

  interface APIResponse<T> {
    success: number;
    error: number;
    message: T;
  }

  let comments: Comment[] = [];
  let newComment: string = '';
  let isLoading = true;
  let error = '';

  // Fetch comments
  async function fetchComments() {
    try {
      const response = await fetch(`/api/comment/${cid}`);
      const data: APIResponse<{comments: Comment[]}> = await response.json();
      
      if (data.error) {
        error = typeof data.message === 'string' ? data.message : 'Error fetching comments';
        return;
      }

      comments = data.message.comments;
    } catch (e) {
      return;
    } finally {
      isLoading = false;
    }
  }

  // Submit new comment
  async function handleSubmitComment() {
    if (!newComment.trim()) return;

    try {
      const response = await fetch('/api/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cid: cid,
          message: newComment
        })
      });

      const data: APIResponse<string> = await response.json();

      if (data.error) {
        error = data.message;
        return;
      }

      // Refresh comments after successful submission
      await fetchComments();
      newComment = '';
    } catch (e) {
      error = 'Error submitting comment';
    }
  }

  onMount(() => {
    fetchComments();
  });
</script>

<div class="max-w-2xl mx-auto p-4">
  <!-- Error Display -->
  {#if error}
    <div class="mb-4 p-2 bg-red-100 text-red-700 rounded">
      {error}
    </div>
  {/if}

  <!-- Comment Form -->
  <div class="mb-6 space-y-2">
    <textarea
      bind:value={newComment}
      placeholder="Write your comment..."
      class="w-full p-2 border rounded-lg"
      rows="3"
    ></textarea>
    <button
      on:click={handleSubmitComment}
      disabled={!newComment.trim()}
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Add Comment
    </button>
  </div>

  <!-- Comments List -->
  {#if isLoading}
    <div class="text-center text-gray-500">Loading comments...</div>
  {:else}
    <div class="space-y-4">
      {#each comments as comment}
        <div class="p-4 border rounded-lg">
          <div class="flex justify-between mb-2">
            <span class="font-semibold text-gray-700">User: {comment.address}</span>
          </div>
          <p class="text-gray-800">{comment.message}</p>
        </div>
      {/each}
    </div>
  {/if}
</div>