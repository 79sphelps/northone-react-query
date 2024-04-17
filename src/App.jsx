import { Route, Routes, Link } from "react-router-dom"
// import EditPost from "./pages/EditPost"
// import Post from "./pages/Post"
import TodosList from "./components/todos-list.component"


// import { Switch, Route, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { faHome, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// import { setSubmitted, setMessage } from "./redux/actions";
import AddTodo from "./components/add-todo.component";
import Todo from "./components/todo.component";
// import TodosList from "./components/todos-list.component";

function App() {
  return (
    // <div>
    //   <h1>Awesome blog</h1>
    //   <Routes>
    //     <Route path="/" element={<TodosList />} />
    //     {/* <Route path="/tutorials/:id" element={<Post />} />
    //     <Route path="/tutorials/:id/edit" element={<EditPost />} /> */}
    //   </Routes>
    // </div>

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
              // onClick={() => initializeTodoToAdd()}
            >
              Add{' '}<FontAwesomeIcon icon={faPlus} />
            </Link>
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Routes>
          {/* <Route exact path={["/", "/todos"]} component={TodosList} /> */}
          <Route exact path="/" element={<TodosList />} />
          {/* <Route exact path="/add" component={AddTodo} />
          <Route path="/todos/:id" component={Todo} /> */}

          <Route exact path="/add" element={<AddTodo />} />
          <Route path="/todos/:id" element={<Todo />} /> 
        </Routes>
      </div>
    </div>

  )
}

export default App
