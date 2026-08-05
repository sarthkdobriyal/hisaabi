import type { Metadata } from "next";
import { AppHeader } from "@/components/AppHeader";
import { PwaInstallModal } from "@/components/PwaInstallModal";

export const metadata: Metadata = {
  title: "App",
  robots: { index: false }, // app routes are private client-side, not for indexing
};

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <div className="flex flex-1 flex-col">
      <AppHeader />
      <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col px-4 py-4">{children}</div>
      <PwaInstallModal />
    </div>
  );
}
