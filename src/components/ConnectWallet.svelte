<script lang="ts">
    import { ethers } from 'ethers';

    export let account: string | null = null;
    let errorMessage: string | null = null;
    let isConnected = false;

    const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            account = accounts[0];
            isConnected = true;
            errorMessage = null;

            // Generate a unique message
            const nonce = Math.floor(Math.random() * 1000000).toString(); // Example nonce
            const message = `Sign this message to log in: ${nonce}`;

            // Request the user to sign the message
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const signature = await signer.signMessage(message);

            // Send the wallet address, nonce, and signature to the backend
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ address: account, nonce, signature }),
            });

            if (!response.ok) {
                throw new Error('Failed to save user');
            }

            const data = await response.json();
            console.log(data); // Handle the response as needed
        } catch (error) {
            console.error(error);
            errorMessage = 'Failed to connect wallet or sign message';
        }
    } else {
        errorMessage = 'Please install MetaMask!';
    }
    };
</script>

<button 
    class="px-4 py-2 bg-secondary text-black rounded hover:bg-secondary-dark" 
    on:click={connectWallet}>
    {#if isConnected}
        Connected: {account}
    {:else}
        Connect Wallet
    {/if}
</button>