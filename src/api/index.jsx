export async function getTodos() {
  const response = await fetch("http://localhost:8080/api/todos");
  return response.json();
}

export async function getTodo(id) {
  const response = await fetch(`http://localhost:8080/api/todos/${id}`);
  return response.json();
}

export async function addTodo(newPost) {
  const response = await fetch(`http://localhost:8080/api/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPost),
  });
  return response.json();
}

export async function updateTodo(updatedTodo) {
  const response = await fetch(
    `http://localhost:8080/api/todos/${updatedTodo.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    }
  );
  return response.json();
}

export async function deleteTodo(id) {
  const response = await fetch(`http://localhost:8080/api/todos/${id}`, {
    method: "DELETE",
  });
  return response.json();
}

export async function deleteTodos(id) {
  const response = await fetch(`http://localhost:8080/api/todos`, {
    method: "DELETE",
  });
  return response.json();
}

export async function findByTitle(title) {
  const response = await fetch(
    `http://localhost:8080/api/todos?title=${title}`
  );
  return response.json();
}
