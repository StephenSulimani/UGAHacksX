import * as jose from "jose";

export interface AuthPayload extends jose.JWTPayload {
    address: string;
}

function isAuthPayload(obj: unknown): obj is AuthPayload {
    if (typeof obj !== "object" || obj === null) {
        return false;
    }

    const payload = obj as AuthPayload;

    return (
        typeof payload.address === "string" &&
        typeof payload.exp === "number" &&
        typeof payload.iat === "number"
    );
}

export async function verifyJWT(token: string): Promise<false | AuthPayload> {
    try {
        const encodedSecret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jose.jwtVerify(token, encodedSecret);
        if (!isAuthPayload(payload)) {
            return false;
        }
        return payload;
    } catch {
        return false;
    }
}

export async function createJWT(payload: jose.JWTPayload): Promise<string> {
    const encodedSecret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(encodedSecret);
    return token;
}
