// pages/api/auth.ts

import { NextApiRequest, NextApiResponse } from "next";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { username, password } = req.body;
    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ email: username }, { phone: username }],
        },
        include: {
          employee: true,
          role: {
            include: {
              permission: {
                include: {
                  modul: true,
                },
              },
            },
          },
        },
      });

      if (!user || !(await argon2.verify(user.password, password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ user }, process.env.NEXT_KEY, {
        expiresIn: "24h",
      });
      res.json({
        ...user,
        accessToken: token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
