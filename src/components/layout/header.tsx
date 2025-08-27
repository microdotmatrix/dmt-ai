import Link from "next/link";
import { ThemeToggle } from "../theme/toggle";
import { Icon } from "../ui/icon";

export const Header = () => {
  return (
    <header className="sticky top-0 mt-4 z-50 w-full flex justify-between items-center px-4">
      <section>
        <Link href="/">
          <Icon icon="simple-icons:nextdotjs" className="size-8" />
        </Link>
      </section>
      <section>
        <ThemeToggle />
      </section>
    </header>
  );
};
