import { writable } from "svelte/store";

export const isConnected = writable(false);
export const userAddress = writable("");
