import { DashboardView } from "@/components/dashboard/dashboard-view";
import { DatabaseError } from "@/components/dashboard/database-error";
import { getEnlaces } from "@/lib/enlaces";

export const dynamic = "force-dynamic";

export default async function Home() {
  const enlaces = await getEnlaces();

  if (enlaces === null) {
    return <DatabaseError />;
  }

  return <DashboardView enlaces={enlaces} />;
}
