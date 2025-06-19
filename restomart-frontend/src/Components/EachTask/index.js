import { MdDeleteOutline, MdEdit } from "react-icons/md";

import "./index.css";

const EachTask = (props) => {
  const {
    eachItem,
    onDeleteTask,
    onEditTask,
    editingOn,
    editingItemTitle,
    editingItemStatus,
    onChangeEditTitle,
    onChangeEditStatus,
    onUpdateEditedTask,
  } = props;

  const classNameForstatus =
    eachItem.status === "Completed"
      ? "completed-status-text"
      : "not-completed-status-text";

  const onClickDeleteBtn = () => {
    onDeleteTask(eachItem.id);
  };

  const onClickEditBtn = () => {
    onEditTask(eachItem.id);
  };

  return (
    <li className="each-task" key={eachItem.id}>
      {editingOn === eachItem.id ? (
        <form onSubmit={(e) => onUpdateEditedTask(e, eachItem.id)}>
          <input
            className="input-container"
            type="text"
            value={editingItemTitle}
            onChange={onChangeEditTitle}
            autoFocus
          />
          <select
            className="input-container"
            value={editingItemStatus}
            onChange={onChangeEditStatus}
          >
            <option>Todo</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <button type="submit" className="submit-btn">
            Save
          </button>
        </form>
      ) : (
        <>
          <p className="title">{eachItem.title}</p>
          <p className={classNameForstatus}>{eachItem.status}</p>
          <p>{eachItem.created_at}</p>
          {!eachItem.updated_at || eachItem.updated_at === "undefined" ? (
            <p>Not updated till now</p>
          ) : (
            <p>{eachItem.updated_at}</p>
          )}
          <button
            className="delete-btn"
            type="button"
            onClick={onClickDeleteBtn}
          >
            <MdDeleteOutline />
          </button>
          <button
            className="delete-btn"
            type="button"
            onClick={onClickEditBtn}
          >
            <MdEdit />
          </button>
        </>
      )}
    </li>
  );
};

export default EachTask;
