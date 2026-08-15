# mmmines

an endless, massive multiplayer minesweeper game built with Next.js, Socket.IO,
and Redis.

## run locally

requires Node.js 24.18.0, npm, and either Redis or Docker.

```sh
npm ci
cp .env.sample .env.local
```

replace `REDIS_URL` in `.env.local` with:

```dotenv
REDIS_URL=redis://localhost:6379
```

start Redis directly:

```sh
redis-server --save '' --appendonly no
```

or with Docker:

```sh
docker run --rm -p 6379:6379 redis:7-alpine
```

in another terminal, start the app:

```sh
npm run dev
```

open [http://localhost:3000](http://localhost:3000).
