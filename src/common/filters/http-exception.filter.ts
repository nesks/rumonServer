import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno do servidor';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse() as any;
      message = response.message || exception.message;
      error = response.error || 'Bad Request';
    } else if (exception instanceof QueryFailedError) {
      // Tratamento específico para erros do PostgreSQL
      const pgError = exception.driverError;
      
      switch (pgError.code) {
        case '23505': // unique_violation
          status = HttpStatus.CONFLICT;
          message = this.getUniqueViolationMessage(pgError);
          error = 'Conflict';
          break;
        case '23503': // foreign_key_violation
          status = HttpStatus.BAD_REQUEST;
          message = 'Registro relacionado não encontrado';
          error = 'Bad Request';
          break;
        case '22P02': // invalid_text_representation
          status = HttpStatus.BAD_REQUEST;
          message = 'Formato de dados inválido';
          error = 'Bad Request';
          break;
        default:
          this.logger.error(`Erro não tratado do PostgreSQL: ${pgError.code}`, pgError);
      }
    }

    const errorResponse = {
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined
    );

    response.status(status).json(errorResponse);
  }

  private getUniqueViolationMessage(pgError: any): string {
    const detail = pgError.detail || '';
    const table = pgError.table || '';
    const column = pgError.column || '';

    if (detail.includes('already exists')) {
      if (table === 'event_types') {
        return `Já existe um tipo de evento com o nome "${pgError.constraint.split('_')[2]}". Por favor, escolha outro nome.`;
      }
      if (table === 'users') {
        if (column === 'email') {
          return 'Este email já está cadastrado';
        }
        if (column === 'phone') {
          return 'Este telefone já está cadastrado';
        }
      }
      return `Já existe um registro com este valor`;
    }

    return 'Violação de restrição única';
  }
} 