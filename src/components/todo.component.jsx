import React, { useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-date-picker";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getTodo, updateTodo, deleteTodo } from "../api/index";
import { formatDate } from "./utils"


const Todo = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();

  const [currentTodo, setCurrentTodo] = useState({
    title: "",
    description: "",
    status: false,
    dueDate: formatDate(new Date()),
  });

  const [dateValue, onChange] = useState(
    new Date(
      currentTodo && currentTodo.dueDate ? currentTodo.dueDate : new Date()
    )
  );

  const {
    isLoading,
    isError,
    data: todo,
    error,
  } = useQuery({
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

  const updateTodoUnderEdit = (status = null) => {
    currentTodo.dueDate = dateValue;
    if (status !== null) {
      currentTodo.status = status;
    }
    updateTodoMutation.mutate({ id, ...currentTodo });
  };

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      navigate("/");
    },
  });

  const handleDelete = (id) => {
    deleteTodoMutation.mutate(id);
  };

  const deleteTodoUnderEdit = () => {
    handleDelete(currentTodo._id);
    navigate("/");
  };

  const handleInputChange = (event) => {
    event.preventDefault(); // prevent a browser reload/refresh
    const { name, value } = event.target;
    setCurrentTodo({ ...currentTodo, [name]: value });
  };

  if (isLoading) return "loading...";
  if (isError) return `Error: ${error.message}`;

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
