export interface AuthPayload {
    address: string;
}

export async function VerifyAuth(): Promise<AuthPayload | false> {
    const response = await fetch("/api/me", {
        method: "GET",
        credentials: "include",
    });

    if (response.status != 200) {
        return false;
    }

    const data = await response.json();

    return data["message"] as AuthPayload;
}
