-- Reestructura accesos: proyecto / servicio / entorno
ALTER TABLE "accesos" ADD COLUMN "proyecto" TEXT NOT NULL DEFAULT 'General';
ALTER TABLE "accesos" ADD COLUMN "servicio" TEXT;
ALTER TABLE "accesos" ADD COLUMN "entorno" TEXT;

-- Preserva el nombre actual como nombre de proyecto
UPDATE "accesos" SET "proyecto" = "nombre" WHERE "nombre" IS NOT NULL AND "nombre" <> '';

-- Elimina la columna nombre (reemplazada por proyecto/servicio/entorno)
ALTER TABLE "accesos" DROP COLUMN "nombre";
