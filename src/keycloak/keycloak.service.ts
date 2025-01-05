import { HttpService } from "@nestjs/axios";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConfigVariables } from "src/config/configuration";
import { UserRepresentation } from "../dto/keycloak/UserRepresentation";
import { CredentialRepresentation } from "../dto/keycloak/CredentialRepresentation";
import { NewUser } from "../dto/user/new-user";
import { firstValueFrom } from "rxjs";
import { LoginRepresentation } from "src/dto/keycloak/LoginRepresentation";

@Injectable()
export class KeycloakService {
	private readonly keycloakDomain = this.config.get<string>(
		"keycloak.domain",
		"localhost",
	);

	private readonly keycloakRealm = this.config.get<string>(
		"keycloak.realm",
		"master",
	);

	private readonly keycloakAdminUrl = this.config.get<string>(
		"keycloak.adminUrl",
		"http://localhost:8080",
	);
	private readonly keycloakLoginUrl = this.config.get<string>(
		"keycloak.loginUrl",
		"http://localhost:8080",
	);
	private readonly clientId = this.config.get<string>(
		"keycloak.adminClientId",
		"admin-cli",
	);
	private readonly clientSecret = this.config.get<string>(
		"keycloak.adminClientSecret",
		"admin",
	);

	constructor(
		private readonly config: ConfigService<ConfigVariables>,
		private readonly httpService: HttpService,
	) {}

	async createUser(newUser: NewUser) {
		try {
			const token = await this.loginClient();
			const credential = new CredentialRepresentation();
			credential.type = "password";
			credential.value = newUser.password;
			credential.temporary = false;
			const userRepresentation = new UserRepresentation();
			userRepresentation.credentials = [credential];
			userRepresentation.username = newUser.email;
			userRepresentation.email = newUser.email;
			userRepresentation.firstName = newUser.firstName;
			userRepresentation.lastName = newUser.lastName;
			userRepresentation.enabled = true;
			userRepresentation.emailVerified = false;

			await firstValueFrom(
				this.httpService.post(
					`${this.keycloakAdminUrl}/users`,
					userRepresentation,
					{
						headers: {
							"Authorization": `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					},
				),
			);

			const users = await this.getUsersByUserName(newUser.email, token);

			if (users.length === 0) {
				throw new BadRequestException("User not created");
			}

			return users[0];
		} catch (error) {
			console.log("create user exception ", error);
			throw new BadRequestException(
				`Failed to create user: ${error.message}`,
			);
		}
	}

	async getUsersByUserName(
		username: string,
		token: string,
	): Promise<UserRepresentation[]> {
		const url = `${this.keycloakAdminUrl}/users`;
		const params = new URLSearchParams({
			first: "0",
			max: "1",
			exact: "true",
			username,
		});

		try {
			const response = await firstValueFrom(
				this.httpService.get<UserRepresentation[]>(
					`${url}?${params.toString()}`,
					{
						headers: {
							"Authorization": `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					},
				),
			);
			return response.data;
		} catch (error) {
			throw new BadRequestException(
				`Failed to fetch users: ${error.message}`,
			);
		}
	}

	async getUser(userId: string): Promise<UserRepresentation> {
		const url = `${this.keycloakAdminUrl}/users/${userId}`;
		try {
			const token = await this.loginClient();
			const response = await firstValueFrom(
				this.httpService.get(url, {
					headers: {
						"Authorization": `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}),
			);
			return response.data;
		} catch (error) {
			throw new BadRequestException(
				`Failed to fetch user with ID ${userId}: ${error.message}`,
			);
		}
	}

	async loginClient(): Promise<string> {
		const formData = new URLSearchParams();
		formData.append("client_id", this.clientId);
		formData.append("client_secret", this.clientSecret);
		formData.append("grant_type", "client_credentials");

		try {
			const response = await firstValueFrom(
				this.httpService.post(
					this.keycloakLoginUrl,
					formData.toString(),
					{
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
					},
				),
			);
			const { access_token } = response.data;
			return access_token;
		} catch (error) {
			throw new BadRequestException(
				`Client login failed: ${error.message}`,
			);
		}
	}

	async loginUser(
		username: string,
		password: string,
	): Promise<LoginRepresentation> {
		const formData = new URLSearchParams();

		formData.append("client_id", this.clientId);
		formData.append("client_secret", this.clientSecret);
		formData.append("grant_type", "password");
		formData.append("username", username);
		formData.append("password", password);
		formData.append("scope", "openid");

		try {
			const response = await firstValueFrom(
				this.httpService.post(
					`${this.keycloakDomain}/realms/${this.keycloakRealm}/protocol/openid-connect/token`,
					formData.toString(),
					{
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
					},
				),
			);
			return response.data;
		} catch (error) {
			throw new BadRequestException(
				`User login failed: ${error.message}`,
			);
		}
	}

	async refreshToken(refreshToken: string): Promise<LoginRepresentation> {
		const formData = new URLSearchParams();

		formData.append("client_id", this.clientId);
		formData.append("client_secret", this.clientSecret);
		formData.append("grant_type", "refresh_token");
		formData.append("refresh_token", refreshToken);

		try {
			const response = await firstValueFrom(
				this.httpService.post(
					`${this.keycloakDomain}/realms/${this.keycloakRealm}/protocol/openid-connect/token`,
					formData.toString(),
					{
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
					},
				),
			);
			return response.data;
		} catch (error) {
			throw new BadRequestException(
				`Token refresh failed: ${error.message}`,
			);
		}
	}
}
