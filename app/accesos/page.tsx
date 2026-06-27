import { AccesosView } from "@/components/accesos/accesos-view";
import { DatabaseError } from "@/components/dashboard/database-error";
import { getAccesos } from "@/lib/accesos";

export const dynamic = "force-dynamic";

export default async function AccesosPage() {
  const accesos = await getAccesos();

  if (accesos === null) {
    return <DatabaseError />;
  }

  return <AccesosView accesos={accesos} />;
}
