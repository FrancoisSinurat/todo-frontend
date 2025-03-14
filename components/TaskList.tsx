"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, addTask, deleteTask, updateTask } from "../lib/api";
import { useState } from "react";

export default function TaskList() {
  const queryClient = useQueryClient();
  const [newTask, setNewTask] = useState("");
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");

  // Fetch tasks
  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  // Add task
  const addTaskMutation = useMutation({
    mutationFn: (task: { title: string; is_completed: boolean }) => addTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setNewTask("");
    },
    onError: () => alert("Failed to add task."),
  });

  // Update task (checkbox & title)
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updatedTask }: { id: number; updatedTask: any }) =>
      updateTask(id, updatedTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setEditTaskId(null);
    },
    onError: () => alert("Failed to update task."),
  });

  // Delete task
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    onError: () => alert("Failed to delete task."),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load tasks.</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-gradient-to-r from-gray-900 to-gray-700 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">To-Do List App </h2>

      {/* Input Form */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border p-2 flex-grow rounded bg-gray-800 text-white placeholder-gray-400"
          placeholder="Add new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          disabled={!newTask.trim() || addTaskMutation.isPending}
          onClick={() => addTaskMutation.mutate({ title: newTask.trim(), is_completed: false })}
        >
          {addTaskMutation.isPending ? "Adding..." : "Add"}
        </button>
      </div>

      {/* Task List */}
      <ul>
        {tasks.map((task: any) => (
          <li
            key={task.id}
            className="flex justify-between p-3 border-b border-gray-600 items-center bg-gray-800 rounded-lg my-2 transition hover:bg-gray-700"
          >
            <div className="flex items-center gap-3">
              {/* Checkbox dengan animasi */}
              <input
                type="checkbox"
                checked={task.is_completed}
                className="w-5 h-5 accent-green-500 transition"
                onChange={() =>
                  updateTaskMutation.mutate({
                    id: task.id,
                    updatedTask: { is_completed: !task.is_completed },
                  })
                }
              />
              {editTaskId === task.id ? (
                <input
                  type="text"
                  className="border p-1 rounded bg-gray-700 text-white"
                  value={editTaskTitle}
                  onChange={(e) => setEditTaskTitle(e.target.value)}
                />
              ) : (
                <span
                  className={`text-white ${task.is_completed ? "line-through text-gray-400" : ""}`}
                >
                  {task.title}
                </span>
              )}
            </div>

            <div className="flex gap-3 pl-3">
              {editTaskId === task.id ? (
                <button
                  className="text-green-400 hover:text-green-600"
                  onClick={() =>
                    updateTaskMutation.mutate({
                      id: task.id,
                      updatedTask: { title: editTaskTitle.trim() },
                    })
                  }
                >
                  ✔
                </button>
              ) : (
                <button
                  className="text-blue-400 hover:text-blue-500"
                  onClick={() => {
                    setEditTaskId(task.id);
                    setEditTaskTitle(task.title);
                  }}
                >
                  ✏️
                </button>
              )}

              <button
                className="text-red-400 hover:text-red-500"
                disabled={deleteTaskMutation.isPending}
                onClick={() => deleteTaskMutation.mutate(task.id)}
              >
                {deleteTaskMutation.isPending ? "..." : "✖"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
