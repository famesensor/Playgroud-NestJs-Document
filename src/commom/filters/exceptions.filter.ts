import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import logger from 'src/config/logger.config';

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
    switch (status) {
      case 400:
        message = exception.getResponse().valueOf()['message'];
        break;
      case 401:
        message = exception.message;
        logger.error(message);
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
      status: false,
      message,
    });
  }
}
