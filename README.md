<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# Rumon API

API do sistema Rumon para gerenciamento de repúblicas estudantis, construída com NestJS, TypeORM e PostgreSQL.

## 🚀 Características

- **Autenticação JWT** - Sistema seguro de login e autenticação
- **Gestão de Usuários** - Pré-cadastro e ativação por token
- **Gestão de Repúblicas** - CRUD completo de repúblicas estudantis
- **Documentação Swagger** - API totalmente documentada
- **Banco Flexível** - Suporte a PostgreSQL local e Neon (nuvem)
- **Docker Ready** - Configuração completa com Docker


# Executar em modo desenvolvimento
npm run start:dev
```

## 📦 Instalação e Execução

### Pré-requisitos
- Docker e Docker Compose
- Node.js 20+ (para desenvolvimento local)

### Execução com Docker

```bash
# Clone o repositório
git clone <seu-repositorio>
cd rumon-server

# Configure o .env

# Execute com banco local
docker compose up

# OU execute apenas a API (se usando Neon)
docker compose up api
```

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Configurar banco local e .env
# Executar em modo desenvolvimento
npm run start:dev
```

## 📚 API Documentation

Após executar a aplicação, acesse:

- **Swagger UI**: http://localhost:3001/api
- **API Base**: http://localhost:3001

### Principais Endpoints

- `POST /auth/login` - Fazer login
- `POST /users/pre-register` - Pré-cadastrar usuário
- `POST /users/set-password/:token` - Definir senha
- `GET /republics` - Listar repúblicas
- `POST /republics` - Criar república (autenticado)

## 🔐 Autenticação

1. Faça login em `/auth/login`
2. Use o token retornado no header: `Authorization: Bearer <token>`
3. No Swagger: clique em "Authorize" e cole o token

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod

# Testes
npm run test
npm run test:e2e

# Linting
npm run lint
```

## 🐳 Docker Commands

```bash
# Executar tudo
docker compose up

# Apenas API (se usando Neon)
docker compose up api

# Rebuild
docker compose build

# Ver logs
docker compose logs -f api

# Parar tudo
docker compose down
```

## 🔧 Estrutura do Projeto

```
src/
├── auth/           # Módulo de autenticação
├── users/          # Módulo de usuários
├── republics/      # Módulo de repúblicas
├── config/         # Configurações
├── app.module.ts   # Módulo principal
└── main.ts         # Arquivo de entrada
```

## 📄 License

Este projeto está licenciado sob a [MIT License](https://opensource.org/licenses/MIT).
