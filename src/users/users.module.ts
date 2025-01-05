import { Module } from "@nestjs/common";
import { UserController } from "./users.controller";
import { HttpModule } from "@nestjs/axios";
import { KeycloakModule } from "src/keycloak/keycloak.module";

@Module({
	imports: [KeycloakModule, HttpModule],
	controllers: [UserController],
})
export class UsersModule {}
