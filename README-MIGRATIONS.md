# Migrations do Rumon Server

Este documento explica como executar as migrations para adicionar os novos campos de perfil de usuário e tabela de redes sociais.

## Configuração

A configuração do banco de dados está centralizada no `src/app.module.ts` e usa as mesmas variáveis de ambiente para desenvolvimento e produção:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=rumon
```

## Executando as Migrations

### 1. Executar todas as migrations pendentes

```bash
npm run migration:run
```

### 2. Reverter a última migration (se necessário)

```bash
npm run migration:revert
```

### 3. Gerar nova migration automaticamente

```bash
npm run migration:generate src/migrations/NomeDaMigration
```

### 4. Criar migration vazia

```bash
npm run migration:create src/migrations/NomeDaMigration
```

## Migrations Criadas

### 1. AddUserProfileFields (1749151037323)

Adiciona os seguintes campos na tabela `users`:
- `apelido` (varchar, nullable)
- `periodoIngresso` (varchar, nullable) - formato: ano.semestre (ex: 24.1, 24.2)
- `origem` (varchar, nullable) - cidade e estado (ex: Belo Horizonte, MG)
- `faculdade` (enum: UFOP, UEMG, nullable)
- `curso` (varchar, nullable)
- `hierarquia` (enum: calouro, morador, decano, ex-morador, nullable)
- `descricao` (text, nullable) - bio do usuário

### 2. CreateUserSocialMediaTable (1749151062386)

Cria a tabela `user_social_medias` com os campos:
- `id` (uuid, primary key)
- `telefone` (varchar, nullable)
- `whatsapp` (varchar, nullable)
- `instagram` (varchar, nullable)
- `linkedin` (varchar, nullable)
- `user_id` (uuid, foreign key para users.id)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## Nova Rota API

### GET /users/:id

Retorna informações completas do usuário incluindo:
- Dados básicos do usuário (nome, email, telefone, etc.)
- Novos campos de perfil (apelido, período de ingresso, origem, etc.)
- Nome da república
- Redes sociais

#### Exemplo de Resposta

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "João Silva",
  "apelido": "Joãozinho",
  "email": "joao@email.com",
  "phone": "+5511999999999",
  "periodoIngresso": "24.1",
  "origem": "Belo Horizonte, MG",
  "faculdade": "UFOP",
  "curso": "Engenharia de Computação",
  "hierarquia": "morador",
  "descricao": "Estudante de engenharia, ama música e esportes",
  "isActive": true,
  "republicName": "República dos Estudantes",
  "socialMedias": [
    {
      "id": "456e7890-e12b-34d5-a678-901234567890",
      "telefone": "+5511999999999",
      "whatsapp": "+5511999999999",
      "instagram": "@joaosilva",
      "linkedin": "joao-silva-123",
      "createdAt": "2024-03-20T10:00:00Z",
      "updatedAt": "2024-03-20T10:00:00Z"
    }
  ],
  "createdAt": "2024-03-20T10:00:00Z",
  "updatedAt": "2024-03-20T10:00:00Z"
}
```

## Configuração das Migrations

As migrations estão configuradas no `src/app.module.ts`:

```typescript
TypeOrmModule.forRootAsync({
  // ... outras configurações
  entities: [User, Republic, UserSocialMedia],
  migrations: ['dist/migrations/*.js'],
  migrationsRun: false, // migrations não executam automaticamente
  synchronize: configService.get('NODE_ENV') !== 'production',
})
```

- **migrations**: Aponta para os arquivos compilados em `dist/migrations/`
- **migrationsRun**: `false` - migrations devem ser executadas manualmente
- **synchronize**: `false` em produção para usar apenas migrations

## Desenvolvimento vs Produção

### Desenvolvimento
- `synchronize: true` - TypeORM sincroniza automaticamente as mudanças das entidades
- Migrations são opcionais, mas recomendadas para mudanças estruturais

### Produção
- `synchronize: false` - Apenas migrations são usadas para alterações no banco
- `migrationsRun: false` - Migrations devem ser executadas manualmente

## Comandos Úteis

```bash
# Iniciar servidor em desenvolvimento
npm run start:dev

# Compilar o projeto
npm run build

# Executar migrations
npm run migration:run

# Ver status das migrations
npx typeorm-ts-node-commonjs migration:show -d src/config/typeorm.config.ts

# Reverter migration
npm run migration:revert
```

## Documentação Swagger

A rota está documentada no Swagger em `/api`. Acesse `http://localhost:3000/api` após iniciar o servidor para ver a documentação completa da API. 