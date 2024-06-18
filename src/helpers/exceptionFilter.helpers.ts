import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { ERROR_OCCURRED } from '../utils/error';

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  logger = new Logger(GlobalExceptionsFilter.name);
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: ConfigService,
  ) {}

  catch(error: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const context = host.switchToHttp();
    this.logger.error(error);

    const httpStatusCode =
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorMessage = error?.message || ERROR_OCCURRED;
    const defaultResponse = {
      errorMessage,
      statusCode: httpStatusCode,
    };

    const responseBody = {
      ...(typeof error.getResponse === 'function'
        ? error?.getResponse()
        : defaultResponse),
      path: httpAdapter.getRequestUrl(context.getRequest()),
    };

    httpAdapter.reply(context.getResponse(), responseBody, httpStatusCode);
  }
}
