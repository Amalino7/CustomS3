import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./http-exception/http-exception.filter";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = new DocumentBuilder()
		.setTitle("Custom S3 API")
		.setDescription("An API for a Custom S3 application")
		.setVersion("1.0")
		.addServer("http://localhost:3000")
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup("api", app, document);

	app.useGlobalFilters(new HttpExceptionFilter());

	await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
