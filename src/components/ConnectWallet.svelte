<script lang="ts">
    import { ethers } from "ethers";
    import { onMount } from "svelte";
    import { VerifyAuth } from "$lib/helpers/auth";
    import LogoutBtn from "./LogoutBtn.svelte";
    import { userAddress, isConnected } from "$lib/stores/authStore";

    let provider: ethers.providers.Web3Provider | null = null;
    let nonce: string = "";
    let signature: string = "";

    // Function to connect to the user's wallet
    async function connectWallet() {
        if (window.ethereum) {
            provider = new ethers.BrowserProvider(window.ethereum);
            //            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            userAddress.set(await signer.getAddress());
            nonce = generateNonce();
            await signNonce(signer, nonce);
        } else {
            alert("Please install MetaMask!");
        }
    }

    // Function to generate a nonce
    function generateNonce() {
        return Math.random().toString(36).substring(2, 15); // Simple nonce generation
    }

    // Function to sign the nonce
    async function signNonce(signer: ethers.Signer, nonce: string) {
        signature = await signer.signMessage(nonce);
        await sendLoginRequest($userAddress, signature, nonce);
    }

    // Function to send the login request
    async function sendLoginRequest(
        address: string | null,
        signature: string,
        nonce: string,
    ) {
        if (address) {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    address,
                    signature,
                    nonce,
                }),
            });

            const data = await response.json();
            console.log("Login response:", data);
            isConnected.set(response.status == 200);
        }
    }

    onMount(async () => {
        const verified = await VerifyAuth();

        if (!verified) {
            return;
        }

        isConnected.set(true);
        userAddress.set(verified.address);
    });
</script>

<div>
    {#if $isConnected}
        Connected: {$userAddress}
        <LogoutBtn />
    {:else}
        <button
            class="px-4 py-2 bg-secondary text-black rounded hover:bg-secondary-dark"
            on:click={connectWallet}>Connect Wallet</button
        >
    {/if}
</div>

