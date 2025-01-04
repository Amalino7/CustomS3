import { Injectable } from "@nestjs/common";
import { BufferedFile } from "src/minio-client/file.model";
import { MinioClientService } from "src/minio-client/minio-client.service";

@Injectable()
export class FilesService {
	constructor(private readonly minioClientService: MinioClientService) {}

	create(file: BufferedFile) {
		return this.minioClientService.upload(file);
	}

	findOne(id: string) {
		return this.minioClientService.get(id);
	}

	update(id: string, file: BufferedFile) {
		return this.minioClientService.update(file, id);
	}

	remove(id: string) {
		return this.minioClientService.delete(id);
	}
}
