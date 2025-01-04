import { Module } from "@nestjs/common";
import { MinioClientService } from "./minio-client.service";
import { MinioModule } from "nestjs-minio-client";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "src/config/configuration";
@Module({
	imports: [
		ConfigModule,
		MinioModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService<EnvironmentVariables>) => ({
				endPoint: config.get("MINIO_ENDPOINT", "localhost"),
				port: config.get("MINIO_PORT", 9000),
				useSSL: false,
				accessKey: config.get("MINIO_ROOT_USER", "minioadmin"),
				secretKey: config.get("MINIO_ROOT_PASSWORD", "minioadmin"),
			}),
		}),
	],
	providers: [MinioClientService],
	exports: [MinioClientService],
})
export class MinioClientModule {}
