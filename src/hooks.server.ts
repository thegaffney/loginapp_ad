
// this file runs on every request

import PostgreSQL from '$lib/common/db_postgresql'
import type { IADUser } from '$lib/interfaces'
import { redirect } from '@sveltejs/kit'

export async function handle({event, resolve}) {

    // do something with the request before processing it...

    const session = event.cookies.get('svelte_login_app')
    if(session){
        // get user from DB
        const sql = `select ad_user, date_expired from data.session where guid_id = $1 `
        const resp = await PostgreSQL().query(sql, [session])

        if(resp.rows[0] && resp.rows[0].date_expired > Date.now()){
            const user: IADUser = {...resp.rows[0].ad_user}

            event.locals.user = user
        }
    }

    //redirect if not logged in
    if(!event.locals.user && event.url.pathname !== '/login'){
        throw redirect(303, '/login')
    }

    return await resolve(event)
}