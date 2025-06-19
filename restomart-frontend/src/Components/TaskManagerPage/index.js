import { useState, useEffect } from "react";
import EachTask from "../EachTask";
import "./index.css";

const options = [
  { id: "ToDo", text: "Todo" },
  { id: "InProgress", text: "In Progress" },
  { id: "Completed", text: "Completed" },
];

const TaskManagerPage = () => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState(options[0].text);
  const [tasksList, setTasksList] = useState([]);
  const [editingOn, setEditingOn] = useState(null);
  const [editingItemTitle, setEditingItemTitle] = useState("");
  const [editingItemStatus, setEditingItemStatus] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:3000/tasks/");
      const data = await response.json();
      if (response.ok) {
        setTasksList(data);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const onChangeTitle = (event) => setTitle(event.target.value);
  const onChangeStatus = (event) => setStatus(event.target.value);

  const onSubmitAddTask = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/tasks/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          status,
          created_at: new Date(),
        }),
      });

      if (response.ok) {
        setTitle("");
        setStatus(options[0].text);
        fetchTasks();
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const onDeleteTask = async (id) => {
    try {
      await fetch(`http://localhost:3000/tasks/${id}`, { method: "DELETE" });
      fetchTasks();
    } catch (e) {
      console.log(e.message);
    }
  };

  const onEditTask = (id) => {
    const task = tasksList.find((t) => t.id === id);
    if (task) {
      setEditingOn(id);
      setEditingItemTitle(task.title);
      setEditingItemStatus(task.status);
    }
  };

  const onChangeEditTitle = (event) => setEditingItemTitle(event.target.value);
  const onChangeEditStatus = (event) => setEditingItemStatus(event.target.value);

  const onUpdateEditedTask = async (event, id) => {
    event.preventDefault();
    if (editingItemTitle.trim() === "") return;

    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingItemTitle,
          status: editingItemStatus,
          updated_at: new Date(),
        }),
      });

      if (response.ok) {
        setEditingOn(null);
        setEditingItemTitle("");
        setEditingItemStatus("");
        fetchTasks();
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div className="task-manager-page">
      <h1 className="page-heading">Manage your tasks</h1>
      <form className="add-task-form" onSubmit={onSubmitAddTask}>
        <h1 className="form-heading">Add Task</h1>
        <label className="label" htmlFor="Title">Title</label><br />
        <input
          type="text"
          className="input-container"
          id="Title"
          onChange={onChangeTitle}
          value={title}
          required
        /><br />
        <label className="label" htmlFor="Status">Status</label><br />
        <select
          id="Status"
          className="input-container"
          onChange={onChangeStatus}
          value={status}
        >
          {options.map((eachItem) => (
            <option key={eachItem.id}>{eachItem.text}</option>
          ))}
        </select>
        <button className="submit-btn" type="submit">Add</button>
      </form>

      <ul className="tasks-list-container">
        {tasksList.map((eachItem) => (
          <EachTask
            key={eachItem.id}
            eachItem={eachItem}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
            editingOn={editingOn}
            editingItemTitle={editingItemTitle}
            editingItemStatus={editingItemStatus}
            onChangeEditTitle={onChangeEditTitle}
            onChangeEditStatus={onChangeEditStatus}
            onUpdateEditedTask={onUpdateEditedTask}
          />
        ))}
      </ul>
    </div>
  );
};

export default TaskManagerPage;
