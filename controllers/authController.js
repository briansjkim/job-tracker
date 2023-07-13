import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";
import { attachCookie } from "../utils/attachCookies.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    // next() - normally, we'd use next() and pass in the error, but because we're using express-async-errors, we don't
    throw new BadRequestError("Please provide all values");
  }

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("Email address is already in use");
  }

  const user = await User.create({ name, email, password });
  const token = user.createJWT();

  attachCookie({ res, token });

  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
    },
    token,
    location: user.location,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all values");
  }

  // Need to include password when returning our password because we need to match input pw with the saved pw
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();
  // then we need to set password to undefined so that the pw isn't sent back to the f/e
  // we can do the same thing as we did in register, but rather than repeating code, we can just do this
  user.password = undefined;

  attachCookie({ res, token });

  res.status(StatusCodes.OK).json({ user, token, location: user.location });
};

const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;
  if ((!email || !name || !lastName, !location)) {
    throw new BadRequestError("Please provide all values");
  }

  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;

  // this is going to trigger our pre - save function from our User model
  // but because the pw isn't sent to the b/e, this.password is just the hashed pw
  // and we hash it again in the pre function, so we're just hashing the hashed pw
  await user.save();
  // to resolve this, we can add a check to see if the pw has been modified

  // we don't need to create a new token because user's id hasn't changed,
  // but if we do create a new token, the user gets a new expiration date instead of their old one
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user,
    location: user.location,
  });
};

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  res.status(StatusCodes.OK).json({ user, location: user.location });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out" });
};

export { register, login, updateUser, getCurrentUser, logout };
