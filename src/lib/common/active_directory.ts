
import ActiveDirectory from 'activedirectory2';
import { AD_BASE_DN, AD_HOST, AD_ACCOUNT, AD_PASSWORD } from '$env/static/private';

const AD = () => {
	let adObj: ActiveDirectory;

	const init = (): void =>{
		if(!adObj){
			api.connect();
		}
	}
	const api = {
		connect: () => {
			try {
				const params: any = {
					baseDN: AD_BASE_DN,
					url: AD_HOST,
					username: AD_ACCOUNT,
					password: AD_PASSWORD,
					attributes: {
						"user": [
							"userPrincipalName",
							"sAMAccountName",
							"displayName",
							"givenName",
							"sn",
							"dn",
							"employeeID",
							// Add more here
						],
					},
					timeout: 5000,
					idleTimeout: 5000,
					connectTimeout: 5000
				}
				adObj = new ActiveDirectory(params)
			} catch (err) {
				throw new Error(String(err))
			}
		},
		isValid: async (user: string, password: string): Promise<any> => {
			init()

			return new Promise((resolve, reject) => {
				adObj.authenticate(user, password, (error: any, auth: boolean) => {
					if (error && (!error.lde_message || !error.lde_message.includes('52e'))) {
						reject(JSON.stringify(error));
					}
					if (auth) {
						resolve(true)
					} else {
						resolve(false)
					}
				});
			})
		},
		queryUser: async (email: string): Promise<any> => {
			init()
			return new Promise((resolve, reject) => {		
				const filter = '(&(userPrincipalName='+email+')(objectClass=user)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))'	
				const opts: any = {filter: filter}
				adObj.findUser(opts, '', (error: object, user: object): any => {
					if (error) {
						reject(error);
					}
					if (!user) {
						resolve({});
					} else {
						resolve(user);
					}
				});
			});
		},
	};
	return api;
};

export default AD;