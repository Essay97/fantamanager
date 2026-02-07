# Fantamanager

## Run

### Prerequisiti

I tool necessari per eseguire Fantamanager sono:

- Node
- yarn
- git
- Postgres

### Setup ambiente

Per eseguire Fantamanager:

- Lanciare una istanza Postgres locale o con docker. Con docker:

```bash
docker run -d \
  --name fantamanager-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=fantamanager \
  -p 5432:5432 \
  -v fantamanager-pgdata:/var/lib/postgresql \
  postgres:18.1
```

- `git clone https://https://github.com/Essay97/fantamanager.git`
- `cd fantamanager`
- `yarn install`
- `cp .env.example .env` e compilarlo con tutti i valori
- `yarn run migrate up`
- Eseguire sul database lo script `node_modules/connect-pg-simple/table.sql`
- `yarn run build && node dist/scripts/seedUtenti.js`; opzionalmente, prima di lanciare questo comando, entrare in `src/scripts/seedUtenti.ts` e cambiare le credenziali del seed
- `yarn run dev`
