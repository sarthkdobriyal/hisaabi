import { DataResidencyBadge } from "@/components/DataResidencyBadge";

// Dashboard (charts, monthly view) lands in a later milestone.
export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <DataResidencyBadge />
      <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700">
        Dashboard with charts is coming soon.
      </div>
    </div>
  );
}
