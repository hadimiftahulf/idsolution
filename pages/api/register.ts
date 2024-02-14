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
    const { email, password, phone, name } = req.body;
    const photo = "/avatar.png";

    try {
      //   // Cek apakah email sudah terdaftar
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ error: "Email is already registered" });
      }
      //   // Cek apakah email sudah terdaftar
      const existingPhone = await prisma.user.findUnique({
        where: { phone },
      });

      if (existingPhone) {
        return res.status(400).json({ error: "Phone is already registered" });
      }

      // // Hash password sebelum disimpan
      const hashedPassword = await argon2.hash(password);

      // // Tambahkan user baru
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          phone,
          roleId: 3,
        },
      });
      if (newUser) {
        await prisma.employee.create({
          data: {
            userId: newUser.id,
            name,
            photo,
          },
        });
      }

      res.status(201).json({
        message: "User created successfully",
      });
    } catch (error) {
      // console.error(error);
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
