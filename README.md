# mmmines

an endless, massive multiplayer minesweeper game built with Next.js, Socket.IO,
and Redis.

## run locally

requires Node.js 20, npm, and Redis.

```sh
npm ci
cp .env.sample .env.local
```

replace `REDIS_URL` in `.env.local` with:

```dotenv
REDIS_URL=redis://localhost:6379
```

start Redis:

```sh
redis-server --save '' --appendonly no
```

in another terminal, start the app:

```sh
npm run dev
```

open [http://localhost:3000](http://localhost:3000).
