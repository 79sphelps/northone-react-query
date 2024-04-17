import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-date-picker";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getTodo, updateTodo, deleteTodo } from "../api/index";

// import {
//   setCurrentTodo,
//   setMessage,
//   updateTodo,
//   deleteTodo,
// } from "../redux/actions";
// import { selectCurrentTodo, selectMessage } from "../redux/selectors";

const formatDate = (date) => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

const Todo = (props) => {
  // const dispatch = useDispatch();
  // const currentTodo = useSelector(selectCurrentTodo);
  // const message = useSelector(selectMessage);

  // localStorage.setItem("currentTodo", JSON.stringify(todo));
  // localStorage.setItem("currentIndex", JSON.stringify(currentIndex));
  // let currentTodo = null
  // let currentIndex = null

  const [currentTodo, setCurrentTodo] = useState({
    title: "",
    description: "",
    status: false,
    dueDate: formatDate(new Date()),
  });

  // const [currentIndex, setCurrentIndex] = useState(-1);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    isLoading,
    isError,
    // data: post,
    data: todo,
    error,
  } = useQuery({
    // queryKey: ["posts", id],
    queryKey: ["todos", id],
    queryFn: () => getTodo(id),
    onSuccess: (todo) => setCurrentTodo(todo),
  });

  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      navigate("/");
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ['posts']});
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      navigate("/");
    },
  });

  const handleDelete = (id) => {
    deleteTodoMutation.mutate(id);
  };

  const [dateValue, onChange] = useState(
    new Date(
      currentTodo && currentTodo.dueDate ? currentTodo.dueDate : new Date()
    )
  );

  // useEffect(() => {
  //   // clearMessage();
  //   checkLocalStorage();
  // }, []);

  if (isLoading) return "loading...";
  if (isError) return `Error: ${error.message}`;

  // const clearMessage = () => dispatch(setMessage(""));

  // const checkLocalStorage = () => {
  //   if (!currentTodo) {
  //     let todo = localStorage.getItem("currentTodo");
  //     let index = localStorage.getItem("currentIndex")
  //     // dispatch(setCurrentTodo(JSON.parse(todo)));
  //     // currentTodo = JSON.parse(todo)
  //     setCurrentTodo(JSON.parse(todo));
  //     // currentIndex = JSON.parse(index)
  //     setCurrentIndex(JSON.parse(index));
  //   }
  // };

  const handleInputChange = (event) => {
    event.preventDefault(); // prevent a browser reload/refresh
    const { name, value } = event.target;

    // console.log('----')
    // console.log(name);
    // console.log(value);

    // dispatch(setCurrentTodo({ ...currentTodo, [name]: value }));
    // currentTodo = { ...currentTodo, [name]: value }

    setCurrentTodo({ ...currentTodo, [name]: value });
    // console.log('currentTodo: ', currentTodo)
  };

  const updateTodoUnderEdit = (status = null) => {
    currentTodo.dueDate = dateValue;
    if (status !== null) {
      currentTodo.status = status;
    }
    // dispatch(updateTodo({ id: currentTodo._id, todo: currentTodo }));

    updateTodoMutation.mutate({ id, ...currentTodo });
  };

  const deleteTodoUnderEdit = () => {
    // dispatch(deleteTodo({ id: currentTodo._id }));
    handleDelete(currentTodo._id);
    // props.history.push("/todos");
  };

  return (
    <div>
      {currentTodo ? (
        <div className="edit-form">
          <h4>To Do</h4>
          <form>
            <div className="form-group">
              <label htmlFor="title">
                <strong>Title:</strong>
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={currentTodo.title}
                onChange={(currentTodo) => handleInputChange(currentTodo)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">
                <strong>Description:</strong>
              </label>
              <input
                type="text"
                className="form-control"
                id="description"
                name="description"
                value={currentTodo.description}
                onChange={(currentTodo) => handleInputChange(currentTodo)}
              />
            </div>

            <div className="form-group">
              <label>
                <strong>Status:</strong>{" "}
              </label>
              {currentTodo.status ? "Done" : "Pending"}
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">
                <strong>Due Date:</strong>
              </label>{" "}
              <DatePicker onChange={onChange} value={dateValue} />
            </div>
          </form>

          {currentTodo.status ? (
            <button
              className="btn btn-primary mr-2"
              onClick={() => updateTodoUnderEdit(false)}
            >
              Mark Pending
            </button>
          ) : (
            <button
              className="btn btn-primary mr-2"
              onClick={() => updateTodoUnderEdit(true)}
            >
              Mark Done
            </button>
          )}

          <button
            className="btn btn-danger mr-2"
            onClick={() => deleteTodoUnderEdit()}
          >
            Delete <FontAwesomeIcon icon={faTrash} />
          </button>

          <button
            type="submit"
            className="btn btn-success mr-2"
            onClick={() => updateTodoUnderEdit()}
          >
            Update
          </button>
          {/* <p>{message}</p> */}
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a "To Do"...</p>
        </div>
      )}
    </div>
  );
};

export default Todo;
