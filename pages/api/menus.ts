// pages/api/users/index.ts
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { handleAccess } from "@/middlewares/accessMiddleware";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const session: any = req.query.session as string | undefined;
    const roleId = session?.user?.roleId;

    const permission = await prisma.permission.findMany({
      where: {
        roleId: roleId,
      },
      include: {
        modul: true,
      },
    });

    res.status(200).json({ permission });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default authMiddleware(handler); // Gunakan middleware di sini
