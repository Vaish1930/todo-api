import { Router } from "express";
import Todo from "../models/Todo.js";
import { verifyToken } from "../utils.js";

const router = Router();

router.get("/todos", verifyToken, async (req, res) => {
  try {
    // const { userId } = req.query;
    const todos = await Todo.find({ userId: req.user._id }).populate(
      "userId",
      "-password -__v"
    );

    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json(`Something went wrong ${error}`);
  }
});

router.post("/todos/create", verifyToken, async (req, res) => {
  try {
    const { title } = req.body;
    const todo = new Todo({ title, userId: req.user._id }); // local memory (same as java object)
    const createdTodo = await todo.save(); // database
    res.status(201).json(createdTodo); //  http response to server
  } catch (error) {
    res.status(500).json(`Something went wrong ${error}`);
  }
});

router.patch("/todos/update/:id", verifyToken, async (req, res) => {
  try {
    const { title, status } = req.body;
    const todo = await Todo.findById(req.params.id);
    const userId = req.user._id;
    if (userId !== todo.userId.toString())
      // toString is used because in mongoDb id is stored in form of object_id
      return res.status(401).json(`You can't update the todo`);

    if (title) todo.title = title;
    if (status) todo.status = status;
    const updatedTodo = await todo.save();
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json(`Something went wrong ${error}`);
  }
});

router.delete("/todos/delete/:id", verifyToken, async (req, res) => {
  try {
    // const { userId } = req.body;
    const todo = await Todo.findById(req.params.id);
    const userId = req.user._id;
    if (userId !== todo.userId.toString())
      return res
        .status(401)
        .json(
          `You can't delete this todo , you don't have the rights to do this`
        );

    const deletedTodo = await Todo.findOneAndDelete({ _id: req.params.id });
    res.status(200).json(deletedTodo);
  } catch (error) {
    res.status(500).json(`Something went wrong ${error}`);
  }
});

export default router;

// In "PUT" updating all columns is necessary but in "PATCH" we can update whichever columns we want
