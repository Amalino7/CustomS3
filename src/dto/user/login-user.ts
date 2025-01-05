import { ApiSchema } from "@nestjs/swagger";

@ApiSchema()
export class LoginUser {
	/**
	 * The email of the user.
	 * @example "test@gmail.com"
	 */
	email: string;

	/**
	 * The password of the user.
	 * @example "password"
	 */
	password: string;
}
