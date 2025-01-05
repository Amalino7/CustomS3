import { Injectable, BadRequestException } from "@nestjs/common";
import { MinioService } from "nestjs-minio-client";
import { BufferedFile } from "./file.model";

@Injectable()
export class MinioClientService {
	private readonly baseBucket = "default";

	private get client() {
		return this.minio.client;
	}

	constructor(private readonly minio: MinioService) {}

	async upload(file: BufferedFile, bucket: string = this.baseBucket) {
		const fileBuffer = file.buffer;

		const bucketExists = await this.client.bucketExists(bucket);

		if (!bucketExists) {
			throw new BadRequestException("Bucket does not exist");
		}

		// if the file already exists, throw an error
		const fileExists = await this.client
			.statObject(bucket, file.originalname)
			.catch(error => {
				if (error.code === "NotFound") {
					return false;
				}

				console.log(error);
				throw new BadRequestException("Error uploading file");
			});

		if (fileExists) {
			throw new BadRequestException("File already exists");
		}

		this.client
			.putObject(bucket, file.originalname, fileBuffer, {
				"Content-Type": file.mimetype,
			})
			.catch(error => {
				console.log(error);
				throw new BadRequestException("Error uploading file");
			});

		return {
			bucket: bucket,
			fileName: file.originalname,
		};
	}

	async get(objectName: string, bucket: string = this.baseBucket) {
		const stat = await this.client
			.statObject(bucket, objectName)
			.catch(error => {
				if (error.code === "NotFound") {
					throw new BadRequestException("File does not exist");
				}

				console.log(error);
				throw new BadRequestException("Oops Something wrong happend");
			});

		console.log(stat);

		const mimeType = stat.metaData["content-type"];

		const stream = await this.client
			.getObject(bucket, objectName)
			.catch(error => {
				console.log(error);
				throw new BadRequestException("Oops Something wrong happend");
			});

		return {
			stream,
			mimeType,
		};
	}

	async update(
		file: BufferedFile,
		objectName: string,
		bucket: string = this.baseBucket,
	) {
		this.client
			.putObject(bucket, objectName, file.buffer, {
				"Content-Type": file.mimetype,
			})
			.catch(error => {
				console.log(error);
				throw new BadRequestException("Error uploading file");
			});

		return {
			bucket: bucket,
			fileName: objectName,
		};
	}

	async delete(objectName: string, bucket: string = this.baseBucket) {
		// if the file already exists, throw an error
		const fileExists = await this.client
			.statObject(bucket, objectName)
			.catch(error => {
				if (error.code === "NotFound") {
					return false;
				}

				console.log(error);
				throw new BadRequestException("Error uploading file");
			});

		if (!fileExists) {
			throw new BadRequestException("File does not exist");
		}

		await this.client.removeObject(bucket, objectName).catch(error => {
			console.log(error);
			throw new BadRequestException("Oops Something wrong happend");
		});

		return {
			message: "File deleted",
		};
	}
}
