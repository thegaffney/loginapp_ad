import AD from "$lib/common/active_directory";
import PostgreSQL from "$lib/common/db_postgresql";
import type { IADUser, ISession } from "$lib/interfaces";
import { fail, type Action, type Actions } from "@sveltejs/kit";

const login: Action = async ({request, cookies}) => {
    // get the form data
    const data = await request.formData()

    const email = data.get('email')
    const password = data.get('password')

    // Make sure we have the proper fields sent in
    if(
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        !email ||
        !password
    ) {
        return fail(400, {message: 'Please provide your email and password'})
    }

    // check password in AD

    const ad = AD();
    const adUserCheck = await ad.isValid(email, password) // verify password
    if(adUserCheck === false) {
        // if AD authentication failed, then the email and PW combo was not found
        return fail(400, {message:'Your email or password is incorrect'})
    } 
     
    // A "User" object from the activedirectory2 module
    const adUser = await ad.queryUser(email)    

    // convert AD User object to IADUser Object...
    const user: IADUser = {...adUser}

    // create session and get session GUID and user info
    const sessionSQL = `insert into data.session(ad_user, date_expired) values ($1, now() + ('8 hour')::interval) returning guid_id `
    const sessionResp = await PostgreSQL().query(sessionSQL, [JSON.stringify(user)])

    const session: ISession = {...sessionResp.rows[0]}

    // set cookie in browser with session GUID
    cookies.set('svelte_app_session', session.guid_id, {
        path: '/', // every page
        maxAge: 60 * 60 * 8 // 8 hours
    })

    return {
        success: true,
    }
}

export const actions: Actions = {login}