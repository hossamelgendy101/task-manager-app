import TaskCard from './TaskCard';

function TaskList({
  activeDeleteId,
  activeStatusId,
  activeUpdateId,
  onDelete,
  onEdit,
  onStatusChange,
  tasks,
}) {
  return (
    <section className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          isDeleting={activeDeleteId === task.id}
          isStatusUpdating={activeStatusId === task.id}
          isUpdating={activeUpdateId === task.id}
          key={task.id}
          onDelete={onDelete}
          onEdit={onEdit}
          onStatusChange={onStatusChange}
          task={task}
        />
      ))}
    </section>
  );
}

export default TaskList;

