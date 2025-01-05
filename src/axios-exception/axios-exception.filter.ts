import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
} from "@nestjs/common";
import { AxiosError } from "axios";

@Catch(AxiosError)
export class AxiosExceptionFilter implements ExceptionFilter {
	catch(exception: AxiosError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		const status =
			exception.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
		const data = exception.response?.data || exception.message;

		response.status(status).json({
			statusCode: status,
			data,
			error: exception.response?.statusText || "Axios Error",
			timestamp: new Date().toISOString(),
		});
	}
}
