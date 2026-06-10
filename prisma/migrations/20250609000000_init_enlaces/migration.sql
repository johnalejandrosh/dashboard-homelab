-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "enlaces" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "enlaces_pkey" PRIMARY KEY ("id")
);
