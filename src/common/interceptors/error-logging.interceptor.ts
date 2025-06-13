import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DiscordLoggerService } from '../services/discord-logger.service';

@Injectable()
export class ErrorLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorLoggingInterceptor.name);

  constructor(private discordLogger: DiscordLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    // Dados da requisição para contexto
    const requestInfo = {
      method: request.method,
      url: request.url,
      userAgent: request.get('user-agent'),
      ip: request.ip,
      userId: request.user?.id || request.user?.userId || 'anonymous',
      userEmail: request.user?.email || 'unknown',
      timestamp: new Date().toISOString(),
    };

    return next.handle().pipe(
      catchError((error) => {
        const isHttpException = error instanceof HttpException;
        const status = isHttpException ? error.getStatus() : 500;

        // Log apenas erros 500 ou erros não tratados
        if (status >= 500 || !isHttpException) {
          const errorContext = {
            ...requestInfo,
            error: {
              name: error.name,
              message: error.message,
              stack: error.stack,
            },
            request: {
              body: this.sanitizeBody(request.body),
              query: request.query,
              params: request.params,
              headers: this.sanitizeHeaders(request.headers),
            },
          };

          this.logger.error(
            `💥 ERRO 500 - ${request.method} ${request.url}`,
            JSON.stringify(errorContext, null, 2)
          );

          // Log adicional para erros de banco (TypeORM)
          if (error.name === 'QueryFailedError') {
            this.logger.error(
              `🔍 DETALHES DA QUERY:`,
              JSON.stringify({
                query: error.query,
                parameters: error.parameters,
                driverError: {
                  code: error.driverError?.code,
                  severity: error.driverError?.severity,
                  detail: error.driverError?.detail,
                  where: error.driverError?.where,
                }
              }, null, 2)
            );
          }
          
          // Enviar para o Discord
          this.discordLogger.logError(error, request, 'API Server Error').catch(err => {
            this.logger.error(`Falha ao enviar para Discord: ${err.message}`);
          });
        }

        // Se não for uma HttpException, transforme em 500
        if (!isHttpException) {
          return throwError(() => new InternalServerErrorException('Erro interno do servidor'));
        }

        return throwError(() => error);
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;
    
    const sanitized = { ...body };
    
    // Remove campos sensíveis
    const sensitiveFields = ['password', 'token', 'secret', 'key'];
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }

  private sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers };
    
    // Remove headers sensíveis
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
    sensitiveHeaders.forEach(header => {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }
} 