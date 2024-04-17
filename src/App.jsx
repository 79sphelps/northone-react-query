import { Route, Routes, Link } from "react-router-dom";
import { faHome, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TodosList from "./components/todos-list.component";
import AddTodo from "./components/add-todo.component";
import Todo from "./components/todo.component";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/" className="navbar-brand">
          <FontAwesomeIcon icon={faHome} />
        </a>

        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/"} className="nav-link">
              To Do List
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to={"/add"}
              className="nav-link"
            >
              Add <FontAwesomeIcon icon={faPlus} />
            </Link>
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route exact path="/" element={<TodosList />} />
          <Route exact path="/add" element={<AddTodo />} />
          <Route path="/todos/:id" element={<Todo />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
