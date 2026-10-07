# Andréia Corretora

Site da corretora migrado para Next.js, React e TypeScript, com banco PostgreSQL usando Prisma.

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

O projeto usa PostgreSQL. Configure `DATABASE_URL` com a URL fornecida pelo seu provedor (Neon, Render ou Vercel Postgres) e execute:

```bash
npx prisma db push
npm run db:seed
```

Na Vercel, adicione `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` e `BLOB_READ_WRITE_TOKEN` em **Settings > Environment Variables** para os ambientes de produção e preview. O valor de `DATABASE_URL` deve começar com `postgresql://` ou `postgres://`. `ADMIN_USERNAME` pode ser `admin`. O `BLOB_READ_WRITE_TOKEN` é criado automaticamente ao conectar um Blob Store ao projeto.

O painel `/admin` permite selecionar ou soltar várias fotos por imóvel. Depois do upload, arraste as miniaturas para definir a ordem; a primeira foto será usada como capa. Os detalhes públicos ficam em `/imoveis/[id]` e exibem a galeria com lightbox.

O SQLite usado anteriormente era apenas local e não deve ser usado na Vercel.

As fotos enviadas pelo painel são armazenadas no Vercel Blob, porque o sistema de arquivos da Vercel não é persistente.

## APIs

- `GET /api/imoveis`: lista imóveis.
- `POST /api/imoveis`: cadastra imóvel, usando o header `x-admin-password`.
- `DELETE /api/imoveis/:id`: remove imóvel, usando o header `x-admin-password`.
- `POST /api/interessados`: salva contatos enviados pelo formulário do site.
