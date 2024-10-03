import {API_URL} from '$env/static/private';
import {type RequestHandler} from '@sveltejs/kit';


export const POST: RequestHandler = async ({request}) => {

    let body = await request.json();
    if ((body.email === undefined || body.email === "") && (body.key === undefined || body.key === "")) {
        return new Response(JSON.stringify({error: "Missing email or key"}), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }

    let response = await fetch(
        API_URL + "/reset_license",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: body.email,
                key: body.key
            }),
        }
    );


    if (!response.ok) {
        return new Response(JSON.stringify({error: response.statusText}), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }

    return new Response(JSON.stringify({}), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
        }
    );
};
