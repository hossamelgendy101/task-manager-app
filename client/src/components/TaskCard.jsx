import { TASK_STATUSES } from '../constants/taskOptions';
import { formatTaskDate } from '../lib/taskUtils';

const statusStyles = {
  todo: 'bg-slate-200 text-slate-700',
  'in-progress': 'bg-amber-100 text-amber-700',
  done: 'bg-emerald-100 text-emerald-700',
};

function TaskCard({
  isDeleting,
  isStatusUpdating,
  isUpdating,
  onDelete,
  onEdit,
  onStatusChange,
  task,
}) {
  return (
    <article className="rounded-[1.75rem] border border-white/70 bg-white/92 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.12)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold tracking-tight text-slate-900">{task.title}</h3>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                statusStyles[task.status]
              }`}
            >
              {task.status}
            </span>
          </div>
          <p className="text-sm leading-6 text-slate-600">
            {task.description || 'No description provided.'}
          </p>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Created {formatTaskDate(task.createdAt)}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <select
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition duration-200 focus:border-teal-500 focus:shadow-[0_0_0_4px_rgba(20,184,166,0.08)]"
            disabled={isStatusUpdating}
            onChange={(event) => onStatusChange(task.id, event.target.value)}
            value={task.status}
          >
            {TASK_STATUSES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isUpdating}
            onClick={() => onEdit(task)}
            type="button"
          >
            {isUpdating ? 'Editing...' : 'Edit'}
          </button>
          <button
            className="rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-600 transition duration-200 hover:-translate-y-0.5 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isDeleting}
            onClick={() => onDelete(task)}
            type="button"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default TaskCard;
