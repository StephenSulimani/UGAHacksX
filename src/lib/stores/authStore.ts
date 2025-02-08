import { writable } from "svelte/store";

export const isConnected = writable(false);
export const userAddress = writable("");

export async function CheckAuth() {
    const resp = await fetch("/api/me", {
        credentials: "include",
    });

    if (resp.status != 200) {
        isConnected.set(false);
        userAddress.set("");
        return;
    }

    const data = await resp.json();

    isConnected.set(true);
    userAddress.set(data.message.address);
}
