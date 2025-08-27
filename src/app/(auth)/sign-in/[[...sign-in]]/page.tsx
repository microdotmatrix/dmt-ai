import { AuthLayout } from "@/components/auth/layout";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <AuthLayout>
      <SignIn />
    </AuthLayout>
  );
}
