# Dashboard Homelab

Panel de acceso rápido a los servicios del homelab. Permite listar, crear y marcar enlaces como favoritos, con persistencia en PostgreSQL.

## Requisitos

- [Bun](https://bun.sh/) (desarrollo local)
- PostgreSQL
- [Docker](https://docs.docker.com/get-docker/) (despliegue en contenedor)

## Desarrollo local

1. Copia las variables de entorno:

```bash
cp .env.example .env
```

2. Edita `.env` con los datos de tu base de datos:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=dashboard_homelab
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_SCHEMA=public
```

3. Instala dependencias y aplica migraciones:

```bash
bun install
bun run db:migrate
```

4. Inicia el servidor de desarrollo:

```bash
bun run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Despliegue con Docker

### 1. Instalar Docker

Si aún no tienes Docker en el servidor:

- **Linux:** [Instalar Docker Engine](https://docs.docker.com/engine/install/)
- **Windows / macOS:** [Docker Desktop](https://docs.docker.com/get-docker/)

Verifica la instalación:

```bash
docker --version
```

### 2. Construir la imagen

Desde la raíz del proyecto:

```bash
docker build -t dashboard-homelab .
```

### 3. Ejecutar el contenedor

Pasa las variables de base de datos en tiempo de ejecución:

```bash
docker run -d \
  --name dashboard-homelab \
  -p 3000:3000 \
  -e DATABASE_HOST=192.168.1.12 \
  -e DATABASE_PORT=5432 \
  -e DATABASE_NAME=db_dashboard_homelab \
  -e DATABASE_USER=postgres \
  -e DATABASE_PASSWORD=tu_password \
  -e DATABASE_SCHEMA=public \
  dashboard-homelab
```

La app quedará disponible en [http://localhost:3000](http://localhost:3000).

> **Nota:** Las migraciones de base de datos se aplican fuera del contenedor, por ejemplo con `bun run db:migrate` en desarrollo o `prisma migrate deploy` en el servidor antes de desplegar.

### Opciones útiles

**Ver logs del contenedor:**

```bash
docker logs -f dashboard-homelab
```

**Detener y eliminar el contenedor:**

```bash
docker stop dashboard-homelab
docker rm dashboard-homelab
```

**Actualizar a una nueva versión:**

```bash
docker build -t dashboard-homelab .
docker stop dashboard-homelab
docker rm dashboard-homelab
# Vuelve a ejecutar docker run con las mismas variables de entorno
```

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `bun run dev` | Servidor de desarrollo |
| `bun run build` | Build de producción |
| `bun run start` | Iniciar build local |
| `bun run db:migrate` | Aplicar migraciones (desarrollo) |
| `bun run db:push` | Sincronizar esquema sin migraciones |
| `bun run db:studio` | Abrir Prisma Studio |
