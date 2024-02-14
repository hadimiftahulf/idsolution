// pages/api/register.ts

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();
  if (req.method === "POST") {
    const { email, phone, newPassword } = req.body;

    try {
      const checkUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { phone }],
        },
      });

      if (!checkUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = await prisma.user.update({
        where: {
          email,
          phone,
        },
        data: {
          password: await argon2.hash(newPassword),
        },
      });
      res.status(200).json({ user });
    } catch (error) {
      // console.error(error);
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
