import AD from "$lib/common/active_directory";
import PostgreSQL from "$lib/common/db_postgresql";
import type { IADUser } from "$lib/interfaces";
import { fail, type Action, type Actions } from "@sveltejs/kit";

const login: Action = async ({request, cookies}) =>{
    // get form data
    const data = await request.formData()

    const email = data.get('email')
    const password = data.get('password')

    // validate input
    if(
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        !email ||
        !password
    ) {
        return fail(400, {message: 'Please provide your email and password'})
    }

    const ad = AD()
    const adUserCheck = await ad.isValid(email, password)
    if(adUserCheck === false){
        return fail(400, {message:'Your email or password is incorrect'})
    }

    // returns a User object from activedirectory2
    const adUser = await ad.queryUser(email)

    // convert AD object to APP object
    const user: IADUser = {...adUser}

    const sql = `insert into data.session(ad_user, date_expired) values ($1, now() + ('8 hour')::interval) returning guid_id`
    const resp = await PostgreSQL().query(sql, [JSON.stringify(user)])

    let session = ''
    if(resp.rows[0]){
        session = resp.rows[0].guid_id
    } else {
        return fail(400, {message:'There was a problem creating the session'})
    }
    
    // set cookie in browser
    cookies.set('svelte_login_app', session, {
        path: '/', // every page
        maxAge: 60 * 60 * 8 // 8 hours
    })

    return {
        success: true
    }
}
export const actions: Actions = {login}