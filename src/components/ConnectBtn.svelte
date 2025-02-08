<script lang="ts">
    import { isConnected, userAddress } from "$lib/stores/authStore";
    import { ethers } from "ethers";

    let provider: ethers.BrowserProvider;
    let nonce: string;
    let signature: string;

    async function connectWallet() {
        if (window.ethereum!) {
            provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            userAddress.set(await signer.getAddress());
            nonce = generateNonce();
            await signNonce(signer, nonce);
        } else {
            alert("Please install a browser-based Ethereum wallet!");
        }
    }

    function generateNonce(): string {
        return Math.random().toString(36).substring(2, 15);
    }

    async function signNonce(signer: ethers.Signer, nonce: string) {
        signature = await signer.signMessage(nonce);
        isConnected.set(await Login($userAddress, signature, nonce));
    }

    async function Login(
        address: string,
        signature: string,
        nonce: string,
    ): Promise<boolean> {
        const resp = await fetch("/api/login", {
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

        return resp.status == 200;
    }
</script>

<button
    on:click={connectWallet}
    class="bg-white text-purple-600 px-4 py-2 rounded-full font-semibold hover:bg-purple-100 transition-colors duration-200 border-2 border-white"
>
    Connect Wallet
</button>
