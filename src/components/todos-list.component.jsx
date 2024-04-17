import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { faEdit, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@fullcalendar/react/dist/vdom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import DatePicker from "react-date-picker";
import { useQuery } from "@tanstack/react-query";
import { getTodos, deleteTodos, findByTitle } from "../api/index.jsx";
import { formatDate } from "./utils"

const TodosList = () => {
  const datePicker = useRef({ isOpen: true });

  const [currentTodo, setCurrentTodo] = useState({
    title: "",
    description: "",
    status: false,
    dueDate: formatDate(new Date()),
  });

  const [todos, setTodos] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchTitle, setSearchTitle] = useState("");

  const mapTodoEventsToCalendar = (arr = []) => {
    const result = arr.map((obj) => {
      const res = {};
      res["title"] = obj["title"];
      res["date"] = formatDate(obj["dueDate"]);
      return res;
    });
    return result;
  };

  let {
    isLoading,
    isError,
    // data: todos,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos, // fetch the posts using the async call
    onSuccess: (data) => setTodos(data),
  });

  const onChangeSearchTitle = (event) => {
    event.preventDefault(); // prevent a browser reload/refresh
    setSearchTitle(event.target.value);
  };

  const refreshList = () => {
    getTodos();
    setCurrentTodo(null);
    setCurrentIndex(-1);
  };

  const setActiveTodo = (todo, index) => {
    setCurrentTodo(todo);
    setCurrentIndex(index);
    if (datePicker && datePicker.current && datePicker.current.openCalendar) {
      datePicker.current.openCalendar();
    }
  };

  const removeAllTodos = () => {
    deleteTodos();
    refreshList();
  };

  const findItemByTitle = () => {
    let t = findByTitle(searchTitle);
    t.then((data) => {
      setTodos(data);
      setCurrentTodo(null);
      setCurrentIndex(-1);
    });
  };

  // const {
  //   // isLoading,
  //   // isError,
  //   // data: post,
  //   data: todo,
  //   // error,
  // } = useQuery({
  //   queryKey: ["todos"],
  //   queryFn: () => findByTitle(searchTitle),
  //   // onSuccess: (todo) => setCurrentTodo(todo),
  // });

  if (isLoading) return "loading...";
  if (isError) return `Error: ${error.message}`;

  return (
    <div className="list row">
      <div className="col-md-8" style={{ margin: "0 auto" }}>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchTitle}
            onChange={(searchTitle) => onChangeSearchTitle(searchTitle)}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => findItemByTitle()}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <h4>To Do's List</h4>

        <ul className="list-group">
          {todos &&
            todos.map((todo, index) => (
              <li
                className={
                  "list-group-item-action list-group-item " +
                  (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveTodo(todo, index)}
                key={index}
              >
                {todo.title}
              </li>
            ))}
        </ul>

        <button
          className="m-3 btn btn-sm btn-danger"
          onClick={() => removeAllTodos()}
        >
          Remove All
        </button>
      </div>
      <div className="col-md-6">
        {currentTodo ? (
          <div>
            <h4>"To Do" Item</h4>
            <div>
              <label>
                <strong>Title:</strong>
              </label>{" "}
              {currentTodo.title}
            </div>
            <div>
              <label>
                <strong>Description:</strong>
              </label>{" "}
              {currentTodo.description}
            </div>
            <div>
              <label>
                <strong>Status:</strong>
              </label>{" "}
              {currentTodo.status ? "Done" : "Pending"}
            </div>
            {/* <div>
              <label>
                <strong>Due Date:</strong>
              </label>{" "}
              {currentTodo.dueDate}
            </div> */}
            <div className="form-group">
              <label htmlFor="dueDate">
                <strong>Due Date:</strong>
              </label>{" "}
              <DatePicker
                isOpen={true}
                ref={datePicker}
                value={new Date(currentTodo.dueDate)}
              />
            </div>
            <Link
              to={"/todos/" + currentTodo._id}
              className="btn btn-sm btn-warning"
            >
              Edit <FontAwesomeIcon icon={faEdit} />
            </Link>
          </div>
        ) : (
          <div>
            <br />
            <p>Click on a "To Do" item to show detailed info</p>
          </div>
        )}
      </div>

      <div className="col-md-12" id="calendar">
        {todos ? (
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            weekends={true}
            events={mapTodoEventsToCalendar(todos)}
          />
        ) : (
          <div>No "To Do" Events to Show</div>
        )}
      </div>
    </div>
  );
};

export default TodosList;
