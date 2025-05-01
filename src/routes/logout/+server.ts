import PostgreSQL from "$lib/common/db_postgresql";
import { redirect, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({cookies}) =>{

    const session = cookies.get('svelte_login_app')
    if(session){
        const sql = `update data.session set date_expired = now() where guid_id = $1 `
        await PostgreSQL().query(sql, [session])
    }

    cookies.delete('svelte_login_app', {
        path: '/', // every page
        maxAge: 60 * 60 * 8 // 8 hours
    })

    throw redirect(303, '/login')
}