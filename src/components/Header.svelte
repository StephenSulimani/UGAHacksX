<script lang="ts">
  import Header from "./Header.svelte";
  import { ThumbsUp, ThumbsDown } from "lucide-svelte";
  import ConnectWalletButton from "./ConnectWallet.svelte";
  import SubmitForm from "./SubmitForm.svelte";
    
  export let id;
  export let title;
  export let excerpt;
  export let author;
  export let votes = 0;

  let account: string | null = null;
  let errorMessage: string | null = null;

  let voteCount = votes;
  function upvote() {
    voteCount += 1;
  }
  function downvote() {
    voteCount -=1;
  }

</script>

<header class="bg-primary text-primary-foreground">
  <div class="container mx-auto px-4 py-4 flex justify-between items-center">
    <a href="/" class="text-2xl font-bold">DecentralNews</a>
    <nav>
      <ul class="flex space-x-4">
        <li>
          <a href="/articles" class="hover:underline">Articles</a>
        </li>
        <li>
          <a href="/submit" class="hover:underline">Submit</a>
        </li>
        <li>
          <ConnectWalletButton />
        </li>
      </ul>
    </nav>
  </div>
</header>

<div class="card p-6 border rounded-lg shadow-lg bg-white">
  <div class="card-header mb-2">
    <h2 class="card-title text-xl font-bold text-gray-900">{title}</h2>
  </div>
  <div class="card-content">
    <p class="text-gray-700">{excerpt}</p>
    <p class="mt-2 text-sm text-gray-500">By: {author}</p>
  </div>
  <div class="card-footer flex justify-between mt-4">
    <a href={`/article/${id}`} class="px-4 py-2 border rounded text-blue-600 hover:bg-blue-100">Read More</a>
    <div class="flex items-center space-x-2">
      <button class="p-2 rounded-full bg-gray-100 hover:bg-gray-200" on:click={upvote}>
        <ThumbsUp class="h-5 w-5 text-green-500" />
      </button>
      <span class="text-gray-800 font-medium">{voteCount}</span>
      <button class="p-2 rounded-full bg-gray-100 hover:bg-gray-200" on:click={downvote}>
        <ThumbsDown class="h-5 w-5 text-red-500" />
      </button>
    </div>
  </div>
</div>
