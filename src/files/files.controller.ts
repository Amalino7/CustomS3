import {
	Controller,
	Get,
	Post,
	Put,
	Param,
	Delete,
	UseInterceptors,
	UploadedFile,
	Res,
} from "@nestjs/common";
import { FilesService } from "./files.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { BufferedFile } from "src/minio-client/file.model";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { Response } from "express";

@Controller("files")
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post()
	@ApiConsumes("multipart/form-data")
	@ApiBody({
		schema: {
			type: "object",
			properties: {
				file: {
					type: "string",
					format: "binary",
				},
			},
		},
	})
	@UseInterceptors(FileInterceptor("file"))
	create(@UploadedFile() file: BufferedFile) {
		return this.filesService.create(file);
	}

	@Get(":id")
	async findOne(@Res() res: Response, @Param("id") id: string) {
		const file = await this.filesService.findOne(id);

		res.setHeader("Content-Type", file.mimeType);

		file.stream.pipe(res);
	}

	@Put(":id")
	@ApiConsumes("multipart/form-data")
	@ApiBody({
		schema: {
			type: "object",
			properties: {
				file: {
					type: "string",
					format: "binary",
				},
			},
		},
	})
	@UseInterceptors(FileInterceptor("file"))
	update(@Param("id") id: string, @UploadedFile() file: BufferedFile) {
		return this.filesService.update(id, file);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.filesService.remove(id);
	}
}
