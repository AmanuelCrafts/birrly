import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { LoginForm } from "@/components/auth/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
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
            Welcome back 👋
          </p>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-sm font-semibold text-white/40">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="font-bold text-brand-400 hover:text-brand-300 transition-colors"
          >
            Create account
          </a>
        </p>
      </div>
    </div>
  );
}
