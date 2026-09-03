# Meerut Range

## Local development

```bash
npm install
npm run dev
```

The development server is available at `http://localhost:3000`.

## Docker deployment

The production image uses Next.js standalone output and runs as the unprivileged
`nextjs` user. Visitor data is stored in SQLite at `data/visitors.db`; Docker
Compose mounts that directory so replacing the container does not delete
analytics data.

### Build and run locally

```bash
copy .env.example .env
docker compose up -d --build
```

Open `http://localhost:3000`. Check the service with:

```bash
docker compose ps
docker compose logs -f web
```

### Deploy on EC2

Use an Ubuntu EC2 instance with Docker Engine and the Compose plugin installed.
Allow inbound TCP `80` and `443` in the security group. Port `3000` is only
needed temporarily for direct testing and should not be publicly exposed when
using a reverse proxy.

```bash
git clone <repository-url> meerut-range
cd meerut-range
cp .env.example .env
nano .env
mkdir -p data
docker compose up -d --build
docker compose ps
```

Set the real API values in `.env` before starting the service. To update an
existing deployment:

```bash
git pull
docker compose up -d --build
docker image prune -f
```

The service listens on port `3000` inside Docker. Set `APP_PORT` in `.env` to
change the host port. For a public site, put Nginx or Caddy in front of the
container for HTTPS and proxy requests to `127.0.0.1:3000`.

### SQLite backup

Back up the `data` directory from the EC2 host. Stop the service first so the
SQLite database and its WAL files remain consistent:

```bash
docker compose stop web
tar -czf meerut-range-data-$(date +%F).tar.gz data
docker compose start web
```

The application is designed for a single running instance because visitor
analytics use a local SQLite database. Use a shared database before scaling to
multiple containers or EC2 instances.
