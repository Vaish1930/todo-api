import jwt from "jsonwebtoken";

const JWT_SECRET =
  "sfbjkdfhkedfhjksfbvxbmvjksdflafbskjfhalfsfbsfa;hffkafakbfslfoiehrjsdfbsa,laoahfbaoi";

export const generateToken = (userData) =>
  jwt.sign(
    {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
    },
    JWT_SECRET
  );

export const verifyToken = (req, res, next) => {
  try {
    const token = req.header("authToken");
    if (!token) return res.status(401).json("Access Denied");

    const verifiedUser = jwt.verify(token, JWT_SECRET);
    req.user = verifiedUser;
    next();
  } catch (error) {
    res.status(401).json("Invalid Token");
  }
};
