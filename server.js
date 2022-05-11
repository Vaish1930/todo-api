import express from "express";
import cors from "cors";
import connectDb from "./db.js";
import userRouter from "./routes/user.js";
import todoRouter from "./routes/todo.js";

// creating an instance of express-app , a simple app is created
const app = express();
const PORT = process.env.PORT || 80;

// middlewares
app.use(express.json());
app.use(cors());

await connectDb();

// routes
app.get("/", (req, res) => res.json("Welcome to to-do-list"));
app.use("/api", userRouter);
app.use("/api", todoRouter);

// listener
app.listen(PORT, () => console.log(`Listening on localhost ${PORT}`));

// XDjNzuDUHEg9cfxu
