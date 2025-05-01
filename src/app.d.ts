// See https://svelte.dev/docs/kit/types#app.d.ts

import type { IADUser } from "$lib/interfaces";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: IADUser
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
