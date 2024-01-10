import { useEffect, useRef, useState } from "react";
import "./App.scss";

const App = () => {
  const itemRef = useRef();
  const editInputRef = useRef();
  const [task, setTask] = useState([
    {
      id: "1",
      title: "Buy food for dinner",
      completed: true,
    },
    {
      id: "2",
      title: "Call Marie at 10.00 PM",
      completed: false,
    },
    {
      id: "3",
      title: "Write a react blog post",
      completed: true,
    },
  ]);
  const [inputTask, setInputTask] = useState("");
  const [todoEditing, setTodoEditing] = useState(null);
  const [editingText, setEditingText] = useState();
  const [open, setOpen] = useState(true);
  const adjacentRef = useRef(null);
  const [filteredTodo, setFilteredTodo] = useState(task);
  const [showFilteredTodo, setShowFilteredTodo] = useState(false);
  const [percProg, setPercProg] = useState({
    completedTask: "",
    completedPercent: "",
  });

  const handleCheck = (id) => {
    setTask(
      task.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
    setFilteredTodo(
      filteredTodo.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const addTask = () => {
    setTask((prevTask) => [
      ...prevTask,
      {
        id: Object.keys(task).length + 1,
        title: inputTask,
        completed: false,
      },
    ]);
    setFilteredTodo((prevTask) => [
      ...prevTask,
      {
        id: Object.keys(filteredTodo).length + 1,
        title: inputTask,
        completed: false,
      },
    ]);
    setInputTask("");
  };

  const handleOption = (e, id) => {
    const clickedItem = e.target;
    const adjacentElement = clickedItem.nextSibling;

    if (adjacentElement && open) {
      adjacentRef.current = adjacentElement;
      adjacentRef.current.classList.remove("option-box-hide");
      adjacentRef.current.classList.add("option-box-show");
    } else if (!open) {
      adjacentRef.current.classList.remove("option-box-show");
      adjacentRef.current.classList.add("option-box-hide");
    }
    setOpen(!open);
  };

  const editTodo = (id) => {
    setTask(
      task.map((item) =>
        item.id === id ? { ...item, title: item.title } : item
      )
    );
  };

  const submitEdits = (id, title) => {
    const updatedTodos = [...task].map((item) => {
      if (item.id === id) {
        item.title = editingText;
      }
      return item;
    });
    setTask(updatedTodos);
    setTodoEditing(null);
  };

  const deleteTodo = (id) => {
    let updatedTodos = [...task].filter((task) => task.id !== id);
    setTask(updatedTodos);
    let updatedFilterTodos = [...filteredTodo].filter((task) => task.id !== id);
    setFilteredTodo(updatedFilterTodos);
  };

  const handleFilter = (e) => {
    let status = e.target.value;
    if (status == "done") {
      setFilteredTodo(task.filter((item) => item.completed === true));
    } else if (status == "undone") {
      setFilteredTodo(task.filter((item) => item.completed === false));
    } else if (status == "all") {
      setFilteredTodo(task);
    }
    setShowFilteredTodo(true);
  };

  useEffect(() => {
    setPercProg({
      completedTask: task.filter((item) => item.completed).length,
      completedPercent: (
        (task.filter((item) => item.completed).length * 100) /
        task.length
      ).toPrecision(4),
    });
  }, [task]);

  const progressStyle = {
    width: `${ percProg.completedPercent }`,
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: "4px",
  }

  return (
    <div className="app-container">
      <div className="todo-container">
        <div className="progress">
          <p>Progress</p>
          <div className="progress-bar">
            <div className="progress-percent" style={progressStyle}>
            </div>
          </div>
          <p className="completed-task">
            <span className="task-percent">{percProg.completedTask}</span>{" "}
            completed
            <span className="task-percent"> {percProg.completedPercent} %</span>
            <span> Done</span>
          </p>
        </div>
        <div className="header-task">
          <h1>Tasks</h1>
          <select className="task-condition" onChange={handleFilter}>
            <option value="all">All</option>
            <option value="done">Done</option>
            <option value="undone">Undone</option>
          </select>
        </div>

        {({ showFilteredTodo } ? filteredTodo : task).map((taskItem) => {
          const { id, title, completed } = taskItem;
          return (
            <>
              <div id={id} key={id} className="todo-list" ref={itemRef}>
                <div className="todo-box">
                  {!(id === todoEditing) ? (
                    <>
                      <input
                        type="checkbox"
                        checked={completed}
                        onChange={() => handleCheck(id)}
                      />
                      <span
                        className={
                          completed === true
                            ? "todo-completed todo-title"
                            : "todo-uncomplete todo-title"
                        }
                      >
                        {title}
                      </span>
                      <div
                        key={id}
                        id={id}
                        className="menu-meatball"
                        onClick={(e) => handleOption(e, id)}
                      >
                        <span className="circle"></span>
                        <span className="circle"></span>
                        <span className="circle"></span>
                      </div>
                      <div className="option-box option-box-hide">
                        <ul>
                          {id === todoEditing ? (
                            <li onClick={() => submitEdits(id, title)}>Save</li>
                          ) : (
                            <li
                              className="todo-edit"
                              onClick={() => setTodoEditing(id, title)}
                            >
                              Edit
                            </li>
                          )}
                          <li
                            className="todo-delete"
                            onClick={() => deleteTodo(id)}
                          >
                            Delete
                          </li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        className="todo-input"
                        placeholder="Update task"
                        ref={editInputRef}
                        onChange={(e) => setEditingText(e.target.value)}
                        autoFocus
                      />
                      <button
                        onClick={() => submitEdits(id)}
                        className="todo-save-btn"
                      >
                        Save
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
          );
        })}

        <input
          type="text"
          name="task"
          placeholder="Add your todo..."
          className="input-task"
          value={inputTask}
          onInput={(event) => setInputTask(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") addTask();
          }}
        ></input>
      </div>
    </div>
  );
};

export default App;
