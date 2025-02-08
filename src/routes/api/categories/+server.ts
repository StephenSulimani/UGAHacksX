import { prisma } from "$lib/db";
import type { APIResponse } from "$lib/responses";
import { json } from "@sveltejs/kit";

export async function GET(): Promise<Response> {
    const categories = await prisma.category.findMany({});

    const category_names = categories.map((c) => c.name);

    const resp: APIResponse<object> = {
        success: 1,
        error: 0,
        message: {
            categories: category_names,
        },
    };
    return json(resp, { status: 200 });
}
