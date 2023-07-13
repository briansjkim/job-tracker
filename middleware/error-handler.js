import "express-async-errors";
import { StatusCodes } from "http-status-codes";

// This middleware will be responsible for handling all errors that occur, like errors from mongoose
export const errorHandlerMiddleware = (err, req, res, next) => {
  const defaultError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong. Try again later",
  };

  if (err.name === "ValidationError") {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
  }

  if (err.code && err.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`;
  }

  if (err.name === "CastError") {
    defaultError.statusCode = 404;
    defaultError.msg = `No item found with id : ${err.value}`;
  }

  res.status(defaultError.statusCode).json({ msg: defaultError.msg });
};
