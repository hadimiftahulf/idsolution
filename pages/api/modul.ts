// pages/api/users/index.ts
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { handleAccess } from "@/middlewares/accessMiddleware";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const modul = await prisma.modul.findMany();

    res.status(200).json({ modul });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default authMiddleware(handler); // Gunakan middleware di sini
