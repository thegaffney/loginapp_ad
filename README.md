# Prerequisites

You'll need an existing PostgreSQL database AND an available AD server and login for this to work

Put your DB and AD connection info in a .env file in the root, and make sure the variables are named the same as the variables needed under /src/lib/common/db_postgresql.ts and /src/lib/common/active_directory.ts

The basic schema for the database is under the schema folder

## Install Dependencies


```bash
npx install
```

## Running The App


```bash
npm run dev

```
