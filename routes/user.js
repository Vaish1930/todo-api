import { Router } from "express";
import User from "../models/User.js";

// instance created(router)
const router = Router();

// routes
router.post("/register", async (req, res) => {
  try {
    const { email } = req.body;
    const doesUserExist = await User.findOne({ email });
    if (doesUserExist)
      return res.status(400).json(`User with this ${email} already exists`);

    const user = new User(req.body); // instance of user created
    const createdUser = await user.save();
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json(`Something went wrong,error: ${error}`);
  }
});

router.get("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const doesUserExist = await User.findOne({ email });
    if (!doesUserExist) return res.status(400).json(`Invalid Email`);

    if (password !== doesUserExist.password)
      return res.status(400).json(`Inavlid Password`);

    res.status(200).json(doesUserExist);
  } catch (error) {
    res.status(500).json(`Something went wrong,error: ${error}`);
  }
});

export default router;

// to use await function must be async
