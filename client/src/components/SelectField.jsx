function SelectField({ error, label, name, onChange, options, value }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold tracking-wide text-slate-200/95">{label}</span>
      <select
        className={`w-full rounded-2xl border px-4 py-3.5 text-slate-100 outline-none transition duration-200 ${
          error
            ? 'border-rose-400/60 bg-rose-950/20 shadow-[0_0_0_4px_rgba(251,113,133,0.08)] focus:border-rose-400'
            : 'border-white/10 bg-slate-950/65 hover:border-white/20 focus:border-emerald-400/60 focus:bg-slate-950/80 focus:shadow-[0_0_0_4px_rgba(45,212,191,0.08)]'
        }`}
        name={name}
        onChange={onChange}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </label>
  );
}

export default SelectField;
