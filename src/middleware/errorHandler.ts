import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/customError";

type ValidationErrorType = {
  type: string;
  value: string;
  msg: string;
  path: string;
  location: string;
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  console.log("Something went wrong", err);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({
      errors: err.serializeErrors(),
    });
  }

  res.status(400).send({
    errors: [{ message: "Something went wrong" }],
  });
};
