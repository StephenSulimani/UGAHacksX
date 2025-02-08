<script>
	import Layout from "../components/Layout.svelte";
	import ArticleCard from "../components/ArticleCard.svelte";
  
	export let id;
	export let title;
	export let excerpt;
	export let author;
	export let votes;

	// This would typically come from an API or blockchain
	let articles = [
	  {
		id: "1",
		title: "The Future of Decentralized News",
		excerpt: "Exploring how blockchain technology is reshaping journalism...",
		author: "Alice Nakamoto",
		votes: 42,
	  },
	  {
		id: "2",
		title: "Fact-Checking in a Decentralized World",
		excerpt: "New mechanisms for ensuring accuracy in community-driven reporting...",
		author: "Bob Buterin",
		votes: 38,
	  },
	  // Add more sample articles as needed
	];
  </script>
  
  <Layout {id} {title} {excerpt} {author} {votes}>
	<h1 class="text-3xl font-bold mb-6">Latest Articles</h1>
	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
	  {#each articles as { id, title, excerpt, author, votes } (id)}
		<ArticleCard {id} {title} {excerpt} {author} {votes} />
	  {/each}
	</div>
  </Layout>