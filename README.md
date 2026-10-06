# Andréia Corretora

Site da corretora migrado para Next.js, React e TypeScript, com banco SQLite usando Prisma.

## Executar localmente

```bash
npm install
cp .env.example .env
npx prisma db push
npm run db:seed
npm run dev
```

Abra `http://localhost:3000`.

## Cadastro de imóveis

Abra `http://localhost:3000/admin` e informe o valor de `ADMIN_PASSWORD` definido no `.env`.

O painel permite cadastrar e remover imóveis. As imagens podem ser substituídas em `public/imagens` e o caminho pode ser informado na API quando o painel for ampliado.

## Banco de dados

O banco local é `prisma/dev.db` e não deve ser versionado. Para trocar para PostgreSQL em produção, altere o `provider` e `DATABASE_URL` no Prisma antes de publicar.

## APIs

- `GET /api/imoveis`: lista imóveis.
- `POST /api/imoveis`: cadastra imóvel, usando o header `x-admin-password`.
- `DELETE /api/imoveis/:id`: remove imóvel, usando o header `x-admin-password`.
- `POST /api/interessados`: salva contatos enviados pelo formulário do site.
