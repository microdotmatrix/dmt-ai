import Image from "next/image";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-fit mx-auto">{children}</div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/images/fs-img_01.jpg"
          alt="Image"
          fill
          className="absolute h-full w-full object-cover object-center dark:brightness-[0.5] opacity-50"
        />
      </div>
    </main>
  );
}
