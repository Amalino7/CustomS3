import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MinioClientModule } from "./minio-client/minio-client.module";
import { FilesModule } from "./files/files.module";
import { ConfigModule } from "@nestjs/config";
import {
	AuthGuard,
	KeycloakConnectModule,
	ResourceGuard,
	RoleGuard,
} from "nest-keycloak-connect";
import configuration from "./config/configuration";
import { APP_GUARD } from "@nestjs/core";
import { KeycloakConfigService } from "./keycloak/keycloak-config.service";
import { KeycloakModule } from "./keycloak/keycloak.module";
import { LoggerMiddleware } from "./logger.middleware";
import { UsersModule } from "./users/users.module";

@Module({
	imports: [
		KeycloakModule,
		ConfigModule.forRoot({
			isGlobal: true,
			expandVariables: true,
			load: [configuration],
		}),
		KeycloakConnectModule.registerAsync({
			useExisting: KeycloakConfigService,
			imports: [KeycloakModule],
		}),
		MinioClientModule,
		FilesModule,
		UsersModule,
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
	],
	exports: [KeycloakConnectModule],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes("*");
	}
}
