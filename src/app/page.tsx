import { Onboarding } from "@/components/sections/home/onboarding";

export const experimental_ppr = true;

export default function Home() {
  return (
    <main className="grid place-items-center h-full">
      <Onboarding />
    </main>
  );
}
