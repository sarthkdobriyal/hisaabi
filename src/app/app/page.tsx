import { DataResidencyBadge } from "@/components/DataResidencyBadge";

// Chat interface lands in the next milestone. This is the empty-state shell.
export default function AppHome() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <DataResidencyBadge />

      <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
        <p className="text-lg font-medium">Chat is coming next.</p>
        <p className="max-w-sm text-sm text-slate-500">
          Soon you&rsquo;ll type things like{" "}
          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            spent 200 on coffee
          </span>{" "}
          and Hisaabi will parse, categorize, and save it — all on this device.
        </p>
      </div>
    </div>
  );
}
