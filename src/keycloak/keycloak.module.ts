import { Module } from "@nestjs/common";
import { KeycloakService } from "./keycloak.service";
import { KeycloakConfigService } from "./keycloak-config.service";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import {
	AuthGuard,
	KeycloakConnectModule,
	ResourceGuard,
	RoleGuard,
} from "nest-keycloak-connect";
import { APP_GUARD } from "@nestjs/core";

@Module({
	imports: [
		ConfigModule,
		HttpModule,
		KeycloakModule,
		KeycloakConnectModule.registerAsync({
			useExisting: KeycloakConfigService,
			imports: [KeycloakModule],
		}),
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: ResourceGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RoleGuard,
		},
		KeycloakService,
		KeycloakConfigService,
	],
	exports: [KeycloakConnectModule, KeycloakService, KeycloakConfigService],
})
export class KeycloakModule {}
