<script>
    import Header from "./Header.svelte";
    import { ThumbsUp, ThumbsDown } from "lucide-svelte";
    //import { ReadMoreButton } from "./ReadMoreButton.svelte";
  
    export let cid;
    export let title;
    export let blurb;
    export let author;
  
    // let voteCount = votes;
    // function upvote() {
    //   voteCount += 1;
    // }
    // function downvote() {
    //   voteCount -= 1;
    // }
  </script>
  
  <div class="bg-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg p-6 max-w-sm w-full">
    <!-- Card Header -->
    <div class="card-header">
      <h2 class="text-2xl font-semibold leading-tight">{title}</h2>
    </div>
    
    <!-- Card Body (blurb and author) -->
    <div class="text-purple-100 mt-4">
      <p class="text-sm">{blurb}</p>
      <p class="mt-2 text-xs">By: <span class="font-medium">{author}</span></p>
    </div>
    
    <!-- Card Footer (read more link) -->
    <div class="card-footer flex justify-between items-center mt-4">
      <a href={`/article/${cid}`} class="px-4 py-2 bg-white text-purple-600 rounded-md hover:bg-purple-100 transition-colors duration-300 ml-auto">
        Read More
      </a>

      <!-- <div class="flex items-center space-x-2">
        <button class="p-2 rounded-full hover:bg-gray-200" on:click={upvote}>
          <ThumbsUp class="h-4 w-4" />
        </button>
        <span>{votes}</span>
        <button class="p-2 rounded-full hover:bg-gray-200" on:click={downvote}>
          <ThumbsDown class="h-4 w-4" />
        </button>
      </div> -->
    </div>
  </div>
