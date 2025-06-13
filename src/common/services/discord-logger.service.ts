import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class DiscordLoggerService {
  private readonly logger = new Logger(DiscordLoggerService.name);
  private webhookUrl: string | null = null;

  constructor(private configService: ConfigService) {
    this.webhookUrl = this.configService.get<string>('DISCORD_WEBHOOK_URL') || null;
  }

  async logError(error: any, request: any, context?: string): Promise<void> {
    if (!this.webhookUrl) {
      this.logger.warn('DISCORD_WEBHOOK_URL não configurada. Não foi possível enviar log para Discord.');
      return;
    }

    try {
      // Informações básicas do erro
      const errorMessage = error.message || 'Erro desconhecido';
      const errorStack = error.stack || 'Stack trace não disponível';
      const statusCode = error.status || error.statusCode || 500;
      const timestamp = new Date().toISOString();

      // Informações do request
      const method = request.method || 'N/A';
      const url = request.url || 'N/A';
      const userId = request.user?.id || request.user?.userId || 'anonymous';
      const userEmail = request.user?.email || 'unknown';

      // Informações adicionais para erros do PostgreSQL/TypeORM
      let queryInfo = '';
      if (error.name === 'QueryFailedError') {
        queryInfo = `\n**Query:** \`${error.query?.substring(0, 200)}${error.query?.length > 200 ? '...' : ''}\`\n**Parameters:** \`${JSON.stringify(error.parameters || {}).substring(0, 200)}\`\n**Code:** \`${error.driverError?.code || 'N/A'}\``;
      }

      // Criando a mensagem para Discord
      const embed = {
        color: 0xFF0000, // Vermelho para erro
        title: `⚠️ Erro ${statusCode} - ${errorMessage.substring(0, 100)}`,
        description: `**URL:** ${method} ${url}\n**Usuário:** ${userEmail} (${userId})\n**Timestamp:** ${timestamp}${queryInfo}`,
        fields: [
          {
            name: 'Stack Trace',
            value: `\`\`\`\n${errorStack.substring(0, 1000)}${errorStack.length > 1000 ? '...' : ''}\n\`\`\``,
          }
        ],
        footer: {
          text: `Rumon Server • ${context || 'API Error'}`
        }
      };

      // Adicionar corpo da requisição se disponível
      if (request.body && Object.keys(request.body).length > 0) {
        const sanitizedBody = this.sanitizeData(request.body);
        embed.fields.push({
          name: 'Request Body',
          value: `\`\`\`json\n${JSON.stringify(sanitizedBody, null, 2).substring(0, 1000)}\n\`\`\``,
        });
      }

      // Enviando para Discord
      await axios.post(this.webhookUrl, {
        embeds: [embed],
      });

      this.logger.log('Log de erro enviado para Discord com sucesso');
    } catch (webhookError) {
      this.logger.error(`Falha ao enviar log para Discord: ${webhookError.message}`);
    }
  }

  private sanitizeData(data: any): any {
    if (!data) return data;
    
    const sanitized = { ...data };
    
    // Remove campos sensíveis
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
    
    const sanitizeRecursive = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;
      
      Object.keys(obj).forEach(key => {
        if (sensitiveFields.includes(key.toLowerCase())) {
          obj[key] = '[REDACTED]';
        } else if (typeof obj[key] === 'object') {
          sanitizeRecursive(obj[key]);
        }
      });
    };
    
    sanitizeRecursive(sanitized);
    return sanitized;
  }
} 