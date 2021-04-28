import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = '';
    let errors;
    switch (status) {
      case 400:
        message = exception.message;
        break;
      case 401:
        message = exception.message;
        break;
      case 403:
        message = exception.message;
        break;
      case 404:
        message = exception.message;
        break;
      default:
        message = 'Internal Server Error';
        break;
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
