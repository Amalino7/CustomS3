export interface ConfigVariables {
	"minio.endpoint": string;
	"minio.port": number;
	"minio.rootUser": string;
	"minio.rootPassword": string;
	"keycloak.domain": string;
	"keycloak.realm": string;
	"keycloak.loginUrl": string;
	"keycloak.adminUrl": string;
	"keycloak.adminClientId": string;
	"keycloak.adminClientSecret": string;
	"keycloak.linkLifespan": number;
	"keycloak.redirectUrl": string;
}

export default () => ({
	minio: {
		endpoint: process.env.MINIO_ENDPOINT ?? "localhost",
		port: parseInt(process.env.MINIO_PORT ?? "9000"),
		rootUser: process.env.MINIO_ROOT_USER ?? "minioadmin",
		rootPassword: process.env.MINIO_ROOT_PASSWORD ?? "minioadmin",
	},
	keycloak: {
		domain: process.env.KEYCLOAK_DOMAIN ?? "http://localhost:8080",
		realm: process.env.KEYCLOAK_REALM ?? "master",
		loginUrl: process.env.KEYCLOAK_LOGIN_URL ?? "http://localhost:8080",
		adminUrl: process.env.KEYCLOAK_ADMIN_URL ?? "http://localhost:8080",
		adminClientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID ?? "admin-cli",
		adminClientSecret: process.env.KEYCLOAK_ADMIN_CLIENT_SECRET ?? "admin",
		linkLifespan: parseInt(
			process.env.KEYCLOAK_ADMIN_LINK_LIFESPAN ?? "3600",
		),
		redirectUrl:
			process.env.KEYCLOAK_ADMIN_REDIRECT_URL ?? "http://localhost:3000",
	},
});
