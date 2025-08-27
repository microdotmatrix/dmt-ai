import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <main>
      <div className="container grid auto-rows-min gap-2 place-content-center h-screen">
        <h1 className="text-center">Next.js 15 Base Template</h1>
        <p className="text-center">
          Created by{" "}
          <a
            href="https://github.com/microdotmatrix"
            target="_blank"
            rel="noopener noreferrer"
          >
            @microdotmatrix
          </a>
        </p>
        <section className="mt-12 flex flex-col md:flex-row items-center justify-center w-full gap-4">
          <div className="grid auto-rows-min gap-4 w-full">
            <h4 className="font-bold">Form</h4>
            <form action="" className="space-y-2 max-w-lg w-full">
              <Input type="text" placeholder="Enter your name" />
              <Input type="email" placeholder="Enter your email" />
              <Button type="submit">Submit</Button>
            </form>
          </div>
          <div className="grid auto-rows-min gap-4 w-full">
            <h3>Other</h3>
            <div className="grid auto-rows-min gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Doloribus, consectetur quis placeat exercitationem odio
                    fugit repellat aliquid deserunt laborum suscipit obcaecati
                    nobis officiis id? Quibusdam repudiandae maxime delectus a
                    minus!
                  </p>
                </CardContent>
                <CardFooter>
                  <p>Card Footer</p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
