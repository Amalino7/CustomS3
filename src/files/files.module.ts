import { Module } from "@nestjs/common";
import { FilesService } from "./files.service";
import { FilesController } from "./files.controller";
import { MinioClientModule } from "src/minio-client/minio-client.module";

@Module({
	controllers: [FilesController],
	providers: [FilesService],
	imports: [MinioClientModule],
})
export class FilesModule {}
