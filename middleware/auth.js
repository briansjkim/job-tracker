import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/index.js";

export const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    throw new UnauthenticatedError("Authentication Invalid");
  }

  // ** Code for just using JWT
  // check header
  // const authHeader = req.headers.authorization;
  // if (!authHeader || !authHeader.startsWith("Bearer")) {
  //   throw new UnauthenticatedError("Authentication Invalid");
  // }
  // since auth header looks like Bearer <token>, we want to split it to get just the token
  // const token = authHeader.split(" ")[1];

  try {
    // when we created our token, we passed in the userId, JWT_SECRET, and the lifetime (UserSchema)
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // the payload is essentially what we passed in when we created the jwt in UserSchema.
    // So, we should expect an object with userId and the expiration date of the token in ms (expiresIn property), and when the token was issued
    const testUser = payload.userId === "64b01c1a031b330f37d969cf";
    req.user = { userId: payload.userId, testUser };
    next();
  } catch (error) {
    // if the token is expired or tampered with
    throw new UnauthenticatedError("Authentication Invalid");
  }
};
