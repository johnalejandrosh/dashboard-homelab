function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`La variable de entorno ${name} no está definida`);
  }

  return value;
}

export function buildDatabaseUrl(): string {
  const host = process.env.DATABASE_HOST ?? "localhost";
  const port = process.env.DATABASE_PORT ?? "5432";
  const name = requireEnv("DATABASE_NAME");
  const user = requireEnv("DATABASE_USER");
  const password = requireEnv("DATABASE_PASSWORD");
  const schema = process.env.DATABASE_SCHEMA ?? "public";

  const encodedUser = encodeURIComponent(user);
  const encodedPassword = encodeURIComponent(password);

  return `postgresql://${encodedUser}:${encodedPassword}@${host}:${port}/${name}?schema=${schema}`;
}
