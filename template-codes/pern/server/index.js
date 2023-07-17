const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json()); //req.body
app.listen(5000, () => {
  console.log("server is listening on port 5000...");
});

//ROUTES//

// create a todo
// app.post means HTTP POST method
// req is the request object sent by the client
// res is the response object sent back to the client
app.post("/todos", async (req, res) => {
  try {
    // req.body is a JSON body (payload) of the http request
    const { description } = req.body;
    const newTodo = await pool.query(
      // RETURNING * means return that data back to the client
      // the returned data is stored in newTodo
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );
    // res.json convert the data to JSON format
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// get all todos
// app.get means HTTP GET method
// req argument is not used here (it is a GET request)
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// get a todo
// :id makes it a dynamic route (id is a parameter)
// read url from client and store it in property "id" of req.params
// Example: if user send a GET request to /todos/1, then req.params.id = 1
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
      id,
    ]);
    res.json(todo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// update a todo
// HTTP PUT request is used to update data
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params; //WHERE
    const { description } = req.body; //SET
    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2",
      [description, id]
    );
    res.json("Todo was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

// delete a todo
// HTTP DELETE request is used to delete data
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params; //WHERE
    const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
      id,
    ]);
    res.json("Todo was deleted!");
  } catch (err) {
    console.error(err.message);
  }
});
