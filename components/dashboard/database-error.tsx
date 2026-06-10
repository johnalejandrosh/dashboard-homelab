export function DatabaseError() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center px-6 text-center">
      <div className="rounded-2xl border border-rose-400/20 bg-rose-500/8 px-6 py-8">
        <h2 className="text-lg font-semibold text-white">
          No se pudo conectar a la base de datos
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          Verifica que PostgreSQL esté en ejecución y que las variables{" "}
          <code className="text-white/75">DATABASE_HOST</code>,{" "}
          <code className="text-white/75">DATABASE_PORT</code>,{" "}
          <code className="text-white/75">DATABASE_NAME</code>,{" "}
          <code className="text-white/75">DATABASE_USER</code> y{" "}
          <code className="text-white/75">DATABASE_PASSWORD</code> estén
          configuradas en el archivo <code className="text-white/75">.env</code>.
        </p>
        <p className="mt-4 text-sm text-white/45">
          Luego ejecuta{" "}
          <code className="text-white/70">bun run db:migrate</code> para crear
          la tabla de enlaces.
        </p>
      </div>
    </div>
  );
}
