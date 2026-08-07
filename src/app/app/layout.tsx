import type { Metadata } from "next";
import { AppHeader } from "@/components/AppHeader";
import { PwaInstallModal } from "@/components/PwaInstallModal";
import { VaultGate } from "@/components/VaultGate";

export const metadata: Metadata = {
  title: "App",
  robots: { index: false },
};

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <VaultGate>
      <div className="flex flex-1 flex-col bg-black text-white">
        <AppHeader />
        <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col px-4 py-4">{children}</div>
        <PwaInstallModal />
      </div>
    </VaultGate>
  );
}
