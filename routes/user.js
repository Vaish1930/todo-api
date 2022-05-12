import bcrypt from "bcryptjs";
import { Router } from "express";
import User from "../models/User.js";
import { generateToken } from "../utils.js";

// instance created(router)
const router = Router();

// routes
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const doesUserExist = await User.findOne({ email });
    if (doesUserExist)
      return res.status(400).json(`User with this ${email} already exists`);

    // salt creation
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ ...req.body, password: hashedPassword }); // instance of user created
    const createdUser = await user.save();
    const token = generateToken(createdUser);

    res.status(201).header("authToken", token).json({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      token,
    });
  } catch (error) {
    res.status(500).json(`Something went wrong,error: ${error}`);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const doesUserExist = await User.findOne({ email });
    if (!doesUserExist) return res.status(400).json(`Invalid Email`);

    const isPasswordValid = await bcrypt.compare(
      password,
      doesUserExist.password
    );

    if (!isPasswordValid) return res.status(400).json(`Inavlid Password`);

    const token = generateToken(doesUserExist);

    res.status(200).header("authToken", token).json({
      _id: doesUserExist._id,
      name: doesUserExist.name,
      email: doesUserExist.email,
      token,
    });
  } catch (error) {
    res.status(500).json(`Something went wrong,error: ${error}`);
  }
});

export default router;

// to use await function must be async
// Steps of encrypting : register -> encrypt , login -> compare
// A salt is a random string that makes the hash unpredictable. Bcrypt is a popular and trusted method for salt and hashing passwords.
