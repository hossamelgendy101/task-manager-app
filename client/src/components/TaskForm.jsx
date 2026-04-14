import { useEffect, useState } from 'react';

import { TASK_STATUSES } from '../constants/taskOptions';
import { validateTaskForm } from '../lib/taskValidators';
import FormField from './FormField';
import SelectField from './SelectField';
import TextAreaField from './TextAreaField';

const initialValues = {
  title: '',
  description: '',
  status: 'todo',
};

function TaskForm({
  externalErrors = {},
  initialTask = null,
  isSubmitting,
  onCancel,
  onSubmit,
  resetKey = 0,
  submitLabel,
  title,
}) {
  const [values, setValues] = useState(initialTask || initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(initialTask || initialValues);
    setErrors(externalErrors);
  }, [externalErrors, initialTask, resetKey]);

  useEffect(() => {
    setErrors(externalErrors);
  }, [externalErrors]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateTaskForm(values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      status: values.status,
    });
  }

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6">
      <div className="mb-5 space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h2>
        <p className="text-sm leading-6 text-slate-500">
          Capture the task details and choose its current progress status.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormField
          error={errors.title}
          label="Title"
          name="title"
          onChange={handleChange}
          placeholder="Prepare weekly sprint summary"
          value={values.title}
        />
        <TextAreaField
          error={errors.description}
          label="Description"
          name="description"
          onChange={handleChange}
          placeholder="Add any useful context, notes, or next steps."
          value={values.description}
        />
        <SelectField
          error={errors.status}
          label="Status"
          name="status"
          onChange={handleChange}
          options={TASK_STATUSES}
          value={values.status}
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            className="rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Saving...' : submitLabel}
          </button>
          {onCancel ? (
            <button
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50"
              onClick={onCancel}
              type="button"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}

export default TaskForm;
