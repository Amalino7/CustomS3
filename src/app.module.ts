import { Module } from "@nestjs/common";
import { MinioClientModule } from "./minio-client/minio-client.module";
import { FilesModule } from "./files/files.module";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		MinioClientModule,
		FilesModule,
	],
})
export class AppModule {}
