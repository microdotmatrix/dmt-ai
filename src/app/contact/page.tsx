import { ContactSection } from "@/components/email/contact-form";

export const experimental_ppr = true;

export default function ContactPage() {
  return (
    <main>
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-muted-foreground">
          If you have any questions or need assistance, please don't hesitate to
          contact us.
        </p>
        <ContactSection />
      </div>
    </main>
  );
}
