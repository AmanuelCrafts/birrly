import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black tracking-tight text-white">
            BIRRLY
          </h1>
          <p className="mt-2 text-sm font-semibold text-white/40">
            Build your streak. Build your rewards.
          </p>
        </div>

        <RegisterForm />

        <p className="mt-6 text-center text-sm font-semibold text-white/40">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-bold text-brand-400 hover:text-brand-300 transition-colors"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
