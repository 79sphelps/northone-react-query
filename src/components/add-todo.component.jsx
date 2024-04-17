import React, { useState } from "react";
import DatePicker from "react-date-picker";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { formatDate } from "./utils";
import { addTodo } from "../api/index";

const AddTodo = () => {
  let initialTodoState = {
    id: null,
    title: "",
    description: "",
    status: false,
    dueDate: formatDate(new Date()),
  };

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  let submitted = false;
  
  const [dateValue, onChange] = useState(new Date());

  const [TodoToAdd, setTodo] = useState({
    title: initialTodoState.title || "",
    description: initialTodoState.description || "",
    status: false,
    dueDate: formatDate(new Date()),
  });

  const addTodoMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      console.log("success bro!");
      navigate("/");
    },
  });

  const handleAddTodo = (todo) => {
    addTodoMutation.mutate({
      id: uuidv4(),
      ...todo,
    });
  };

  // if (!TodoToAdd) {
  //   let todoToAdd = JSON.parse(localStorage.getItem("todoToAdd"));
  //   if (!todoToAdd) {
  //     todoToAdd = {
  //       id: null,
  //       title: "",
  //       description: "",
  //       status: false,
  //       dueDate: formatDate(new Date()),
  //     };
  //     localStorage.setItem("todoToAdd", JSON.stringify(todoToAdd));
  //   }
  //   setTodo(todoToAdd);
  // }

  const handleInputChange = (e) => {
    e.preventDefault(); // prevent a browser reload/refresh
    setTodo({
      ...TodoToAdd,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (data) => {
    handleAddTodo(data);
    setTodo({
      title: "",
      description: "",
      status: false,
      dueDate: formatDate(new Date()),
    });
  };

  const saveTodo = () => {
    if (!dateValue) return;
    var data = {
      title: TodoToAdd.title,
      description: TodoToAdd.description,
      status: false,
      dueDate: dateValue,
    };
    handleSubmit(data);
    // localStorage.removeItem("todoToAdd");
  };

  const newTodo = () => {
    setTodo(initialTodoState);
    submitted = false;
  };

  return (
    <div className="submit-form">
      {submitted && TodoToAdd ? (
        <div>
          <h4>The new "To Do" item was created successfully!</h4>
          <button className="btn btn-success" onClick={() => newTodo()}>
            Add
          </button>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              required
              // value={TodoToAdd && TodoToAdd.title ? TodoToAdd.title : ''}
              value={TodoToAdd.title}
              onChange={(event) => handleInputChange(event)}
              name="title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              className="form-control"
              id="description"
              required
              // value={TodoToAdd && TodoToAdd.description ? TodoToAdd.description : ''}
              value={TodoToAdd.description}
              onChange={(event) => handleInputChange(event)}
              name="description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>{" "}
            <DatePicker onChange={onChange} value={dateValue} />
          </div>

          <button
            onClick={() => saveTodo(TodoToAdd)}
            className="btn btn-success"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default AddTodo;
