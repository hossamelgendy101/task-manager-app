const toneStyles = {
  success: 'border-emerald-200 bg-white/95 text-slate-900 shadow-emerald-100/80',
  error: 'border-rose-200 bg-white/95 text-slate-900 shadow-rose-100/80',
  info: 'border-slate-200 bg-white/95 text-slate-900 shadow-slate-200/80',
};

function ToastViewport({ toasts }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:justify-end sm:px-6">
      <div className="flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur transition duration-300 ${toneStyles[toast.type]}`}
            key={toast.id}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-1 h-2.5 w-2.5 rounded-full ${
                  toast.type === 'success'
                    ? 'bg-emerald-500'
                    : toast.type === 'error'
                      ? 'bg-rose-500'
                      : 'bg-slate-500'
                }`}
              />
              <div className="space-y-1">
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.message ? (
                  <p className="text-sm leading-5 text-slate-600">{toast.message}</p>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ToastViewport;
