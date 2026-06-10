#!/bin/sh
set -e

if [ "${SKIP_MIGRATIONS}" != "true" ] && [ -f "./node_modules/prisma/build/index.js" ]; then
  echo "Aplicando migraciones de base de datos..."
  node ./node_modules/prisma/build/index.js migrate deploy
fi

exec node server.js
