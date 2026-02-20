import type { Response } from "express";
export interface CustomError extends Error {
  status: number;
  notForLog?: boolean;
  name: string;
  original?: { code?: string };
  parent?: { sqlMessage?: string };
  details?: { message?: string }[];
}

export const doNotLogError = (message: string, status: number): CustomError => {
  const error = new Error(message) as CustomError;
  error.notForLog = true;
  error.status = status;
  return error;
};

export const throwCommonError = (error: CustomError, res: Response) => {
  if (
    error?.name === "SequelizeUniqueConstraintError" &&
    error?.original?.code === "ER_DUP_ENTRY"
  ) {
    console.error("Sequelize duplicate error:", error);
    return res.status(409).json({
      status: "error",
      message:
        error?.parent?.sqlMessage?.split(" for key")[0] || "duplicate data",
    });
  }

  if (error?.name === "ValidationError") {
    console.error("Validation error:", error);
    return res.status(409).json({
      status: "error",
      message: error?.details?.[0]?.message || "validation error",
    });
  }

  if (!error?.notForLog) console.error(error);

  if (error?.notForLog) {
    return res
      .status(error?.status || 200)
      .json({ status: "error", message: error?.message });
  }

  if (error?.status) {
    return res
      .status(error.status)
      .json({ status: "error", message: error.message });
  }

  return res
    .status(500)
    .json({ status: "error", message: "Internal server error!" });
};
