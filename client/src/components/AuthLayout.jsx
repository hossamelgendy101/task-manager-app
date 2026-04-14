import { Link, useLocation } from 'react-router-dom';

function AuthLayout({ title, subtitle, children }) {
  const location = useLocation();

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.45),_transparent_30%),linear-gradient(180deg,_#02120f_0%,_#0f172a_55%,_#111827_100%)] px-4 py-6 text-slate-100 sm:px-6 sm:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl gap-6 lg:grid-cols-[1.08fr_0.92fr] xl:gap-8">
        <section className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-emerald-950/20 backdrop-blur sm:p-8">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-emerald-400/10 via-teal-300/10 to-transparent" />
          <div className="relative space-y-8">
            <span className="inline-flex w-fit rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
              TaskFlow Workspace
            </span>
            <div className="space-y-5">
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl xl:text-6xl">
                Plan clearly. Move faster. Keep every task in one calm place.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                A focused workspace for secure sign-in and lightweight task tracking,
                with a polished flow that feels reliable on desktop and mobile.
              </p>
            </div>
          </div>
          <div className="relative grid gap-4 rounded-[1.75rem] border border-white/10 bg-slate-950/35 p-5 text-sm text-slate-300 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <p className="font-semibold text-white">Register</p>
              <p className="mt-2 leading-6">Create an account with clear validation and instant access.</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <p className="font-semibold text-white">Login</p>
              <p className="mt-2 leading-6">Return quickly with a saved session and focused dashboard.</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <p className="font-semibold text-white">Protect</p>
              <p className="mt-2 leading-6">Keep task management gated behind authenticated routes.</p>
            </div>
          </div>
        </section>

        <section className="flex items-center">
          <div className="w-full rounded-[2rem] border border-white/10 bg-slate-900/88 p-5 shadow-2xl shadow-slate-950/40 sm:p-8">
            <div className="mb-6 space-y-3">
              <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
              <p className="max-w-md text-sm leading-6 text-slate-400">{subtitle}</p>
            </div>

            <div className="mb-6 flex gap-2 rounded-2xl bg-slate-950/60 p-2">
              <Link
                className={`flex-1 rounded-xl px-4 py-3 text-center text-sm font-semibold transition duration-200 ${
                  location.pathname === '/login'
                    ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
                to="/login"
              >
                Login
              </Link>
              <Link
                className={`flex-1 rounded-xl px-4 py-3 text-center text-sm font-semibold transition duration-200 ${
                  location.pathname === '/register'
                    ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
                to="/register"
              >
                Register
              </Link>
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AuthLayout;
