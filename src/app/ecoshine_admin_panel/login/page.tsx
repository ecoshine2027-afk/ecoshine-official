import { Logo } from "@/components/logo";
import { loginAction } from "@/app/ecoshine_admin_panel/actions";
import { inputCls, labelCls, primaryBtnCls } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-card border border-border bg-card p-8 shadow-lg">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-6 text-center text-xl font-bold text-foreground">Admin Login</h1>
        <p className="mt-1 text-center text-sm text-muted">
          Sign in to manage the Ecoshine website.
        </p>

        {error && (
          <p className="mt-4 rounded-btn border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-300">
            Incorrect email or password. Try again.
          </p>
        )}

        <form action={loginAction} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className={labelCls}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="password" className={labelCls}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className={inputCls}
            />
          </div>
          <SubmitButton className={`${primaryBtnCls} w-full`} pendingText="Signing in…">Sign In</SubmitButton>
        </form>
      </div>
    </div>
  );
}
