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

## 🧱 Banco de Dados

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