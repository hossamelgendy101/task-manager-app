import { useDeferredValue, useEffect, useState } from 'react';

import ConfirmDialog from '../components/ConfirmDialog';
import TaskFilters from '../components/TaskFilters';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  updateTaskStatus,
} from '../lib/api';
import { filterTasks } from '../lib/taskUtils';

function DashboardPage({ onLogout, onNotify, user }) {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitFieldErrors, setSubmitFieldErrors] = useState({});
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeDeleteId, setActiveDeleteId] = useState('');
  const [activeStatusId, setActiveStatusId] = useState('');
  const [activeUpdateId, setActiveUpdateId] = useState('');
  const [formResetKey, setFormResetKey] = useState(0);
  const [pendingDeleteTask, setPendingDeleteTask] = useState(null);
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const filteredTasks = filterTasks(tasks, deferredSearchTerm, statusFilter);

  useEffect(() => {
    async function loadTasks() {
      try {
        setIsLoading(true);
        setLoadError('');
        const data = await getTasks();
        setTasks(data.tasks);
      } catch (error) {
        setLoadError(error.message || 'Could not load tasks.');
      } finally {
        setIsLoading(false);
      }
    }

    loadTasks();
  }, []);

  async function handleCreateTask(payload) {
    try {
      setIsSubmitting(true);
      setSubmitError('');
      setSubmitFieldErrors({});
      const data = await createTask(payload);
      setTasks((current) => [data.task, ...current]);
      setFormResetKey((current) => current + 1);
      onNotify({
        title: 'Task created',
        message: `"${data.task.title}" has been added.`,
        type: 'success',
      });
    } catch (error) {
      setSubmitFieldErrors(error.errors || {});
      setSubmitError(error.message || 'Could not create task.');
      onNotify({
        title: 'Could not create task',
        message: error.message || 'Please review the form and try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateTask(payload) {
    if (!editingTask) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError('');
      setSubmitFieldErrors({});
      setActiveUpdateId(editingTask.id);
      const data = await updateTask(editingTask.id, payload);

      setTasks((current) =>
        current.map((task) => (task.id === editingTask.id ? data.task : task)),
      );
      onNotify({
        title: 'Task updated',
        message: `"${data.task.title}" has been saved.`,
        type: 'success',
      });
      setEditingTask(null);
    } catch (error) {
      setSubmitFieldErrors(error.errors || {});
      setSubmitError(error.message || 'Could not update task.');
      onNotify({
        title: 'Could not update task',
        message: error.message || 'Please review the task details and try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
      setActiveUpdateId('');
    }
  }

  async function handleDeleteTask(taskId) {
    try {
      setActiveDeleteId(taskId);
      const taskToDelete = tasks.find((task) => task.id === taskId);
      await deleteTask(taskId);
      setTasks((current) => current.filter((task) => task.id !== taskId));
      onNotify({
        title: 'Task deleted',
        message: taskToDelete
          ? `"${taskToDelete.title}" has been removed.`
          : 'The task has been removed.',
        type: 'success',
      });

      if (editingTask?.id === taskId) {
        setEditingTask(null);
        setSubmitFieldErrors({});
      }
    } catch (error) {
      setLoadError(error.message || 'Could not delete task.');
      onNotify({
        title: 'Could not delete task',
        message: error.message || 'Please try again.',
        type: 'error',
      });
    } finally {
      setActiveDeleteId('');
      setPendingDeleteTask(null);
    }
  }

  async function handleStatusChange(taskId, status) {
    try {
      setActiveStatusId(taskId);
      const data = await updateTaskStatus(taskId, status);
      setTasks((current) =>
        current.map((task) => (task.id === taskId ? data.task : task)),
      );

      if (editingTask?.id === taskId) {
        setEditingTask(data.task);
        setSubmitFieldErrors({});
      }

      onNotify({
        title: 'Status updated',
        message: `"${data.task.title}" is now ${data.task.status}.`,
        type: 'success',
      });
    } catch (error) {
      setLoadError(error.message || 'Could not update task status.');
      onNotify({
        title: 'Could not update status',
        message: error.message || 'Please try again.',
        type: 'error',
      });
    } finally {
      setActiveStatusId('');
    }
  }

  return (
    <>
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.1),_transparent_22%),linear-gradient(180deg,_#f7faf9_0%,_#edf4f1_100%)] px-4 py-6 text-slate-900 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <header className="flex flex-col gap-5 rounded-[2rem] bg-[linear-gradient(135deg,_#0f172a_0%,_#111827_50%,_#134e4a_100%)] px-5 py-6 text-white shadow-2xl shadow-slate-300/60 sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                Protected Workspace
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Task Dashboard
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Manage your personal tasks here, {user?.name}. Every task is scoped
                to your authenticated account.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-100 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                  Total tasks
                </p>
                <p className="mt-1 text-2xl font-semibold">{tasks.length}</p>
              </div>
              <button
                className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/10"
                onClick={onLogout}
                type="button"
              >
                Logout
              </button>
            </div>
          </header>

          <section className="grid gap-6 xl:grid-cols-[0.92fr_1.38fr]">
            <div className="space-y-6">
              <section className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                  Account
                </p>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                  {user?.name}
                </p>
                <p className="mt-1 text-sm text-slate-600">{user?.email}</p>
                <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                  Your tasks are private to this session and visible only after authentication.
                </div>
              </section>

              <TaskForm
                externalErrors={submitFieldErrors}
                initialTask={editingTask}
                isSubmitting={isSubmitting}
                onCancel={
                  editingTask
                    ? () => {
                        setEditingTask(null);
                        setSubmitError('');
                        setSubmitFieldErrors({});
                      }
                    : undefined
                }
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                resetKey={formResetKey}
                submitLabel={editingTask ? 'Update task' : 'Create task'}
                title={editingTask ? 'Edit task' : 'Create a new task'}
              />

              {submitError ? (
                <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm leading-6 text-rose-700">
                  {submitError}
                </div>
              ) : null}
            </div>

            <div className="space-y-6">
              <TaskFilters
                onSearchChange={setSearchTerm}
                onStatusChange={setStatusFilter}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
              />

              {loadError ? (
                <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm leading-6 text-rose-700">
                  {loadError}
                </div>
              ) : null}

              {isLoading ? (
                <section className="rounded-[2rem] border border-white/70 bg-white/90 px-6 py-10 text-sm text-slate-500 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 animate-pulse rounded-full bg-teal-500" />
                    Loading tasks...
                  </div>
                </section>
              ) : filteredTasks.length === 0 ? (
                <section className="rounded-[2rem] border border-dashed border-slate-300 bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] px-6 py-12 text-center shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-teal-50 text-2xl text-teal-700">
                    {tasks.length === 0 ? '+' : '?'}
                  </div>
                  <h2 className="mt-5 text-xl font-semibold tracking-tight text-slate-900">
                    {tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                    {tasks.length === 0
                      ? 'Create your first task from the form to start organizing your work.'
                      : 'Try a different search term or status filter to find what you need.'}
                  </p>
                </section>
              ) : (
                <TaskList
                  activeDeleteId={activeDeleteId}
                  activeStatusId={activeStatusId}
                  activeUpdateId={activeUpdateId}
                  onDelete={setPendingDeleteTask}
                  onEdit={(task) => {
                    setEditingTask(task);
                    setSubmitError('');
                    setSubmitFieldErrors({});
                  }}
                  onStatusChange={handleStatusChange}
                  tasks={filteredTasks}
                />
              )}
            </div>
          </section>
        </div>
      </main>
      <ConfirmDialog
        confirmLabel="Delete task"
        description={
          pendingDeleteTask
            ? `This will permanently remove "${pendingDeleteTask.title}" from your list.`
            : ''
        }
        isOpen={Boolean(pendingDeleteTask)}
        isSubmitting={activeDeleteId === pendingDeleteTask?.id}
        onCancel={() => setPendingDeleteTask(null)}
        onConfirm={() => handleDeleteTask(pendingDeleteTask.id)}
        title="Delete this task?"
      />
    </>
  );
}

export default DashboardPage;
