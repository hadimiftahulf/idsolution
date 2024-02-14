// middlewares/authMiddleware.ts
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const secretKey = process.env.NEXT_KEY;

export const authMiddleware =
  (handler: (arg0: NextApiRequest, arg1: NextApiResponse) => any) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Verifikasi token
      const decoded = jwt.verify(token, secretKey);
      //   console.log(decoded);
      req.query.session = decoded;

      return handler(req, res);
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: "Invalid token" });
    }
  };
