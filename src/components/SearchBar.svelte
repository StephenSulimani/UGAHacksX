<script>
    import { goto } from '$app/navigation';
    import { Search, Button } from 'flowbite-svelte';
    import { SearchOutline } from 'flowbite-svelte-icons';

    let cid = ''; // To hold the search input

    // Function to handle form submission
    let navigate = (event) => {
        event.preventDefault();
        if (cid) {
            goto(`/article/${cid}`);
        }
    };
</script>

<form class="flex" on:submit={navigate}>
    <Search bind:value={cid} size="md" />
    <Button class="!p-2.5" ></Button>
</form>
