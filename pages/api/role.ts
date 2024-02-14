// pages/api/users/index.ts
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../../middlewares/authMiddleware";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const role = await prisma.role.findMany({});

    res.status(200).json({ role });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default authMiddleware(handler); // Gunakan middleware di sini
