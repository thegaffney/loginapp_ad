
interface IADUser {
    userPrincipalName: string,
    sAMAccountName: string,
    displayName: string,
    givenName: string,
    sn: string,
    employeeID: string,
    dn: string,
}
interface ISession {
    guid_id: string,
}

export type {IADUser, ISession}