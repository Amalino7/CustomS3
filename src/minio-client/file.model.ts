export interface BufferedFile {
	fieldname: string;
	originalname: string;
	encoding: string;
	size: number;
	buffer: Buffer | string;
}

export interface StoredFile extends HasFile, StoredFileMetadata {}

export interface HasFile {
	file: Buffer | string;
}
export interface StoredFileMetadata {
	id: string;
	name: string;
	encoding: string;
	size: number;
	updatedAt: Date;
	fileSrc?: string;
}
