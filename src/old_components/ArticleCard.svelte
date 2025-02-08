<script>
  import Header from "./Header.svelte";
  import { ThumbsUp, ThumbsDown } from "lucide-svelte";
  import { ReadMoreButton } from "./ReadMoreButton.svelte";

  export let id;
  export let title;
  export let excerpt;
  export let author;
  export let votes;

  let voteCount = votes;
  function upvote() {
    voteCount += 1;
  }
  function downvote() {
    voteCount -= 1;
  }
</script>

<div class="card">
  <div class="card-header">
    <h2 class="card-title">{title}</h2>
  </div>
  <div class="card-content">
    <p class="text-muted-foreground">{excerpt}</p>
    <p class="mt-2 text-sm">By: {author}</p>
  </div>
  <div class="card-footer flex justify-between">
    <a href={`/article/${id}`} class="btn-outline">Read More</a>
    
    <div class="flex items-center space-x-2">
      <button class="p-2 rounded-full hover:bg-gray-200" on:click={upvote}>
        <ThumbsUp class="h-4 w-4" />
      </button>
      <span>{votes}</span>
      <button class="p-2 rounded-full hover:bg-gray-200" on:click={downvote}>
        <ThumbsDown class="h-4 w-4" />
      </button>
    </div>
  </div>
</div>