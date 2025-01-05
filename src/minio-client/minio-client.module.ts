import { Module } from "@nestjs/common";
import { MinioClientService } from "./minio-client.service";
import { MinioModule } from "nestjs-minio-client";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ConfigVariables } from "src/config/configuration";

@Module({
	imports: [
		ConfigModule,
		MinioModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService<ConfigVariables>) => ({
				endPoint: config.get("minio.endpoint", "localhost"),
				port: config.get("minio.port", 9000),
				useSSL: false,
				accessKey: config.get("minio.rootUser", "minioadmin"),
				secretKey: config.get("minio.rootPassword", "minioadmin"),
			}),
		}),
	],
	providers: [MinioClientService],
	exports: [MinioClientService],
})
export class MinioClientModule {}
