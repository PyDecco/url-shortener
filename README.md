# 🔗 URL Shortener API

API para encurtamento de URLs, com suporte a usuários autenticados, contagem de cliques, soft delete e controle de acesso.

---

## 🚀 Tecnologias

- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT](https://jwt.io/)
- [nanoid](https://github.com/ai/nanoid)

---

## 📦 Instalação

```bash
git clone https://github.com/pyDecco/url-shortener.git
cd url-shortener
npm install
```

## ⚙️ Configuração

Crie o arquivo .env baseado no `.env.example`:

```bash
cp .env.example .env
```

Preencha com suas informações:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/urlshortener
JWT_SECRET=algumasecret
PORT=3000
```

### Para executar localmente basta rodar 

```bash
npm run start:dev
```

## Build e subida dos containers

Exemplo de .env para *Docker*: !!ATENÇÃO: Existe um env para executar LOCALMENTE e um env para DOCKER

```bash
DATABASE_URL=postgresql://postgres:postgres@db:5432/urlshortener
JWT_SECRET=algumasecret
PORT=3000
```

Para subir tudo e construir a imagem da API:

```bash
docker-compose up --build
```

A API estará disponível em:

```bash
http://localhost:3000
```

Rodar migrations após subir

Em outro terminal:

```bash
docker-compose exec api npx prisma migrate deploy
```

Resetar ambiente (limpar tudo e começar do zero)

```bash
docker-compose down -v
```

Verificar logs

```bash
docker-compose logs -f api
```

## 🧱 Banco de Dados (PASSOS LOCALMENTE)

Rode as migrations com Prisma:

```bash
npx prisma migrate dev --name init
```

## 🏁 Executando

```bash
npm run start:dev
```

A API estará disponível em:
📍 `http://localhost:3000`

## 📁 Estrutura de pastas

```
src/
├── auth/              → Registro e login com JWT
├── shortener/         → Encurtamento, redirecionamento e gestão
├── common/            → Filtros globais, interceptors, etc.
├── infra/database/    → PrismaService e conexão
```


## ✅ Funcionalidades

- ✅ Encurtar URLs com ou sem autenticação

- ✅ Associação com usuário autenticado

- ✅ Redirecionamento com contagem de cliques

- ✅ Soft delete e edição de URLs do próprio usuário

- ✅ Segurança com JWT, Helmet e CORS

- ✅ Validação com DTOs e class-validator

## Testes Funcionais

- import o arquivo json no postman com o formato `url-shortener.postman_collection.json`. Nele terá todos os endpoints cadastrados


## ✅ Testes Automatizados

- O projeto possui cobertura de testes unitários com Jest para os principais serviços da aplicação. Para rodar os testes:

```bash
npm run test
```

| Serviço              | Método             | Descrição                                                      |
| -------------------- | ------------------ | -------------------------------------------------------------- |
| **AuthService**      | `validateUser()`   | Valida e-mail/senha, retorna `null` ou usuário sem senha       |
|                      | `login()`          | Gera token JWT válido                                          |
|                      | `register()`       | Cria usuário e remove `password` da resposta                   |
| **UsersService**     | `create()`         | Cria usuário se e-mail for único, ou lança `ConflictException` |
|                      | `findByEmail()`    | Retorna usuário ou `null` pelo e-mail                          |
| **ShortenerService** | `createShortUrl()` | Gera shortCode único e retorna URL encurtada                   |
|                      | `getOriginalUrl()` | Retorna URL original e contabiliza clique                      |
|                      | `listUserUrls()`   | Lista URLs ativas do usuário                                   |
|                      | `updateUserUrl()`  | Atualiza URL do usuário, valida se pertence a ele              |
|                      | `deleteUserUrl()`  | Realiza soft delete, valida se pertence ao usuário             |


## 📈 Escalabilidade: Pontos de melhoria e desafios
- Se o sistema precisar escalar horizontalmente, considere os seguintes pontos:

### ✅ Melhorias recomendadas
- Usar banco PostgreSQL gerenciado com alta disponibilidade (ex: RDS, Supabase)

- Adicionar Redis para cache de redirecionamentos

- Usar filas (RabbitMQ, Kafka) para registrar cliques de forma assíncrona

- Implementar CDN ou cache reverso para URLs mais acessadas

- Integrar Prometheus e Grafana para métricas e monitoramento

- Colocar um Load Balancer para distribuir as requisições

- Aplicar rate limit nos endpoints públicos

- Estruturar logs com Winston + envio para ferramentas como Sentry ou Datadog

### ⚠️ Principais desafios

- Garantir que shortCodes continuem únicos em múltiplas instâncias

- Filtrar corretamente URLs excluídas (soft delete) em todas as queries

- Sincronizar métricas e logs entre instâncias

- Controlar deploys sem causar inconsistência entre versões

- Garantir segurança e performance sem estado compartilhado (ex: JWT sem sessão)