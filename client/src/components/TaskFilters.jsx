import { TASK_STATUS_FILTERS } from '../constants/taskOptions';

function TaskFilters({ searchTerm, statusFilter, onSearchChange, onStatusChange }) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="grid gap-4 md:grid-cols-[1.4fr_0.8fr]">
        <label className="space-y-2">
          <span className="text-sm font-semibold tracking-wide text-slate-700">Search tasks</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-teal-500 focus:shadow-[0_0_0_4px_rgba(20,184,166,0.08)]"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by title or description"
            value={searchTerm}
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold tracking-wide text-slate-700">Filter by status</span>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition duration-200 focus:border-teal-500 focus:shadow-[0_0_0_4px_rgba(20,184,166,0.08)]"
            onChange={(event) => onStatusChange(event.target.value)}
            value={statusFilter}
          >
            {TASK_STATUS_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}

export default TaskFilters;
