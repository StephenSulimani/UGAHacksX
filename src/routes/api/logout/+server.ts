import { json} from "@sveltejs/kit";

export async function GET(): Promise<Response> {
    const tokenCookie = `authToken=; HttpOnly; Path=/; Max-Age=-1;`; 

    return json(
        {},
        {
            status: 200,
            headers: {
                "Set-Cookie": tokenCookie,
            },
        },
    );
}
