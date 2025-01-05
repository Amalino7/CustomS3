import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Unprotected } from "nest-keycloak-connect";
import { ApiBearerAuth } from "@nestjs/swagger";
import { NewUser } from "src/dto/user/new-user";
import { KeycloakService } from "src/keycloak/keycloak.service";
import { LoginUser } from "src/dto/user/login-user";
import { RefreshToken } from "src/dto/user/refresh-token";

@Controller("users")
@ApiBearerAuth()
export class UserController {
	constructor(private readonly keycloakService: KeycloakService) {}

	@Post()
	@Unprotected()
	async createUser(@Body() newUser: NewUser) {
		return await this.keycloakService.createUser(newUser);
	}

	@Post("login")
	@Unprotected()
	async login(@Body() { email: username, password }: LoginUser) {
		return await this.keycloakService.loginUser(username, password);
	}

	@Post("refresh")
	@Unprotected()
	async refresh(@Body() { refreshToken }: RefreshToken) {
		return await this.keycloakService.refreshToken(refreshToken);
	}

	@Get(":id")
	async getUser(@Param("id") userId: string) {
		return await this.keycloakService.getUser(userId);
	}
}
