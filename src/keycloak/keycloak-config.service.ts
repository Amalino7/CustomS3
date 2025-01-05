import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
	KeycloakConnectOptions,
	KeycloakConnectOptionsFactory,
	PolicyEnforcementMode,
	TokenValidation,
} from "nest-keycloak-connect";
import { ConfigVariables } from "src/config/configuration";

@Injectable()
export class KeycloakConfigService implements KeycloakConnectOptionsFactory {
	constructor(private readonly config: ConfigService<ConfigVariables>) {}

	createKeycloakConnectOptions():
		| Promise<KeycloakConnectOptions>
		| KeycloakConnectOptions {
		return {
			authServerUrl: this.config.get(
				"keycloak.domain",
				"http://localhost:8080",
			),
			realm: this.config.get("keycloak.realm", "master"),
			clientId: this.config.get("keycloak.adminClientId", "admin-cli"),
			secret: this.config.get("keycloak.adminClientSecret", "admin"),
			policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
			tokenValidation: TokenValidation.ONLINE,
		};
	}
}
