import { Request, Response } from "express";

export const uploadSalarySlip = (
  req: Request,
  res: Response
): void => {
  try {
    if (!req.file) {
      res.status(400).json({
        error: "No file uploaded",
      });
      return;
    }

    res.status(200).json({
      message: "Salary slip uploaded successfully",
      url: req.file.path,
    });
  } catch (error) {
    console.error("Upload Error:", error);

    res.status(500).json({
      error: "Failed to upload file",
    });
  }
};